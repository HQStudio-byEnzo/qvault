/**
 * POST /api/security/totp/setup
 * Génère un secret TOTP en attente et renvoie l'URL otpauth à scanner.
 *
 * Rien n'est activé ici : le second facteur ne protège le compte qu'après
 * confirmation d'un premier code (POST /api/security/totp/enable).
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const userId = String(session.user.id)
  await enforceRateLimit(event, 'totp-setup', 8, 60 * 60 * 1000, userId)

  const record = await getTotpRecord(event, userId)
  if (record?.enabled) {
    throw createError({ statusCode: 409, message: 'La double authentification est déjà active.' })
  }

  const secret = generateTotpSecret()
  await storePendingTotpSecret(event, userId, secret)

  return {
    secret,
    otpauthUrl: buildOtpAuthUrl({ secret, account: String(session.user.username), issuer: 'QVault' }),
  }
})
