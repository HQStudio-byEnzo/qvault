export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  await enforceRateLimit(event, 'organization-create', 60, 60 * 1000, String(session.user.id))
  const db = useDB()
  const body = requireRecord(await readBody(event))
  const kind = body.kind
  const name = requireString(body.name, 'Name', { min: 1, max: 80 })
  const color = typeof body.color === 'string' && /^#[0-9a-f]{6}$/i.test(body.color) ? body.color : '#4ade80'
  const id = crypto.randomUUID()

  if (kind === 'vault') {
    await db.execute({ sql: "INSERT INTO vaults (id, user_id, name, color, is_default, created_at, updated_at) VALUES (?, ?, ?, ?, 0, datetime('now'), datetime('now'))", args: [id, session.user.id, name, color] })
  } else if (kind === 'folder') {
    const vaultId = requireString(body.vault_id, 'Vault', { min: 1, max: 128 })
    const vault = await db.execute({ sql: 'SELECT id FROM vaults WHERE id = ? AND user_id = ?', args: [vaultId, session.user.id] })
    if (!vault.rows.length) throw createError({ statusCode: 404, message: 'Coffre introuvable.' })
    const parentId = typeof body.parent_id === 'string' ? body.parent_id.slice(0, 128) : null
    if (parentId) {
      const parent = await db.execute({
        sql: 'SELECT id FROM folders WHERE id = ? AND vault_id = ? AND user_id = ?',
        args: [parentId, vaultId, session.user.id],
      })
      if (!parent.rows.length) throw createError({ statusCode: 400, message: 'Dossier parent introuvable.' })
    }
    await db.execute({ sql: "INSERT INTO folders (id, user_id, vault_id, name, parent_id, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))", args: [id, session.user.id, vaultId, name, parentId] })
  } else if (kind === 'tag') {
    await db.execute({ sql: "INSERT INTO tags (id, user_id, name, color, created_at) VALUES (?, ?, ?, ?, datetime('now'))", args: [id, session.user.id, name, color] })
  } else {
    throw createError({ statusCode: 400, message: 'Type d’organisation invalide.' })
  }
  return { id }
})
