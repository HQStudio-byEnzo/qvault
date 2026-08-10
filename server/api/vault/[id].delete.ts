/**
 * DELETE /api/vault/:id
 * Supprime un élément du coffre-fort
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  await enforceRateLimit(event, 'vault-delete', 120, 60 * 1000, String(session.user.id))
  const db = useDB()
  const id = getRouterParam(event, 'id')

  if (!id || id.length > 128) {
    throw createError({ statusCode: 400, message: 'ID requis.' })
  }

  // Vérifier que l'item appartient à l'utilisateur
  const existing = await db.execute({
    sql: 'SELECT id FROM vault_items WHERE id = ? AND user_id = ?',
    args: [id, session.user.id],
  })

  if (existing.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Élément non trouvé.' })
  }

  await db.batch([
    {
      sql: 'DELETE FROM vault_item_tags WHERE item_id = ?',
      args: [id],
    },
    {
      sql: 'DELETE FROM vault_item_history WHERE item_id = ? AND user_id = ?',
      args: [id, session.user.id],
    },
    {
      sql: 'DELETE FROM vault_items WHERE id = ? AND user_id = ?',
      args: [id, session.user.id],
    },
  ], 'write')

  return { message: 'Élément supprimé.' }
})
