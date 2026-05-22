/**
 * Composable client pour l'authentification
 * Utilise nuxt-auth-utils (sessions via cookies sécurisés)
 */
export function useAuthClient() {
  const { loggedIn, user, session, clear, fetch: fetchSession } = useUserSession()

  /**
   * Inscription
   */
  async function signUp(data: { name: string; email: string; password: string }) {
    const response = await $fetch<{ user: any }>('/api/auth/register', {
      method: 'POST',
      body: data,
    })
    await fetchSession()
    return response
  }

  /**
   * Connexion
   */
  async function signIn(data: { email: string; password: string }) {
    const response = await $fetch<{ user: any }>('/api/auth/login', {
      method: 'POST',
      body: data,
    })
    await fetchSession()
    return response
  }

  /**
   * Déconnexion
   */
  async function signOut() {
    await clear()
    navigateTo('/auth/login')
  }

  return {
    user,
    session,
    loggedIn,
    loading: ref(false),
    fetchSession,
    signUp,
    signIn,
    signOut,
  }
}
