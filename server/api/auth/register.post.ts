/**
 * POST /api/auth/register
 * Inscription par email/mot de passe
 * Envoie un code de vérification par email
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

  // Créer l'utilisateur (non vérifié)
  const id = crypto.randomUUID()
  const hashedPassword = await hashPassword(password)
  const code = generateVerificationCode()
  const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min

  await db.execute({
    sql: "INSERT INTO users (id, name, email, password, email_verified, verification_code, verification_expires, created_at) VALUES (?, ?, ?, ?, 0, ?, ?, datetime('now'))",
    args: [id, name, email.toLowerCase(), hashedPassword, code, expires],
  })

  // Envoyer l'email de vérification
  try {
    const config = useRuntimeConfig()
    if (!config.resendApiKey) {
      console.error('RESEND_API_KEY non configurée !')
    } else {
      await sendVerificationEmail(email.toLowerCase(), name, code)
      console.log('Email envoyé à', email.toLowerCase())
    }
  } catch (err: any) {
    console.error('Erreur envoi email:', err?.message || err)
  }

  // Créer la session (mais marquer comme non vérifié)
  await setUserSession(event, {
    user: { id, name, email: email.toLowerCase(), emailVerified: false },
  })

  return { user: { id, name, email: email.toLowerCase() }, needsVerification: true }
})
