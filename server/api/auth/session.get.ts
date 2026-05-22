/**
 * GET /api/auth/session
 * Récupère la session courante
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  return session || { user: null }
})
