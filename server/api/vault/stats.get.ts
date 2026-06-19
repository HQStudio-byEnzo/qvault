/**
 * GET /api/vault/stats
 * Récupère les statistiques du coffre-fort
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const userId = session.user.id
  const db = useDB()

  const [links, passwords, crypto, recovery, favorites] = await Promise.all([
    db.execute({ sql: 'SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?', args: [userId, 'link'] }),
    db.execute({ sql: 'SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?', args: [userId, 'password'] }),
    db.execute({ sql: 'SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?', args: [userId, 'crypto'] }),
    db.execute({ sql: 'SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?', args: [userId, 'recovery'] }),
    db.execute({ sql: 'SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND favorite = 1', args: [userId] }),
  ])

  return {
    counts: {
      links: Number(links.rows[0]?.count) || 0,
      passwords: Number(passwords.rows[0]?.count) || 0,
      crypto: Number(crypto.rows[0]?.count) || 0,
      recovery: Number(recovery.rows[0]?.count) || 0,
      favorites: Number(favorites.rows[0]?.count) || 0,
      total: (Number(links.rows[0]?.count) || 0) + (Number(passwords.rows[0]?.count) || 0) + (Number(crypto.rows[0]?.count) || 0) + (Number(recovery.rows[0]?.count) || 0),
    },
  }
})
