/**
 * DELETE /api/security/sessions/:id
 * Ferme une session distante. La session courante passe par « Se déconnecter ».
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  await enforceRateLimit(event, 'security-session-revoke', 60, 60 * 60 * 1000, String(session.user.id))

  const id = getRouterParam(event, 'id')
  if (!id || !/^[a-f0-9]{64}$/.test(id)) {
    throw createError({ statusCode: 400, message: 'Session invalide.' })
  }

  const revoked = await revokeUserSession(event, String(session.user.id), id)
  if (!revoked) {
    throw createError({ statusCode: 404, message: 'Session introuvable ou déjà fermée.' })
  }
  return { message: 'Session fermée.' }
})
