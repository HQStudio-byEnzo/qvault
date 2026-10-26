/**
 * DELETE /api/vault/:id
 *
 * Sans paramètre : déplace l'élément dans la corbeille (30 jours, restaurable).
 * Avec `?permanent=1` : supprime définitivement un élément déjà dans la
 * corbeille, avec ses tags et son historique.
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  await enforceRateLimit(event, 'vault-delete', 120, 60 * 1000, String(session.user.id))
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const permanent = ['1', 'true'].includes(String(getQuery(event).permanent || ''))

  if (!id || id.length > 128) {
    throw createError({ statusCode: 400, message: 'ID requis.' })
  }

  const existing = await db.execute({
    sql: 'SELECT id, deleted_at FROM vault_items WHERE id = ? AND user_id = ?',
    args: [id, session.user.id],
  })
  if (existing.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Élément non trouvé.' })
  }
  const deletedAt = (existing.rows[0] as any).deleted_at

  if (permanent) {
    if (!deletedAt) {
      throw createError({ statusCode: 400, message: 'Mettez d’abord l’élément dans la corbeille.' })
    }
    await db.batch([
      { sql: 'DELETE FROM vault_item_tags WHERE item_id = ?', args: [id] },
      { sql: 'DELETE FROM vault_item_history WHERE item_id = ? AND user_id = ?', args: [id, session.user.id] },
      { sql: 'DELETE FROM vault_items WHERE id = ? AND user_id = ?', args: [id, session.user.id] },
    ], 'write')
    return { message: 'Élément supprimé définitivement.' }
  }

  if (deletedAt) {
    return { message: 'Élément déjà dans la corbeille.', deleted_at: deletedAt }
  }

  await db.execute({
    sql: "UPDATE vault_items SET deleted_at = datetime('now'), updated_at = datetime('now') WHERE id = ? AND user_id = ?",
    args: [id, session.user.id],
  })
  return { message: 'Élément déplacé dans la corbeille.' }
})
