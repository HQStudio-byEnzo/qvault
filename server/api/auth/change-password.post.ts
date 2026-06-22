/**
 * POST /api/auth/change-password
 * Change le mot de passe de l'utilisateur connecté
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  enforceRateLimit(event, 'auth-change-password', 5, 60 * 60 * 1000, String(session.user.id))
  const body = requireRecord(await readBody(event))
  const currentPassword = requireString(body.currentPassword, 'Current password', { min: 1, max: 128, trim: false })
  const newPassword = requireString(body.newPassword, 'New password', { min: 8, max: 128, trim: false })

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
    sql: 'UPDATE users SET password = ?, session_version = session_version + 1 WHERE id = ?',
    args: [hashedNew, session.user.id],
  })

  const versionResult = await db.execute({
    sql: 'SELECT session_version FROM users WHERE id = ?',
    args: [session.user.id],
  })
  await setUserSession(event, {
    user: {
      ...session.user,
      sessionVersion: Number(versionResult.rows[0]?.session_version) || 0,
    },
  })

  return { message: 'Mot de passe modifié avec succès.' }
})
