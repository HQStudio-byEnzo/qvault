/**
 * POST /api/auth/2fa
 * Second facteur : code TOTP à 6 chiffres ou code de secours.
 *
 * Le mot de passe a déjà été validé ; ce défi expire en 5 minutes, accepte au
 * plus 5 essais et ne peut pas ouvrir deux sessions.
 */
const MAX_ATTEMPTS = 5

export default defineEventHandler(async (event) => {
  await enforceRateLimit(event, 'auth-2fa-ip', 30, 15 * 60 * 1000)
  const body = requireRecord(await readBody(event))
  const code = requireString(body.code, 'Code', { min: 1, max: 64 })

  function fail(message = 'Code de vérification incorrect.') {
    throw createError({ statusCode: 401, message })
  }

  const challengeId = getCookie(event, TWO_FACTOR_COOKIE)
  if (!challengeId) fail('Session de connexion expirée. Reconnectez-vous.')

  const challenge = await readLoginChallenge(event, challengeId)
  if (!challenge) {
    deleteCookie(event, TWO_FACTOR_COOKIE, { path: '/' })
    fail('Session de connexion expirée. Reconnectez-vous.')
  }
  const current = challenge!

  if (current.attempts >= MAX_ATTEMPTS) {
    await dropLoginChallenge(event, current.idHash)
    deleteCookie(event, TWO_FACTOR_COOKIE, { path: '/' })
    fail('Trop de tentatives. Reconnectez-vous.')
  }

  await enforceRateLimit(event, 'auth-2fa-challenge', 10, 15 * 60 * 1000, current.userId)

  const db = useDB(event)
  const result = await db.execute({
    sql: 'SELECT id, username, session_version, created_at, email, email_verified FROM users WHERE id = ?',
    args: [current.userId],
  })
  const user = result.rows[0] as any
  if (!user) {
    await dropLoginChallenge(event, current.idHash)
    deleteCookie(event, TWO_FACTOR_COOKIE, { path: '/' })
    fail('Compte introuvable. Reconnectez-vous.')
  }

  const record = await getTotpRecord(event, String(user.id))
  if (!record?.enabled) {
    // Le facteur a été désactivé entre-temps : on ne demande plus de code.
    await dropLoginChallenge(event, current.idHash).catch(() => {})
    deleteCookie(event, TWO_FACTOR_COOKIE, { path: '/' })
    throw createError({ statusCode: 409, message: 'Double authentification désactivée. Reconnectez-vous.' })
  }

  let step: number | null = null
  let accepted = false

  const secret = decryptTotpSecret(record.secret)
  const verdict = verifyTotp(secret, code, { lastStep: record.lastStep })
  if (verdict.ok && verdict.step !== undefined) {
    accepted = true
    step = verdict.step
  } else if (!verdict.replayed) {
    // Un code de secours n'est accepté que si ce n'est pas un code TOTP.
    accepted = await consumeRecoveryCode(event, String(user.id), code)
  }

  if (!accepted) {
    const attempts = await registerChallengeFailure(event, current.idHash)
    if (attempts >= MAX_ATTEMPTS) {
      await dropLoginChallenge(event, current.idHash)
      deleteCookie(event, TWO_FACTOR_COOKIE, { path: '/' })
      fail('Trop de tentatives. Reconnectez-vous.')
    }
    current.attempts = attempts
    if (verdict.replayed) fail('Ce code vient d’être utilisé. Attendez le code suivant.')
    fail()
  }

  if (step !== null) {
    // Anti-rejeu : le pas consommé ne resservira pas, même en cas de double
    // requête simultanée (la condition rend l'écriture atomique).
    await db.execute({
      sql: 'UPDATE user_totp SET last_step = ? WHERE user_id = ? AND last_step < ?',
      args: [step, current.userId, step],
    })
  }

  await dropLoginChallenge(event, current.idHash)
  deleteCookie(event, TWO_FACTOR_COOKIE, { path: '/' })

  await openUserSession(event, {
    id: String(user.id),
    username: String(user.username),
    sessionVersion: Number(user.session_version) || 0,
    created_at: user.created_at,
    needsEmail: false,
  })

  return { user: { id: String(user.id), username: String(user.username) }, needsEmail: false }
})
