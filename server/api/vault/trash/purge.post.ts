/**
 * POST /api/vault/trash/purge
 * Vide la corbeille : supprime définitivement tous les éléments en corbeille,
 * avec leurs tags et leur historique.
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  await enforceRateLimit(event, 'vault-trash-purge', 12, 60 * 60 * 1000, String(session.user.id))
  const db = useDB()
  const userId = String(session.user.id)

  const count = await db.execute({
    sql: 'SELECT COUNT(*) AS count FROM vault_items WHERE user_id = ? AND deleted_at IS NOT NULL',
    args: [userId],
  })
  const purged = Number((count.rows[0] as any)?.count) || 0
  if (purged === 0) return { purged: 0 }

  await db.batch([
    { sql: 'DELETE FROM vault_item_tags WHERE item_id IN (SELECT id FROM vault_items WHERE user_id = ? AND deleted_at IS NOT NULL)', args: [userId] },
    { sql: 'DELETE FROM vault_item_history WHERE item_id IN (SELECT id FROM vault_items WHERE user_id = ? AND deleted_at IS NOT NULL)', args: [userId] },
    { sql: 'DELETE FROM vault_items WHERE user_id = ? AND deleted_at IS NOT NULL', args: [userId] },
  ], 'write')

  return { purged }
})
