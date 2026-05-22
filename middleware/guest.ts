/**
 * Middleware guest
 * Redirige vers /dashboard si déjà connecté
 */
export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn } = useUserSession()

  if (loggedIn.value) {
    return navigateTo('/dashboard')
  }
})
