/**
 * GET /api/vault/stats
 * Récupère les statistiques du coffre-fort de l'utilisateur
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()

  const [links, passwords, crypto, favorites] = await Promise.all([
    db.execute({ sql: 'SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?', args: [session.user.id, 'link'] }),
    db.execute({ sql: 'SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?', args: [session.user.id, 'password'] }),
    db.execute({ sql: 'SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?', args: [session.user.id, 'crypto'] }),
    db.execute({ sql: 'SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND favorite = 1', args: [session.user.id] }),
  ])

  return {
    counts: {
      links: Number(links.rows[0]?.count) || 0,
      passwords: Number(passwords.rows[0]?.count) || 0,
      crypto: Number(crypto.rows[0]?.count) || 0,
      favorites: Number(favorites.rows[0]?.count) || 0,
      total: (Number(links.rows[0]?.count) || 0) + (Number(passwords.rows[0]?.count) || 0) + (Number(crypto.rows[0]?.count) || 0),
    },
  }
})
