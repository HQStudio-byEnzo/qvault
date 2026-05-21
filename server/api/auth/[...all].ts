/**
 * Route catch-all pour BetterAuth
 * Gère toutes les routes /api/auth/* (sign-in, sign-up, session, etc.)
 */
export default defineEventHandler(async (event) => {
  const auth = useAuth(event)
  
  return auth.handler(toWebRequest(event))
})
