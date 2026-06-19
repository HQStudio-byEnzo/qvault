/**
 * POST /api/auth/login
 * Connexion par email/mot de passe
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email et mot de passe requis.' })
  }

  const db = useDB()

  // Trouver l'utilisateur
  const result = await db.execute({
    sql: 'SELECT id, name, email, password, created_at FROM users WHERE email = ?',
    args: [email.toLowerCase()],
  })

  if (result.rows.length === 0) {
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
      created_at: user.created_at,
    },
  })

  return {
    user: { id: user.id, name: user.name, email: user.email },
  }
})
