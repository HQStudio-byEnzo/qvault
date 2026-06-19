/**
 * POST /api/auth/change-password
 * Change le mot de passe de l'utilisateur connecté
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const body = await readBody(event)
  const { currentPassword, newPassword } = body

  if (!currentPassword || !newPassword) {
    throw createError({ statusCode: 400, message: 'Mot de passe actuel et nouveau mot de passe requis.' })
  }

  if (newPassword.length < 8) {
    throw createError({ statusCode: 400, message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' })
  }

  const db = useDB()

  // Récupérer le hash actuel
  const result = await db.execute({
    sql: 'SELECT password FROM users WHERE id = ?',
    args: [session.user.id],
  })

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Utilisateur non trouvé.' })
  }

  const user = result.rows[0] as any

  // Vérifier le mot de passe actuel
  const valid = await verifyUserPassword(currentPassword, user.password)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Mot de passe actuel incorrect.' })
  }

  // Mettre à jour
  const hashedNew = await hashUserPassword(newPassword)
  await db.execute({
    sql: 'UPDATE users SET password = ? WHERE id = ?',
    args: [hashedNew, session.user.id],
  })

  return { message: 'Mot de passe modifié avec succès.' }
})
