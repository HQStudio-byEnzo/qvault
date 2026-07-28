/**
 * POST /api/vault/rotate-encryption
 * Replaces every encrypted current payload and history snapshot atomically.
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  enforceRateLimit(event, 'vault-rotate', 5, 60 * 60 * 1000, String(session.user.id))
  const body = requireRecord(await readBody(event))
  const items = body.items
  const history = body.history
  const verifierBody = requireRecord(body.verifier)
  const verifier = assertEncryptedPayload(verifierBody.payload, verifierBody.iv)

  if (!Array.isArray(items) || items.length > 10_000 || !Array.isArray(history) || history.length > 50_000) {
    throw createError({ statusCode: 400, message: 'Les listes chiffrées sont requises.' })
  }

  const ids = new Set<string>()
  for (const item of items) {
    if (!item || typeof item.id !== 'string' || item.id.length > 128 || ids.has(item.id)) {
      throw createError({ statusCode: 400, message: 'Données de rotation invalides.' })
    }
    assertEncryptedPayload(item.payload, item.iv)
    assertEncryptedPayload(item.previousPayload, item.previousIv)
    ids.add(item.id)
  }

  const historyIds = new Set<string>()
  for (const snapshot of history) {
    if (!snapshot || typeof snapshot.id !== 'string' || snapshot.id.length > 128 || historyIds.has(snapshot.id)) {
      throw createError({ statusCode: 400, message: 'Données d’historique invalides.' })
    }
    assertEncryptedPayload(snapshot.payload, snapshot.iv)
    assertEncryptedPayload(snapshot.previousPayload, snapshot.previousIv)
    historyIds.add(snapshot.id)
  }

  const db = useDB()
  const transaction = await db.transaction('write')
  let committed = false

  try {
    const existing = await transaction.execute({
      sql: 'SELECT id, payload, iv FROM vault_items WHERE user_id = ? AND is_encrypted = 1',
      args: [session.user.id],
    })
    const existingIds = new Set(existing.rows.map(row => String(row.id)))
    const staleItem = items.some((item) => {
      const row = existing.rows.find(entry => String(entry.id) === item.id)
      return !row || String(row.payload) !== item.previousPayload || String(row.iv) !== item.previousIv
    })
    if (existingIds.size !== ids.size || [...existingIds].some(id => !ids.has(id)) || staleItem) {
      throw createError({ statusCode: 409, message: 'Le coffre a changé. Rechargez la page avant de réessayer.' })
    }

    const existingHistory = await transaction.execute({
      sql: 'SELECT id, payload, iv FROM vault_item_history WHERE user_id = ? AND is_encrypted = 1',
      args: [session.user.id],
    })
    const existingHistoryIds = new Set(existingHistory.rows.map(row => String(row.id)))
    const staleHistory = history.some((snapshot) => {
      const row = existingHistory.rows.find(entry => String(entry.id) === snapshot.id)
      return !row || String(row.payload) !== snapshot.previousPayload || String(row.iv) !== snapshot.previousIv
    })
    if (existingHistoryIds.size !== historyIds.size || [...existingHistoryIds].some(id => !historyIds.has(id)) || staleHistory) {
      throw createError({ statusCode: 409, message: 'L’historique a changé. Rechargez la page avant de réessayer.' })
    }

    const itemResults = items.length > 0
      ? await transaction.batch(items.map(item => ({
          sql: "UPDATE vault_items SET payload = ?, iv = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ? AND is_encrypted = 1",
          args: [item.payload, item.iv, item.id, session.user.id],
        })))
      : []
    if (itemResults.some(result => result.rowsAffected !== 1)) {
      throw createError({ statusCode: 409, message: 'Le coffre a changé pendant la rotation.' })
    }

    const historyResults = history.length > 0
      ? await transaction.batch(history.map(snapshot => ({
          sql: 'UPDATE vault_item_history SET payload = ?, iv = ? WHERE id = ? AND user_id = ? AND is_encrypted = 1',
          args: [snapshot.payload, snapshot.iv, snapshot.id, session.user.id],
        })))
      : []
    if (historyResults.some(result => result.rowsAffected !== 1)) {
      throw createError({ statusCode: 409, message: 'L’historique a changé pendant la rotation.' })
    }

    await transaction.execute({
      sql: `INSERT INTO master_verifiers (user_id, payload, iv, updated_at)
            VALUES (?, ?, ?, datetime('now'))
            ON CONFLICT(user_id) DO UPDATE SET
              payload = excluded.payload,
              iv = excluded.iv,
              updated_at = datetime('now')`,
      args: [session.user.id, verifier.payload, verifier.iv],
    })

    await transaction.commit()
    committed = true
  } finally {
    if (!committed) await transaction.rollback().catch(() => {})
    transaction.close()
  }

  return { message: 'Chiffrement du coffre et de l’historique mis à jour.' }
})
