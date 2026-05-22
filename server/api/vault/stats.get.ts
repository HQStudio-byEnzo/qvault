/**
 * GET /api/vault/stats
 * Récupère les statistiques du coffre-fort + info premium
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const userId = session.user.id
  const db = useDB()
  const config = useRuntimeConfig()

  const [links, passwords, crypto, favorites, user] = await Promise.all([
    db.execute({ sql: 'SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?', args: [userId, 'link'] }),
    db.execute({ sql: 'SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?', args: [userId, 'password'] }),
    db.execute({ sql: 'SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?', args: [userId, 'crypto'] }),
    db.execute({ sql: 'SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND favorite = 1', args: [userId] }),
    db.execute({ sql: 'SELECT premium_until FROM users WHERE id = ?', args: [userId] }),
  ])

  const premiumUntil = (user.rows[0] as any)?.premium_until
  const isPremium = premiumUntil && new Date(premiumUntil) > new Date()

  return {
    counts: {
      links: Number(links.rows[0]?.count) || 0,
      passwords: Number(passwords.rows[0]?.count) || 0,
      crypto: Number(crypto.rows[0]?.count) || 0,
      favorites: Number(favorites.rows[0]?.count) || 0,
      total: (Number(links.rows[0]?.count) || 0) + (Number(passwords.rows[0]?.count) || 0) + (Number(crypto.rows[0]?.count) || 0),
    },
    isPremium: !!isPremium,
    premiumUntil: premiumUntil || null,
    limits: isPremium ? null : {
      passwords: config.public.freeLimits.passwords,
      crypto: config.public.freeLimits.crypto,
    },
  }
})
