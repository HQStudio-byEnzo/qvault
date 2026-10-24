/**
 * POST /api/vault/:id/undelete
 * Restaure un élément de la corbeille.
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  await enforceRateLimit(event, 'vault-undelete', 120, 60 * 1000, String(session.user.id))
  const id = getRouterParam(event, 'id')
  if (!id || id.length > 128) {
    throw createError({ statusCode: 400, message: 'ID requis.' })
  }

  const result = await useDB().execute({
    sql: "UPDATE vault_items SET deleted_at = NULL, updated_at = datetime('now') WHERE id = ? AND user_id = ? AND deleted_at IS NOT NULL",
    args: [id, session.user.id],
  })

  if (result.rowsAffected !== 1) {
    throw createError({ statusCode: 404, message: 'Élément introuvable dans la corbeille.' })
  }
  return { message: 'Élément restauré.' }
})
