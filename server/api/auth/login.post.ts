/**
 * POST /api/auth/login
 * Connexion par email/mot de passe
 */
const DUMMY_PASSWORD_HASH = '$2b$12$TXHbIGwXmsfL8xqmIB/fweBVpky..BJ9b0apckX56X0c5vhpGtjfq'

export default defineEventHandler(async (event) => {
  const body = requireRecord(await readBody(event))
  const email = normalizeEmail(body.email)
  const password = requireString(body.password, 'Password', { min: 1, max: 128, trim: false })
  enforceRateLimit(event, 'auth-login-ip', 50, 15 * 60 * 1000)
  enforceRateLimit(event, 'auth-login-account', 10, 15 * 60 * 1000, email)

  const db = useDB()

  // Trouver l'utilisateur
  const result = await db.execute({
    sql: 'SELECT id, name, email, password, session_version, created_at FROM users WHERE email = ?',
    args: [email],
  })

  if (result.rows.length === 0) {
    await verifyUserPassword(password, DUMMY_PASSWORD_HASH)
    throw createError({ statusCode: 401, message: 'Email ou mot de passe incorrect.' })
  }

  const user = result.rows[0] as any

  // Vérifier le mot de passe
  const valid = await verifyUserPassword(password, user.password)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Email ou mot de passe incorrect.' })
  }

  // Créer la session
  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      sessionVersion: Number(user.session_version) || 0,
      created_at: user.created_at,
    },
  })

  return {
    user: { id: user.id, name: user.name, email: user.email },
  }
})
