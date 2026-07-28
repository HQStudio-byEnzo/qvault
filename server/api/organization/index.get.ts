export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()
  const [vaults, folders, tags] = await Promise.all([
    db.execute({ sql: 'SELECT * FROM vaults WHERE user_id = ? ORDER BY is_default DESC, created_at ASC', args: [session.user.id] }),
    db.execute({ sql: 'SELECT * FROM folders WHERE user_id = ? ORDER BY name COLLATE NOCASE', args: [session.user.id] }),
    db.execute({ sql: 'SELECT * FROM tags WHERE user_id = ? ORDER BY name COLLATE NOCASE', args: [session.user.id] }),
  ])
  return {
    vaults: vaults.rows.map(row => ({ ...row, is_default: Boolean(row.is_default) })),
    folders: folders.rows,
    tags: tags.rows,
  }
})
