/**
 * GET /api/payment/verify?tx_ref=xxx
 * Vérifie le statut d'un paiement après le callback Flutterwave
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const txRef = query.tx_ref as string
  const transactionId = query.transaction_id as string

  if (!transactionId) {
    throw createError({ statusCode: 400, message: 'Transaction ID requis.' })
  }

  // Vérifier via l'API Flutterwave
  const flwResponse = await $fetch<any>(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    {
      headers: {
        Authorization: `Bearer ${config.flutterwaveSecretKey}`,
      },
    }
  )

  if (flwResponse.status === 'success' && flwResponse.data?.status === 'successful') {
    const db = useDB(event)

    // Mettre à jour le paiement
    await db
      .prepare('UPDATE payments SET status = ?, flutterwave_tx_id = ? WHERE flutterwave_ref = ? AND user_id = ?')
      .bind('successful', transactionId, txRef, session.user.id)
      .run()

    // Activer le premium (30 jours)
    const user = await db
      .prepare('SELECT premium_until FROM users WHERE id = ?')
      .bind(session.user.id)
      .first<{ premium_until: string | null }>()

    let premiumStart = new Date()
    if (user?.premium_until && new Date(user.premium_until) > premiumStart) {
      premiumStart = new Date(user.premium_until)
    }

    const premiumUntil = new Date(premiumStart.getTime() + 30 * 24 * 60 * 60 * 1000)

    await db
      .prepare('UPDATE users SET premium_until = ? WHERE id = ?')
      .bind(premiumUntil.toISOString(), session.user.id)
      .run()

    return {
      status: 'success',
      premium_until: premiumUntil.toISOString(),
      message: 'Paiement confirmé ! Votre plan Premium est maintenant actif.',
    }
  }

  return {
    status: 'failed',
    message: 'Le paiement n\'a pas pu être vérifié.',
  }
})
