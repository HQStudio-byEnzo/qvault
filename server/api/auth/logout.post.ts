/**
 * POST /api/auth/logout
 * Déconnexion
 */
export default defineEventHandler(async (event) => {
  await closeUserSession(event)
  return { message: 'Déconnecté.' }
})
