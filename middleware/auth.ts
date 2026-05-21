/**
 * Middleware d'authentification
 * Redirige vers /auth/login si l'utilisateur n'est pas connecté
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { user, fetchSession, loading } = useAuthClient()

  // Charger la session si pas encore fait
  if (!user.value && loading.value) {
    await fetchSession()
  }

  if (!user.value) {
    return navigateTo('/auth/login')
  }
})
