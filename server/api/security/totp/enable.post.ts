/**
 * POST /api/security/totp/enable
 * Confirme le premier code et active le second facteur.
 *
 * Les codes de secours sont renvoyés une seule fois, en clair : seul leur
 * SHA-256 est conservé.
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const userId = String(session.user.id)
  await enforceRateLimit(event, 'totp-enable', 10, 15 * 60 * 1000, userId)

  const body = requireRecord(await readBody(event))
  const code = requireString(body.code, 'Code', { min: 1, max: 32 })

  const record = await getTotpRecord(event, userId)
  if (!record) {
    throw createError({ statusCode: 409, message: 'Lancez d’abord la configuration.' })
  }
  if (record.enabled) {
    throw createError({ statusCode: 409, message: 'La double authentification est déjà active.' })
  }

  const verdict = verifyTotp(decryptTotpSecret(record.secret), code)
  if (!verdict.ok || verdict.step === undefined) {
    throw createError({ statusCode: 400, message: 'Code incorrect. Vérifiez l’heure de votre appareil puis réessayez.' })
  }

  await activateTotp(event, userId, verdict.step)
  const codes = generateRecoveryCodes()
  await storeRecoveryCodes(event, userId, codes)

  // Un appareil resté connecté avec le seul mot de passe ne doit pas survivre
  // à l'activation : toutes les autres sessions sont fermées.
  const sid = (await getUserSession(event) as any)?.secure?.sid
  await closeOtherSessions(event, userId, sid)

  return { enabled: true, recoveryCodes: codes }
})
