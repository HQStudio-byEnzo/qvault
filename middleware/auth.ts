/**
 * Middleware d'authentification
 * Redirige vers /auth/login si non connecté
 */
export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/auth/login')
  }
})
