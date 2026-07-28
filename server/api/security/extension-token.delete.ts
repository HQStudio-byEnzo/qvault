export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()
  await db.execute({
    sql: 'DELETE FROM extension_tokens WHERE user_id = ?',
    args: [session.user.id],
  })
  return { ok: true }
})
