/**
 * POST /api/auth/delete-account
 * Supprime définitivement le compte et toutes les données
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const body = await readBody(event)
  const { password } = body

  if (!password) {
    throw createError({ statusCode: 400, message: 'Mot de passe requis pour confirmer la suppression.' })
  }

  const db = useDB()

  // Vérifier le mot de passe
  const result = await db.execute({
    sql: 'SELECT password FROM users WHERE id = ?',
    args: [session.user.id],
  })

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Utilisateur non trouvé.' })
  }

  const user = result.rows[0] as any
  const valid = await verifyPassword(password, user.password)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Mot de passe incorrect.' })
  }

  // Supprimer les vault items
  await db.execute({
    sql: 'DELETE FROM vault_items WHERE user_id = ?',
    args: [session.user.id],
  })

  // Supprimer l'utilisateur
  await db.execute({
    sql: 'DELETE FROM users WHERE id = ?',
    args: [session.user.id],
  })

  // Supprimer la session
  await clearUserSession(event)

  return { message: 'Compte supprimé définitivement.' }
})
