/**
 * GET /api/vault/trash
 *
 * Liste les éléments en corbeille et purge au passage ceux dont les 30 jours
 * sont écoulés. Pas de tâche planifiée : la purge suit l'usage, donc elle ne
 * peut pas être oubliée.
 */
import { TRASH_RETENTION_DAYS } from '~/utils/trash'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()
  const userId = String(session.user.id)
  const expired = `deleted_at IS NOT NULL AND deleted_at <= datetime('now', '-${TRASH_RETENTION_DAYS} days')`

  await db.batch([
    { sql: `DELETE FROM vault_item_tags WHERE item_id IN (SELECT id FROM vault_items WHERE user_id = ? AND ${expired})`, args: [userId] },
    { sql: `DELETE FROM vault_item_history WHERE item_id IN (SELECT id FROM vault_items WHERE user_id = ? AND ${expired})`, args: [userId] },
    { sql: `DELETE FROM vault_items WHERE user_id = ? AND ${expired}`, args: [userId] },
  ], 'write')

  const result = await db.execute({
    sql: `SELECT id, type, label, url, favorite, created_at, updated_at, deleted_at
          FROM vault_items
          WHERE user_id = ? AND deleted_at IS NOT NULL
          ORDER BY deleted_at DESC
          LIMIT 500`,
    args: [userId],
  })

  return { items: result.rows, retentionDays: TRASH_RETENTION_DAYS }
})
