/**
 * POST /api/security/sessions/revoke-others
 * Ferme toutes les sessions sauf la session courante.
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  await enforceRateLimit(event, 'security-sessions-revoke-others', 20, 60 * 60 * 1000, String(session.user.id))
  const sid = ((await getUserSession(event)) as any)?.secure?.sid
  const revoked = await closeOtherSessions(event, String(session.user.id), sid)
  return { revoked }
})
