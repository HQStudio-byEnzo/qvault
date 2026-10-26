/**
 * GET /api/security/sessions
 * Liste les sessions ouvertes de l'utilisateur, la session courante marquée.
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const sessions = await listUserSessions(event, String(session.user.id))
  setHeader(event, 'Cache-Control', 'no-store')
  return { sessions }
})
