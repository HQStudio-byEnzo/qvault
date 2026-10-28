/**
 * GET /api/security/totp
 * État du second facteur pour la session courante.
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const userId = String(session.user.id)
  const record = await getTotpRecord(event, userId)
  const pending = Boolean(record && !record.enabled)
  setHeader(event, 'Cache-Control', 'no-store')
  return {
    enabled: Boolean(record?.enabled),
    pending,
    enabledAt: record?.enabledAt ?? null,
    recoveryCodesLeft: record?.enabled ? await countUnusedRecoveryCodes(event, userId) : 0,
  }
})
