/**
 * POST /api/payment/webhook
 * Webhook Flutterwave pour confirmer les paiements
 * Vérifie la signature et met à jour le statut premium
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  // Vérifier le hash de sécurité Flutterwave
  const signature = getHeader(event, 'verif-hash')
  
  if (signature !== config.flutterwaveWebhookSecret) {
    throw createError({ statusCode: 401, message: 'Signature invalide.' })
  }

  const { data } = body

  if (!data || data.status !== 'successful') {
    return { status: 'ignored' }
  }

  const db = useDB(event)
  const txRef = data.tx_ref
  const flwTxId = String(data.id)

  // Trouver le paiement
  const payment = await db
    .prepare('SELECT * FROM payments WHERE flutterwave_ref = ?')
    .bind(txRef)
    .first<{ id: string; user_id: string; amount: number }>()

  if (!payment) {
    console.error('Paiement non trouvé pour tx_ref:', txRef)
    return { status: 'not_found' }
  }

  // Vérifier le montant
  if (data.amount < config.public.premiumPrice) {
    await db
      .prepare('UPDATE payments SET status = ?, flutterwave_tx_id = ? WHERE id = ?')
      .bind('failed', flwTxId, payment.id)
      .run()
    return { status: 'amount_mismatch' }
  }

  // Mettre à jour le paiement
  await db
    .prepare('UPDATE payments SET status = ?, flutterwave_tx_id = ? WHERE id = ?')
    .bind('successful', flwTxId, payment.id)
    .run()

  // Calculer la nouvelle date premium (30 jours à partir de maintenant ou extension)
  const user = await db
    .prepare('SELECT premium_until FROM users WHERE id = ?')
    .bind(payment.user_id)
    .first<{ premium_until: string | null }>()

  let premiumStart = new Date()
  if (user?.premium_until && new Date(user.premium_until) > premiumStart) {
    premiumStart = new Date(user.premium_until)
  }

  const premiumUntil = new Date(premiumStart.getTime() + 30 * 24 * 60 * 60 * 1000)

  await db
    .prepare('UPDATE users SET premium_until = ? WHERE id = ?')
    .bind(premiumUntil.toISOString(), payment.user_id)
    .run()

  return { status: 'success' }
})
