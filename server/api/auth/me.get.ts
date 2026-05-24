/**
 * GET /api/auth/me
 * Returns current user info from database
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()

  const result = await db.execute({
    sql: 'SELECT id, name, email, created_at FROM users WHERE id = ?',
    args: [session.user.id],
  })

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  return result.rows[0]
})
