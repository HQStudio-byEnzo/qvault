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
    sql: 'SELECT id, type, payload, iv, is_encrypted FROM vault_items WHERE id = ? AND user_id = ?',
    args: [id, session.user.id],
  })

  if (existing.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Élément non trouvé.' })
  }

  const current = existing.rows[0] as any
  const nextIsEncrypted = body.is_encrypted !== undefined ? !!body.is_encrypted : current.is_encrypted === 1
  const nextPayload = body.payload !== undefined ? body.payload : current.payload
  const nextIv = body.iv !== undefined ? body.iv : current.iv
  const encryptionRequired = current.type !== 'link'

  if (encryptionRequired && !nextIsEncrypted) {
    throw createError({ statusCode: 400, message: 'Les mots de passe, recovery codes et clés crypto doivent rester chiffrés.' })
  }

  if (nextIsEncrypted) {
    if (!nextIv || typeof nextIv !== 'string') {
      throw createError({ statusCode: 400, message: "Le vecteur d'initialisation (iv) est requis." })
    }

    if (typeof nextPayload !== 'string' || nextPayload.split(':').length !== 2) {
      throw createError({ statusCode: 400, message: 'Format de payload chiffré invalide.' })
    }
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
  if (body.url !== undefined) {
    updates.push('url = ?')
    params.push(body.url || null)
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
