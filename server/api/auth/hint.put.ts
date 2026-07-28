export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  enforceRateLimit(event, 'auth-password-hint-update', 10, 60 * 60 * 1000, String(session.user.id))
  const body = requireRecord(await readBody(event))
  const password = requireString(body.password, 'Password', { min: 1, max: 128, trim: false })
  const hint = requireString(body.hint ?? '', 'Password hint', { min: 0, max: 200 }) || null
  const db = useDB()
  const result = await db.execute({
    sql: 'SELECT password FROM users WHERE id = ?',
    args: [session.user.id],
  })
  if (!result.rows.length || !await verifyUserPassword(password, String(result.rows[0]?.password))) {
    throw createError({ statusCode: 401, message: 'Mot de passe incorrect.' })
  }
  await db.execute({
    sql: 'UPDATE users SET password_hint = ? WHERE id = ?',
    args: [hint, session.user.id],
  })
  return { hint }
})
