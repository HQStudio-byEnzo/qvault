/**
 * Composable pour le verrouillage automatique après inactivité
 * Déconnecte l'utilisateur après 5 minutes d'inactivité
 * Affiche un avertissement 30 secondes avant la déconnexion
 */
export function useAutoLock() {
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000 // 5 minutes
  const WARNING_BEFORE = 30 * 1000 // 30 secondes avant

  const { signOut } = useAuthClient()

  const showWarning = ref(false)
  const remainingSeconds = ref(30)

  let inactivityTimer: ReturnType<typeof setTimeout> | null = null
  let warningTimer: ReturnType<typeof setTimeout> | null = null
  let countdownInterval: ReturnType<typeof setInterval> | null = null

  function resetTimers() {
    // Hide warning if shown
    showWarning.value = false
    remainingSeconds.value = 30

    // Clear existing timers
    if (inactivityTimer) clearTimeout(inactivityTimer)
    if (warningTimer) clearTimeout(warningTimer)
    if (countdownInterval) clearInterval(countdownInterval)

    // Set warning timer (fires 30s before logout)
    warningTimer = setTimeout(() => {
      showWarning.value = true
      remainingSeconds.value = 30

      // Start countdown
      countdownInterval = setInterval(() => {
        remainingSeconds.value--
        if (remainingSeconds.value <= 0) {
          if (countdownInterval) clearInterval(countdownInterval)
        }
      }, 1000)
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE)

    // Set logout timer
    inactivityTimer = setTimeout(() => {
      performLogout()
    }, INACTIVITY_TIMEOUT)
  }

  function performLogout() {
    cleanup()
    signOut()
  }

  function cleanup() {
    if (inactivityTimer) clearTimeout(inactivityTimer)
    if (warningTimer) clearTimeout(warningTimer)
    if (countdownInterval) clearInterval(countdownInterval)

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.removeEventListener(event, resetTimers)
    })
  }

  function init() {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, resetTimers, { passive: true })
    })

    // Start initial timer
    resetTimers()
  }

  // Lifecycle
  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    showWarning,
    remainingSeconds,
    resetTimers,
  }
}
