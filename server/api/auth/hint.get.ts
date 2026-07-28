export default defineEventHandler(async (event) => {
  const identifier = normalizeLoginIdentifier(getQuery(event).username)
  enforceRateLimit(event, 'auth-password-hint-ip', 20, 15 * 60 * 1000)
  enforceRateLimit(event, 'auth-password-hint-account', 3, 15 * 60 * 1000, identifier)
  const session = await getUserSession(event)
  const challenge = session?.hintChallenge
  if (
    !challenge ||
    challenge.identifier !== identifier ||
    !Number.isFinite(challenge.expiresAt) ||
    challenge.expiresAt < Date.now()
  ) {
    throw createError({
      statusCode: 403,
      message: 'Effectuez d’abord une tentative de connexion pour afficher cet indice.',
    })
  }

  const db = useDB()
  const result = await db.execute({
    sql: 'SELECT password_hint FROM users WHERE username = ? OR lower(email) = ?',
    args: [identifier, identifier],
  })
  setHeader(event, 'Cache-Control', 'no-store')
  await setUserSession(event, {})
  return { hint: result.rows[0]?.password_hint || null }
})
