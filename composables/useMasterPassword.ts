export function useMasterPassword() {
  const masterPassword = useState<string | null>('kipit-master-password', () => null)

  const isUnlocked = computed(() => !!masterPassword.value)

  function setMasterPassword(value: string) {
    masterPassword.value = value
  }

  function clearMasterPassword() {
    masterPassword.value = null
  }

  return {
    masterPassword,
    isUnlocked,
    setMasterPassword,
    clearMasterPassword,
  }
}
