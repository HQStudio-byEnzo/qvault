/**
 * POST /api/vault
 * Crée un nouvel élément dans le coffre-fort
 * Le payload arrive déjà chiffré si is_encrypted=true (chiffrement côté client)
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB(event)
  const body = await readBody(event)

  // Validation
  const { type, label, is_encrypted, payload, iv } = body

  if (!type || !['link', 'password', 'crypto'].includes(type)) {
    throw createError({
      statusCode: 400,
      message: 'Type invalide. Doit être: link, password, ou crypto.',
    })
  }

  if (!payload) {
    throw createError({
      statusCode: 400,
      message: 'Le payload est requis.',
    })
  }

  if (is_encrypted && !iv) {
    throw createError({
      statusCode: 400,
      message: 'Le vecteur d\'initialisation (iv) est requis pour les éléments chiffrés.',
    })
  }

  // Génération de l'ID
  const id = crypto.randomUUID()

  await db
    .prepare(
      'INSERT INTO vault_items (id, user_id, type, label, is_encrypted, payload, iv, favorite, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, datetime(\'now\'), datetime(\'now\'))'
    )
    .bind(id, session.user.id, type, label || '', is_encrypted ? 1 : 0, payload, iv || null)
    .run()

  return {
    id,
    message: 'Élément ajouté avec succès.',
  }
})
