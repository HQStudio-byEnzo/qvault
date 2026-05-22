/**
 * POST /api/auth/logout
 * Déconnexion
 */
export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  return { message: 'Déconnecté.' }
})
