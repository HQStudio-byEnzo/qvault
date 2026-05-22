/**
 * GET /api/payment/status
 * Vérifie le statut premium de l'utilisateur
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()

  const user = await db.execute({
    sql: 'SELECT premium_until FROM users WHERE id = ?',
    args: [session.user.id],
  })

  if (user.rows.length === 0) {
    return { isPremium: false, premiumUntil: null }
  }

  const premiumUntil = (user.rows[0] as any).premium_until
  const isPremium = premiumUntil && new Date(premiumUntil) > new Date()

  return {
    isPremium: !!isPremium,
    premiumUntil: premiumUntil || null,
  }
})
