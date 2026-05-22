/**
 * PUT /api/vault/:id
 * Met à jour un élément du coffre-fort
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
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

  const updates: string[] = []
  const params: any[] = []

  if (body.label !== undefined) {
    updates.push('label = ?')
    params.push(body.label)
  }
  if (body.payload !== undefined) {
    updates.push('payload = ?')
    params.push(body.payload)
  }
  if (body.iv !== undefined) {
    updates.push('iv = ?')
    params.push(body.iv)
  }
  if (body.is_encrypted !== undefined) {
    updates.push('is_encrypted = ?')
    params.push(body.is_encrypted ? 1 : 0)
  }
  if (body.favorite !== undefined) {
    updates.push('favorite = ?')
    params.push(body.favorite ? 1 : 0)
  }

  if (updates.length === 0) {
    throw createError({ statusCode: 400, message: 'Aucune modification fournie.' })
  }

  updates.push("updated_at = datetime('now')")
  params.push(id, session.user.id)

  await db.execute({
    sql: `UPDATE vault_items SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
    args: params,
  })

  return { message: 'Élément mis à jour.' }
})
