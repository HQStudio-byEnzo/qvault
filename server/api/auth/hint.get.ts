export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const email = query.email as string

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email required.' })
  }

  const db = useDB()
  const result = await db.execute({
    sql: 'SELECT password_hint FROM users WHERE email = ?',
    args: [email.toLowerCase()],
  })

  if (result.rows.length === 0 || !result.rows[0].password_hint) {
    return { hint: null, message: 'No hint available for this account.' }
  }

  return { hint: result.rows[0].password_hint }
})
