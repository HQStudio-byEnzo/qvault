/**
 * POST /api/vault
 * Crée un nouvel élément dans le coffre-fort
 * Le payload arrive déjà chiffré si is_encrypted=true (chiffrement côté client)
 * Applique les limites du plan Free (15 passwords, 15 crypto)
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()
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

  // Vérification des limites (plan Free)
  if (type === 'password' || type === 'crypto') {
    const config = useRuntimeConfig()

    // Vérifier si l'utilisateur est premium
    const user = await db.execute({
      sql: 'SELECT premium_until FROM users WHERE id = ?',
      args: [session.user.id],
    })

    const premiumUntil = (user.rows[0] as any)?.premium_until
    const isPremium = premiumUntil && new Date(premiumUntil) > new Date()

    if (!isPremium) {
      const countResult = await db.execute({
        sql: 'SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?',
        args: [session.user.id, type],
      })

      const count = Number(countResult.rows[0]?.count) || 0
      const limit = type === 'password'
        ? config.public.freeLimits.passwords
        : config.public.freeLimits.crypto

      if (count >= limit) {
        throw createError({
          statusCode: 403,
          message: `Limite atteinte (${limit} ${type === 'password' ? 'mots de passe' : 'clés crypto'}). Passez au plan Premium pour un stockage illimité.`,
        })
      }
    }
  }

  // Génération de l'ID
  const id = crypto.randomUUID()

  await db.execute({
    sql: 'INSERT INTO vault_items (id, user_id, type, label, is_encrypted, payload, iv, favorite, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, datetime(\'now\'), datetime(\'now\'))',
    args: [id, session.user.id, type, label || '', is_encrypted ? 1 : 0, payload, iv || null],
  })

  return {
    id,
    message: 'Élément ajouté avec succès.',
  }
})
