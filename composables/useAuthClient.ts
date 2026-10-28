/**
 * Composable client pour l'authentification
 * Utilise nuxt-auth-utils (sessions via cookies sécurisés)
 */
export function useAuthClient() {
  const { loggedIn, user, session, clear, fetch: fetchSession } = useUserSession()
  const { clearMasterPassword } = useMasterPassword()

  /**
   * Inscription : crée le compte et envoie le lien de vérification.
   * Aucune session n'est ouverte tant que l'e-mail n'est pas confirmé.
   */
  async function signUp(data: {
    username: string
    email: string
    password: string
    acceptedTerms: boolean
    locale?: string
  }) {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: data,
    })
    clearMasterPassword()
    return response
  }

  /**
   * Connexion
   *
   * Si le compte est protégé par un code TOTP, aucune session n'est ouverte :
   * la réponse porte `twoFactorRequired` et il faut appeler `verifyTwoFactor`.
   */
  async function signIn(data: { username: string; password: string }) {
    const response: { user?: any; needsEmail?: boolean; twoFactorRequired?: boolean; expiresIn?: number } = await $fetch('/api/auth/login', {
      method: 'POST',
      body: data,
    })
    if (!response.twoFactorRequired) {
      await fetchSession()
      clearMasterPassword()
    }
    return response
  }

  /** Second facteur : code TOTP à 6 chiffres ou code de secours. */
  async function verifyTwoFactor(code: string) {
    const response: { user: any; needsEmail?: boolean } = await $fetch('/api/auth/2fa', {
      method: 'POST',
      body: { code },
    })
    await fetchSession()
    clearMasterPassword()
    return response
  }

  /**
   * Déconnexion
   */
  async function signOut() {
    const owner = user.value?.id || user.value?.username
    // Ferme la session côté serveur : un cookie copié ne sert plus (audit F10).
    await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    await clear()
    clearMasterPassword()
    if (import.meta.client) forgetPasskeyUnlock(owner)
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
    verifyTwoFactor,
    signOut,
  }
}
