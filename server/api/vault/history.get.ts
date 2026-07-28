export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()
  const history = await db.execute({
    sql: 'SELECT id, item_id, payload, iv, is_encrypted FROM vault_item_history WHERE user_id = ? ORDER BY item_id, version DESC LIMIT 50000',
    args: [session.user.id],
  })
  return { history: history.rows }
})
