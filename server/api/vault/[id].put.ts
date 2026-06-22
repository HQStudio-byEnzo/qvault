/**
 * PUT /api/vault/:id
 * Met à jour un élément du coffre-fort
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  enforceRateLimit(event, 'vault-update', 240, 60 * 1000, String(session.user.id))
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const body = requireRecord(await readBody(event))

  if (!id || id.length > 128) {
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
  if (body.is_encrypted !== undefined && typeof body.is_encrypted !== 'boolean') {
    throw createError({ statusCode: 400, message: 'is_encrypted must be a boolean.' })
  }
  if (body.favorite !== undefined && typeof body.favorite !== 'boolean') {
    throw createError({ statusCode: 400, message: 'favorite must be a boolean.' })
  }

  const nextIsEncrypted = body.is_encrypted !== undefined ? body.is_encrypted : current.is_encrypted === 1
  const nextPayload = body.payload !== undefined ? body.payload : current.payload
  const nextIv = body.iv !== undefined ? body.iv : current.iv
  const encryptionRequired = current.type !== 'link'

  if (encryptionRequired && !nextIsEncrypted) {
    throw createError({ statusCode: 400, message: 'Les mots de passe, recovery codes et clés crypto doivent rester chiffrés.' })
  }

  if (nextIsEncrypted) {
    assertEncryptedPayload(nextPayload, nextIv)
  } else {
    requireString(nextPayload, 'Payload', { min: 1, max: 100_000, trim: false })
    if (current.type === 'link') optionalHttpUrl(nextPayload, 'Link')
  }

  const updates: string[] = []
  const params: any[] = []

  if (body.label !== undefined) {
    updates.push('label = ?')
    params.push(requireString(body.label, 'Label', { min: 0, max: 200 }))
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
    params.push(optionalHttpUrl(body.url))
  }

  if (updates.length === 0) {
    throw createError({ statusCode: 400, message: 'Aucune modification fournie.' })
  }

  updates.push("updated_at = datetime('now')")
  params.push(id, session.user.id)

  try {
    await db.execute({
      sql: `UPDATE vault_items SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      args: params,
    })
  } catch (error: any) {
    const message = String(error?.message || error || '')

    if (message.includes('SQLITE_CONSTRAINT') || message.includes('CHECK constraint failed')) {
      throw createError({
        statusCode: 500,
        message: 'Vault schema migration is required before updating recovery codes. Please refresh and try again.',
      })
    }

    console.error('Failed to update vault item:', error)
    throw createError({ statusCode: 500, message: 'Failed to update vault item.' })
  }

  return { message: 'Élément mis à jour.' }
})
