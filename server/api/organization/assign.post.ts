export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  enforceRateLimit(event, 'organization-assign', 120, 60 * 1000, String(session.user.id))
  const db = useDB()
  const body = requireRecord(await readBody(event))
  const itemId = requireString(body.item_id, 'Item', { min: 1, max: 128 })
  const item = await db.execute({ sql: 'SELECT id, vault_id FROM vault_items WHERE id = ? AND user_id = ?', args: [itemId, session.user.id] })
  if (!item.rows.length) throw createError({ statusCode: 404, message: 'Élément introuvable.' })
  const vaultId = typeof body.vault_id === 'string' ? body.vault_id.slice(0, 128) : String((item.rows[0] as any).vault_id)
  const folderId = typeof body.folder_id === 'string' ? body.folder_id.slice(0, 128) : null
  const tagIds = Array.isArray(body.tag_ids) ? [...new Set(body.tag_ids.filter((id): id is string => typeof id === 'string'))].slice(0, 20) : []

  const vault = await db.execute({ sql: 'SELECT id FROM vaults WHERE id = ? AND user_id = ?', args: [vaultId, session.user.id] })
  if (!vault.rows.length) throw createError({ statusCode: 400, message: 'Coffre introuvable.' })
  if (folderId) {
    const folder = await db.execute({ sql: 'SELECT id FROM folders WHERE id = ? AND vault_id = ? AND user_id = ?', args: [folderId, vaultId, session.user.id] })
    if (!folder.rows.length) throw createError({ statusCode: 400, message: 'Dossier introuvable.' })
  }

  const statements: any[] = [
    { sql: "UPDATE vault_items SET vault_id = ?, folder_id = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?", args: [vaultId, folderId, itemId, session.user.id] },
    { sql: 'DELETE FROM vault_item_tags WHERE item_id = ?', args: [itemId] },
  ]
  for (const tagId of tagIds) statements.push({ sql: 'INSERT OR IGNORE INTO vault_item_tags (item_id, tag_id) SELECT ?, id FROM tags WHERE id = ? AND user_id = ?', args: [itemId, tagId, session.user.id] })
  await db.batch(statements, 'write')
  return { ok: true }
})
