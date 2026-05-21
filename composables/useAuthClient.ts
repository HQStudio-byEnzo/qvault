/**
 * Composable client pour l'authentification BetterAuth
 * Gère l'état de session côté client
 */
export function useAuthClient() {
  const user = useState<any | null>('auth-user', () => null)
  const session = useState<any | null>('auth-session', () => null)
  const loading = useState('auth-loading', () => true)
  const isPremium = computed(() => {
    if (!user.value?.premium_until) return false
    return new Date(user.value.premium_until) > new Date()
  })

  /**
   * Récupère la session courante
   */
  async function fetchSession() {
    loading.value = true
    try {
      const response = await $fetch<any>('/api/auth/get-session', {
        headers: useRequestHeaders(['cookie']),
      })
      if (response?.user) {
        user.value = response.user
        session.value = response.session
      } else {
        user.value = null
        session.value = null
      }
    } catch {
      user.value = null
      session.value = null
    } finally {
      loading.value = false
    }
  }

  /**
   * Inscription par email/mot de passe
   */
  async function signUp(data: { name: string; email: string; password: string }) {
    const response = await $fetch<any>('/api/auth/sign-up/email', {
      method: 'POST',
      body: data,
    })
    
    if (response?.user) {
      user.value = response.user
      session.value = response.session
    }
    
    return response
  }

  /**
   * Connexion par email/mot de passe
   */
  async function signIn(data: { email: string; password: string }) {
    const response = await $fetch<any>('/api/auth/sign-in/email', {
      method: 'POST',
      body: data,
    })
    
    if (response?.user) {
      user.value = response.user
      session.value = response.session
    }
    
    return response
  }

  /**
   * Déconnexion
   */
  async function signOut() {
    await $fetch('/api/auth/sign-out', { method: 'POST' })
    user.value = null
    session.value = null
    navigateTo('/auth/login')
  }

  return {
    user,
    session,
    loading,
    isPremium,
    fetchSession,
    signUp,
    signIn,
    signOut,
  }
}
