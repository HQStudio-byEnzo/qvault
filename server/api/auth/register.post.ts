/**
 * POST /api/auth/register
 * Inscription par email/mot de passe
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password } = body

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, message: 'Nom, email et mot de passe requis.' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  }

  const db = useDB()

  // Vérifier si l'email existe déjà
  const existing = await db.execute({
    sql: 'SELECT id FROM users WHERE email = ?',
    args: [email.toLowerCase()],
  })

  if (existing.rows.length > 0) {
    throw createError({ statusCode: 409, message: 'Un compte existe déjà avec cet email.' })
  }

  // Créer l'utilisateur
  const id = crypto.randomUUID()
  const hashedPassword = await hashPassword(password)

  await db.execute({
    sql: "INSERT INTO users (id, name, email, password, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
    args: [id, name, email.toLowerCase(), hashedPassword],
  })

  // Créer la session
  await setUserSession(event, {
    user: { id, name, email: email.toLowerCase() },
  })

  return { user: { id, name, email: email.toLowerCase() } }
})
