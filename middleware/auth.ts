/**
 * Middleware d'authentification
 * Redirige vers /auth/login si non connecté
 * Redirige vers /auth/verify si email non vérifié
 */
export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, user } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/auth/login')
  }

  if (user.value && !user.value.emailVerified) {
    return navigateTo('/auth/verify')
  }
})
