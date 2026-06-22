/**
 * POST /api/vault
 * Crée un nouvel élément dans le coffre-fort (aucune limite)
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  enforceRateLimit(event, 'vault-create', 120, 60 * 1000, String(session.user.id))
  const db = useDB()
  const body = requireRecord(await readBody(event))
  const type = body.type
  const label = body.label === undefined ? '' : requireString(body.label, 'Label', { min: 0, max: 200 })
  const isEncrypted = body.is_encrypted === undefined ? true : body.is_encrypted

  if (typeof type !== 'string' || !['link', 'password', 'crypto', 'recovery'].includes(type)) {
    throw createError({ statusCode: 400, message: 'Type invalide. Doit être: link, password, crypto ou recovery.' })
  }

  if (typeof isEncrypted !== 'boolean') {
    throw createError({ statusCode: 400, message: 'is_encrypted must be a boolean.' })
  }

  const encryptionRequired = type !== 'link'

  if (encryptionRequired && !isEncrypted) {
    throw createError({ statusCode: 400, message: 'Les mots de passe, recovery codes et clés crypto doivent être chiffrés côté client.' })
  }

  const encrypted = isEncrypted ? assertEncryptedPayload(body.payload, body.iv) : null
  const payload = encrypted?.payload || requireString(body.payload, 'Payload', { min: 1, max: 100_000, trim: false })
  const iv = encrypted?.iv || null
  const url = optionalHttpUrl(body.url)

  if (type === 'link' && !isEncrypted) optionalHttpUrl(payload, 'Link')

  const id = crypto.randomUUID()

  try {
    await db.execute({
      sql: "INSERT INTO vault_items (id, user_id, type, label, is_encrypted, payload, iv, url, favorite, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))",
      args: [id, session.user.id, type, label, isEncrypted ? 1 : 0, payload, iv, url],
    })
  } catch (error: any) {
    const message = String(error?.message || error || '')

    if (message.includes('SQLITE_CONSTRAINT') || message.includes('CHECK constraint failed')) {
      throw createError({
        statusCode: 500,
        message: 'Vault schema migration is required before saving recovery codes. Please refresh and try again.',
      })
    }

    console.error('Failed to save vault item:', error)
    throw createError({ statusCode: 500, message: 'Failed to save vault item.' })
  }

  return { id, message: 'Élément ajouté avec succès.' }
})
