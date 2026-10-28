/**
 * POST /api/security/totp/disable
 * Désactive le second facteur. Exige le mot de passe **et** un code valide :
 * une session volée ne suffit donc pas à retirer la protection.
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const userId = String(session.user.id)
  await enforceRateLimit(event, 'totp-disable', 10, 15 * 60 * 1000, userId)

  const body = requireRecord(await readBody(event))
  const password = requireString(body.password, 'Password', { min: 1, max: 128, trim: false })
  const code = requireString(body.code, 'Code', { min: 1, max: 64 })

  const record = await getTotpRecord(event, userId)
  if (!record?.enabled) {
    throw createError({ statusCode: 409, message: 'La double authentification n’est pas active.' })
  }

  const db = useDB(event)
  const result = await db.execute({ sql: 'SELECT password FROM users WHERE id = ?', args: [userId] })
  const stored = result.rows[0] as any
  if (!stored || !(await verifyUserPassword(password, String(stored.password)))) {
    throw createError({ statusCode: 401, message: 'Mot de passe incorrect.' })
  }

  const verdict = verifyTotp(decryptTotpSecret(record.secret), code, { lastStep: record.lastStep })
  const accepted = verdict.ok || (!verdict.replayed && await consumeRecoveryCode(event, userId, code))
  if (!accepted) {
    throw createError({ statusCode: 401, message: 'Code de vérification incorrect.' })
  }

  await disableTotp(event, userId)

  const sid = (await getUserSession(event) as any)?.secure?.sid
  await closeOtherSessions(event, userId, sid)

  return { enabled: false }
})
