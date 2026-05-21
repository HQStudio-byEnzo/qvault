/**
 * Middleware pour les pages d'authentification
 * Redirige vers /dashboard si l'utilisateur est déjà connecté
 */
export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchSession, loading } = useAuthClient()

  if (!user.value && loading.value) {
    await fetchSession()
  }

  if (user.value) {
    return navigateTo('/dashboard')
  }
})
