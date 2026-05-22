/**
 * POST /api/auth/verify
 * Vérifie le code envoyé par email
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Non connecté.' })
  }

  const body = await readBody(event)
  const { code } = body

  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, message: 'Code à 6 chiffres requis.' })
  }

  const db = useDB()

  // Vérifier le code
  const user = await db.execute({
    sql: 'SELECT id, name, email, verification_code, verification_expires FROM users WHERE id = ?',
    args: [session.user.id],
  })

  if (user.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Utilisateur non trouvé.' })
  }

  const row = user.rows[0] as any

  // Vérifier l'expiration
  if (new Date(row.verification_expires) < new Date()) {
    throw createError({ statusCode: 410, message: 'Code expiré. Demandez un nouveau code.' })
  }

  // Vérifier le code
  if (row.verification_code !== code) {
    throw createError({ statusCode: 400, message: 'Code incorrect.' })
  }

  // Marquer comme vérifié
  await db.execute({
    sql: 'UPDATE users SET email_verified = 1, verification_code = NULL, verification_expires = NULL WHERE id = ?',
    args: [session.user.id],
  })

  // Mettre à jour la session
  await setUserSession(event, {
    user: { id: row.id, name: row.name, email: row.email, emailVerified: true },
  })

  return { message: 'Email vérifié avec succès !' }
})
