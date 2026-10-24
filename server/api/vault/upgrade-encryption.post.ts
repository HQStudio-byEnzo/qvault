/**
 * POST /api/vault/upgrade-encryption
 *
 * Remplace des charges encore dérivées avec l'ancien facteur de travail
 * (100 000 itérations PBKDF2) par leur équivalent courant (600 000).
 *
 * Le client envoie l'ancienne et la nouvelle enveloppe. Le serveur vérifie que
 * l'ancienne est toujours celle stockée : une modification faite ailleurs
 * annule toute la transaction au lieu d'être écrasée.
 *
 * L'opération ne touche ni au mot de passe maître ni à l'historique ; elle est
 * donc rejouable sans risque au déverrouillage suivant.
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  await enforceRateLimit(event, 'vault-upgrade-encryption', 60, 60 * 60 * 1000, String(session.user.id))

  const body = requireRecord(await readBody(event))
  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 100) {
    throw createError({ statusCode: 400, message: 'Liste de mises à niveau invalide.' })
  }

  const ids = new Set<string>()
  const upgrades = body.items.map((entry) => {
    if (!entry || typeof entry !== 'object') {
      throw createError({ statusCode: 400, message: 'Mise à niveau invalide.' })
    }
    const item = entry as Record<string, unknown>
    const id = requireString(item.id, 'Id', { min: 1, max: 128 })
    if (ids.has(id)) throw createError({ statusCode: 400, message: 'Mise à niveau en double.' })
    ids.add(id)

    const previousPayload = requireString(item.previousPayload, 'Previous payload', { min: 1, max: 350_000, trim: false })
    if (previousPayload.split(':').length !== 2) {
      throw createError({ statusCode: 400, message: 'Seules les anciennes enveloppes sont concernées.' })
    }
    const current = assertEncryptedPayload(item.payload, item.iv)
    return { id, previousPayload, payload: current.payload, iv: current.iv }
  })

  const db = useDB()
  const transaction = await db.transaction('write')
  let committed = false

  try {
    const results = await transaction.batch(upgrades.map(item => ({
      sql: "UPDATE vault_items SET payload = ?, iv = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ? AND payload = ? AND is_encrypted = 1",
      args: [item.payload, item.iv, item.id, session.user.id, item.previousPayload],
    })))

    if (results.some(result => result.rowsAffected !== 1)) {      throw createError({ statusCode: 409, message: 'Le coffre a changé. Rechargez la page avant de réessayer.' })
    }

    await transaction.commit()
    committed = true
  } finally {
    if (!committed) await transaction.rollback().catch(() => {})
    transaction.close()
  }

  return { updated: upgrades.length }
})
