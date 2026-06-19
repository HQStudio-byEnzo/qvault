/**
 * POST /api/vault
 * Crée un nouvel élément dans le coffre-fort (aucune limite)
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()
  const body = await readBody(event)

  const { type, label, is_encrypted = true, payload, iv, url } = body

  if (!type || !['link', 'password', 'crypto', 'recovery'].includes(type)) {
    throw createError({ statusCode: 400, message: 'Type invalide. Doit être: link, password, crypto ou recovery.' })
  }

  if (!payload) {
    throw createError({ statusCode: 400, message: 'Le payload est requis.' })
  }

  const encryptionRequired = type !== 'link'

  if (encryptionRequired && !is_encrypted) {
    throw createError({ statusCode: 400, message: 'Les mots de passe, recovery codes et clés crypto doivent être chiffrés côté client.' })
  }

  if (is_encrypted) {
    if (!iv || typeof iv !== 'string') {
      throw createError({ statusCode: 400, message: "Le vecteur d'initialisation (iv) est requis." })
    }

    if (typeof payload !== 'string' || payload.split(':').length !== 2) {
      throw createError({ statusCode: 400, message: 'Format de payload chiffré invalide.' })
    }
  }

  const id = crypto.randomUUID()

  await db.execute({
    sql: "INSERT INTO vault_items (id, user_id, type, label, is_encrypted, payload, iv, url, favorite, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))",
    args: [id, session.user.id, type, label || '', is_encrypted ? 1 : 0, payload, iv || null, url || null],
  })

  return { id, message: 'Élément ajouté avec succès.' }
})
