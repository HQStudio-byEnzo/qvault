/**
 * DELETE /api/vault/:id
 * Supprime un élément du coffre-fort
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID requis.' })
  }

  // Vérifier que l'item appartient à l'utilisateur
  const existing = await db
    .prepare('SELECT id FROM vault_items WHERE id = ? AND user_id = ?')
    .bind(id, session.user.id)
    .first()

  if (!existing) {
    throw createError({ statusCode: 404, message: 'Élément non trouvé.' })
  }

  await db
    .prepare('DELETE FROM vault_items WHERE id = ? AND user_id = ?')
    .bind(id, session.user.id)
    .run()

  return { message: 'Élément supprimé.' }
})
