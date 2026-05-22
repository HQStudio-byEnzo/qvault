/**
 * POST /api/auth/resend-code
 * Renvoie un nouveau code de vérification
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Non connecté.' })
  }

  const db = useDB()

  const user = await db.execute({
    sql: 'SELECT id, name, email, email_verified FROM users WHERE id = ?',
    args: [session.user.id],
  })

  if (user.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Utilisateur non trouvé.' })
  }

  const row = user.rows[0] as any

  if (row.email_verified === 1) {
    return { message: 'Email déjà vérifié.' }
  }

  // Générer un nouveau code
  const code = generateVerificationCode()
  const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  await db.execute({
    sql: 'UPDATE users SET verification_code = ?, verification_expires = ? WHERE id = ?',
    args: [code, expires, session.user.id],
  })

  // Envoyer l'email
  await sendVerificationEmail(row.email, row.name, code)

  return { message: 'Nouveau code envoyé.' }
})
