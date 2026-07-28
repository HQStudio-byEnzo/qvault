export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()
  const itemId = getRouterParam(event, 'id')
  if (!itemId || itemId.length > 128) throw createError({ statusCode: 400, message: 'ID requis.' })
  const all = getQuery(event).all === 'true'
  const item = await db.execute({ sql: 'SELECT id FROM vault_items WHERE id = ? AND user_id = ?', args: [itemId, session.user.id] })
  if (!item.rows.length) throw createError({ statusCode: 404, message: 'Élément introuvable.' })
  const history = await db.execute({
    sql: `SELECT * FROM vault_item_history WHERE item_id = ? AND user_id = ? ORDER BY version DESC LIMIT ${all ? 10_000 : 50}`,
    args: [itemId, session.user.id],
  })
  return { history: history.rows }
})
