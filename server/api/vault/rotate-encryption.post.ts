/**
 * POST /api/vault/rotate-encryption
 * Replaces every encrypted payload in one database transaction.
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  enforceRateLimit(event, 'vault-rotate', 5, 60 * 60 * 1000, String(session.user.id))
  const body = requireRecord(await readBody(event))
  const items = body?.items

  if (!Array.isArray(items) || items.length > 10_000) {
    throw createError({ statusCode: 400, message: 'La liste des éléments chiffrés est requise.' })
  }

  const ids = new Set<string>()
  for (const item of items) {
    if (
      !item ||
      typeof item.id !== 'string' ||
      item.id.length > 128 ||
      ids.has(item.id)
    ) {
      throw createError({ statusCode: 400, message: 'Données de rotation invalides.' })
    }
    assertEncryptedPayload(item.payload, item.iv)
    ids.add(item.id)
  }

  const db = useDB()
  const transaction = await db.transaction('write')
  let committed = false

  try {
    const existing = await transaction.execute({
      sql: 'SELECT id FROM vault_items WHERE user_id = ? AND is_encrypted = 1',
      args: [session.user.id],
    })
    const existingIds = new Set(existing.rows.map(row => String(row.id)))

    if (existingIds.size !== ids.size || [...existingIds].some(id => !ids.has(id))) {
      throw createError({
        statusCode: 409,
        message: 'Le coffre a changé. Rechargez la page avant de réessayer.',
      })
    }

    const results = items.length > 0
      ? await transaction.batch(items.map(item => ({
          sql: "UPDATE vault_items SET payload = ?, iv = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ? AND is_encrypted = 1",
          args: [item.payload, item.iv, item.id, session.user.id],
        })))
      : []

    if (results.some(result => result.rowsAffected !== 1)) {
      throw createError({ statusCode: 409, message: 'Le coffre a changé pendant la rotation.' })
    }

    await transaction.commit()
    committed = true
  } finally {
    if (!committed) {
      await transaction.rollback().catch(() => {})
    }
    transaction.close()
  }

  return { message: 'Chiffrement du coffre mis à jour.' }
})
