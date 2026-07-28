export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()
  const itemId = getRouterParam(event, 'id')
  if (!itemId || itemId.length > 128) throw createError({ statusCode: 400, message: 'ID requis.' })
  const body = requireRecord(await readBody(event))
  const historyId = requireString(body.history_id, 'History', { min: 1, max: 128 })
  const [itemResult, historyResult] = await Promise.all([
    db.execute({ sql: 'SELECT * FROM vault_items WHERE id = ? AND user_id = ?', args: [itemId, session.user.id] }),
    db.execute({ sql: 'SELECT * FROM vault_item_history WHERE id = ? AND item_id = ? AND user_id = ?', args: [historyId, itemId, session.user.id] }),
  ])
  if (!itemResult.rows.length || !historyResult.rows.length) throw createError({ statusCode: 404, message: 'Version introuvable.' })
  const current = itemResult.rows[0] as any
  const snapshot = historyResult.rows[0] as any
  const versionResult = await db.execute({ sql: 'SELECT COALESCE(MAX(version), 0) + 1 AS version FROM vault_item_history WHERE item_id = ? AND user_id = ?', args: [itemId, session.user.id] })
  const version = Number(versionResult.rows[0]?.version) || 1
  await db.batch([
    { sql: "INSERT INTO vault_item_history (id, item_id, user_id, version, label, payload, iv, url, is_encrypted, favorite, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))", args: [crypto.randomUUID(), itemId, session.user.id, version, current.label, current.payload, current.iv, current.url, current.is_encrypted, current.favorite] },
    { sql: "UPDATE vault_items SET label = ?, payload = ?, iv = ?, url = ?, is_encrypted = ?, favorite = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?", args: [snapshot.label, snapshot.payload, snapshot.iv, snapshot.url, snapshot.is_encrypted, snapshot.favorite, itemId, session.user.id] },
  ], 'write')
  return { ok: true }
})
