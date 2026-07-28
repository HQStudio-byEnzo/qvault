export default defineEventHandler(async (event) => {
  const { db, userId } = await requireExtensionAuth(event, 'passwords-read')
  const items = await db.execute({
    sql: "SELECT id, label, payload, iv, url, is_encrypted, favorite, updated_at FROM vault_items WHERE user_id = ? AND type = 'password' AND is_encrypted = 1 ORDER BY favorite DESC, updated_at DESC",
    args: [userId],
  })
  setHeader(event, 'Cache-Control', 'no-store')
  return { items: items.rows }
})
