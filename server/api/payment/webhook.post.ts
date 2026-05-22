/**
 * POST /api/payment/webhook
 * Webhook NOWPayments — confirme le paiement et active le premium
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // Vérifier l'authenticité via IPN secret
  const receivedHmac = getHeader(event, 'x-nowpayments-sig')
  if (config.nowpaymentsIpnSecret && receivedHmac) {
    const crypto = await import('crypto')
    const sorted = JSON.stringify(sortObject(body))
    const hmac = crypto.createHmac('sha512', config.nowpaymentsIpnSecret).update(sorted).digest('hex')
    if (hmac !== receivedHmac) {
      throw createError({ statusCode: 401, message: 'Signature invalide.' })
    }
  }

  const { payment_status, order_id, payment_id } = body

  if (!order_id || !payment_status) {
    return { status: 'ignored' }
  }

  // Extraire le user_id depuis order_id (format: kipit-{userId}-{timestamp})
  const parts = order_id.split('-')
  if (parts.length < 3 || parts[0] !== 'kipit') {
    return { status: 'invalid_order' }
  }
  const userId = parts.slice(1, -1).join('-')

  const db = useDB()

  if (payment_status === 'finished' || payment_status === 'confirmed') {
    // Mettre à jour le paiement
    await db.execute({
      sql: "UPDATE payments SET status = 'successful' WHERE nowpayments_id = ?",
      args: [String(payment_id)],
    })

    // Activer le premium (+30 jours)
    const user = await db.execute({
      sql: 'SELECT premium_until FROM users WHERE id = ?',
      args: [userId],
    })

    let premiumStart = new Date()
    if (user.rows.length > 0) {
      const current = (user.rows[0] as any).premium_until
      if (current && new Date(current) > premiumStart) {
        premiumStart = new Date(current)
      }
    }

    const premiumUntil = new Date(premiumStart.getTime() + 30 * 24 * 60 * 60 * 1000)

    await db.execute({
      sql: 'UPDATE users SET premium_until = ? WHERE id = ?',
      args: [premiumUntil.toISOString(), userId],
    })

    console.log(`Premium activé pour ${userId} jusqu'au ${premiumUntil.toISOString()}`)
  } else if (payment_status === 'failed' || payment_status === 'expired') {
    await db.execute({
      sql: "UPDATE payments SET status = 'failed' WHERE nowpayments_id = ?",
      args: [String(payment_id)],
    })
  }

  return { status: 'ok' }
})

// Trie un objet récursivement (requis pour la vérification HMAC NOWPayments)
function sortObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj
  if (Array.isArray(obj)) return obj.map(sortObject)
  return Object.keys(obj).sort().reduce((sorted: any, key) => {
    sorted[key] = sortObject(obj[key])
    return sorted
  }, {})
}
