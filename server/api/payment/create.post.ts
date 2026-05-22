/**
 * POST /api/payment/create
 * Crée un paiement crypto via NOWPayments
 * L'utilisateur reçoit une adresse crypto pour payer
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { crypto: payCrypto } = body // 'usdttrc20' | 'btc' | 'ltc' | 'eth'

  if (!config.nowpaymentsApiKey) {
    throw createError({ statusCode: 500, message: 'Paiement non configuré.' })
  }

  const db = useDB()

  // Vérifier si déjà premium
  const user = await db.execute({
    sql: 'SELECT premium_until FROM users WHERE id = ?',
    args: [session.user.id],
  })

  if (user.rows.length > 0) {
    const premiumUntil = (user.rows[0] as any).premium_until
    if (premiumUntil && new Date(premiumUntil) > new Date()) {
      throw createError({ statusCode: 400, message: 'Vous êtes déjà Premium.' })
    }
  }

  // Créer le paiement via NOWPayments
  const nowResponse = await $fetch<any>('https://api.nowpayments.io/v1/invoice', {
    method: 'POST',
    headers: {
      'x-api-key': config.nowpaymentsApiKey,
      'Content-Type': 'application/json',
    },
    body: {
      price_amount: 2.99,
      price_currency: 'usd',
      pay_currency: payCrypto || 'usdttrc20',
      order_id: `kipit-${session.user.id}-${Date.now()}`,
      order_description: 'Kipit Premium - 30 jours',
      ipn_callback_url: `${config.appUrl}/api/payment/webhook`,
      success_url: `${config.appUrl}/dashboard/settings?payment=success`,
      cancel_url: `${config.appUrl}/dashboard/settings?payment=cancelled`,
    },
  })

  // Sauvegarder en BDD
  const paymentId = crypto.randomUUID()
  await db.execute({
    sql: "INSERT INTO payments (id, user_id, amount, currency, crypto, status, nowpayments_id, created_at) VALUES (?, ?, ?, ?, ?, 'pending', ?, datetime('now'))",
    args: [paymentId, session.user.id, 2.99, 'USD', payCrypto || 'usdttrc20', String(nowResponse.id)],
  })

  return {
    payment_id: paymentId,
    invoice_url: nowResponse.invoice_url,
    nowpayments_id: nowResponse.id,
  }
})
