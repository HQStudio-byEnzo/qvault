/**
 * GET /api/vault/stats
 * Récupère les statistiques du coffre-fort de l'utilisateur
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB(event)

  const [links, passwords, crypto, favorites] = await Promise.all([
    db.prepare('SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?')
      .bind(session.user.id, 'link').first<{ count: number }>(),
    db.prepare('SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?')
      .bind(session.user.id, 'password').first<{ count: number }>(),
    db.prepare('SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?')
      .bind(session.user.id, 'crypto').first<{ count: number }>(),
    db.prepare('SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND favorite = 1')
      .bind(session.user.id).first<{ count: number }>(),
  ])

  return {
    counts: {
      links: links?.count || 0,
      passwords: passwords?.count || 0,
      crypto: crypto?.count || 0,
      favorites: favorites?.count || 0,
      total: (links?.count || 0) + (passwords?.count || 0) + (crypto?.count || 0),
    },
  }
})
