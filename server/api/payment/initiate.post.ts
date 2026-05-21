/**
 * POST /api/payment/initiate
 * Initie un paiement Flutterwave pour le plan Premium
 * Supporte Mobile Money (M-Pesa, Orange Money, Airtel Money)
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { payment_method } = body // 'mobile_money_franco' | 'mobile_money_mpesa'

  if (!config.flutterwaveSecretKey) {
    throw createError({
      statusCode: 500,
      message: 'Configuration de paiement manquante.',
    })
  }

  const txRef = `kipit-premium-${session.user.id}-${Date.now()}`

  // Créer le paiement en BDD
  const db = useDB(event)
  const paymentId = crypto.randomUUID()

  await db
    .prepare(
      'INSERT INTO payments (id, user_id, flutterwave_ref, amount, currency, status, payment_method, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime(\'now\'))'
    )
    .bind(
      paymentId,
      session.user.id,
      txRef,
      config.public.premiumPrice,
      config.public.premiumCurrency,
      'pending',
      payment_method || 'mobile_money'
    )
    .run()

  // Appel à l'API Flutterwave pour créer le lien de paiement
  const flwResponse = await $fetch<any>('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.flutterwaveSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: {
      tx_ref: txRef,
      amount: config.public.premiumPrice,
      currency: config.public.premiumCurrency === 'EUR' ? 'USD' : config.public.premiumCurrency,
      redirect_url: `${config.betterAuthUrl}/dashboard/payment/callback`,
      payment_options: payment_method || 'mobilemoneyrwanda,mobilemoneyfranco,mpesa',
      customer: {
        email: (session.user as any).email,
        name: (session.user as any).name,
      },
      customizations: {
        title: 'Kipit Premium',
        description: 'Abonnement Kipit Premium - 1 mois',
        logo: `${config.betterAuthUrl}/favicon.svg`,
      },
      meta: {
        user_id: session.user.id,
        payment_id: paymentId,
      },
    },
  })

  return {
    payment_id: paymentId,
    payment_link: flwResponse.data?.link,
    tx_ref: txRef,
  }
})
