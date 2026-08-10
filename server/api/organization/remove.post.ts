export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  await enforceRateLimit(event, 'organization-remove', 60, 60 * 1000, String(session.user.id))
  const db = useDB()
  const body = requireRecord(await readBody(event))
  const kind = body.kind
  const id = requireString(body.id, 'ID', { min: 1, max: 128 })
  if (kind === 'tag') {
    await db.batch([
      { sql: 'DELETE FROM vault_item_tags WHERE tag_id IN (SELECT id FROM tags WHERE id = ? AND user_id = ?)', args: [id, session.user.id] },
      { sql: 'DELETE FROM tags WHERE id = ? AND user_id = ?', args: [id, session.user.id] },
    ], 'write')
  } else if (kind === 'folder') {
    await db.batch([
      { sql: 'UPDATE vault_items SET folder_id = NULL WHERE folder_id = ? AND user_id = ?', args: [id, session.user.id] },
      { sql: 'UPDATE folders SET parent_id = NULL WHERE parent_id = ? AND user_id = ?', args: [id, session.user.id] },
      { sql: 'DELETE FROM folders WHERE id = ? AND user_id = ?', args: [id, session.user.id] },
    ], 'write')
  } else if (kind === 'vault') {
    const vault = await db.execute({ sql: 'SELECT is_default FROM vaults WHERE id = ? AND user_id = ?', args: [id, session.user.id] })
    if (!vault.rows.length) throw createError({ statusCode: 404, message: 'Coffre introuvable.' })
    if (Number((vault.rows[0] as any).is_default) === 1) throw createError({ statusCode: 400, message: 'Le coffre principal ne peut pas être supprimé.' })
    const count = await db.execute({ sql: 'SELECT COUNT(*) AS count FROM vault_items WHERE vault_id = ? AND user_id = ?', args: [id, session.user.id] })
    if (Number(count.rows[0]?.count) > 0) throw createError({ statusCode: 409, message: 'Déplacez les éléments avant de supprimer ce coffre.' })
    await db.batch([
      { sql: 'DELETE FROM folders WHERE vault_id = ? AND user_id = ?', args: [id, session.user.id] },
      { sql: 'DELETE FROM vaults WHERE id = ? AND user_id = ?', args: [id, session.user.id] },
    ], 'write')
  } else throw createError({ statusCode: 400, message: 'Type invalide.' })
  return { ok: true }
})
