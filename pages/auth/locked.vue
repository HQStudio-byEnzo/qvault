<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10">
    <div class="w-full max-w-md space-y-8 animate-fade-in">
      <div class="text-center space-y-4">
        <NuxtLink to="/" class="inline-flex items-center gap-3 justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[0_18px_50px_-26px_rgba(0,0,0,0.75)]">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 bg-gradient-to-br from-emerald-500 via-emerald-400 to-accent-600 shadow-lg shadow-emerald-950/35" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="block w-6 h-6">
              <path d="M12 2.5L19.5 5.3V11.2C19.5 16.2 16.1 20.7 12 21.5C7.9 20.7 4.5 16.2 4.5 11.2V5.3L12 2.5Z" fill="white" fill-opacity="0.16" />
              <path d="M12 5L17 6.9V11.1C17 14.9 14.7 18.3 12 19C9.3 18.3 7 14.9 7 11.1V6.9L12 5Z" fill="white" />
              <path d="M12 8.1C10.5 8.1 9.3 9.3 9.3 10.8V12.1H8.5V16H15.5V12.1H14.7V10.8C14.7 9.3 13.5 8.1 12 8.1ZM12 9.4C12.7 9.4 13.3 10 13.3 10.8V12.1H10.7V10.8C10.7 10 11.3 9.4 12 9.4Z" fill="#0f172a" />
            </svg>
          </div>
          <div class="text-left leading-tight min-w-0">
            <p class="text-base font-semibold tracking-tight text-white leading-none">BitLock</p>
            <p class="hidden sm:block text-[11px] text-surface-400 mt-1 truncate">Private workspace</p>
          </div>
        </NuxtLink>
        <div class="space-y-2">
          <h1 class="text-3xl font-semibold tracking-tight text-white">{{ t('locked.title') }}</h1>
          <p class="text-sm text-surface-400">{{ t('locked.subtitle') }}</p>
        </div>
      </div>

      <div class="glass-panel p-6 md:p-8 space-y-5">
        <div class="p-4 rounded-2xl bg-accent-500/10 border border-accent-500/20 text-sm text-accent-200">
          {{ reasonMessage }}
        </div>

        <form class="space-y-4" @submit.prevent="unlockVault">
          <div>
            <label for="masterPassword" class="block text-sm font-medium text-surface-300 mb-1">
              {{ t('locked.password') }}
            </label>
            <input
              id="masterPassword"
              v-model="masterPasswordInput"
              type="password"
              class="input-field"
              :placeholder="t('locked.passwordPlaceholder')"
              autocomplete="current-password"
              autofocus
            />
          </div>

          <div v-if="errorMsg" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {{ errorMsg }}
          </div>

          <button type="submit" :disabled="isLoading" class="btn-primary w-full py-2.5">
            <span v-if="isLoading">{{ t('locked.loading') }}</span>
            <span v-else>{{ t('locked.cta') }}</span>
          </button>
        </form>

        <NuxtLink to="/auth/login" class="block text-center text-sm text-surface-400 hover:text-white transition-colors">
          {{ t('locked.back') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const route = useRoute()
const { t } = useLang()
const { setMasterPassword } = useMasterPassword()

const masterPasswordInput = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

const reasonMessage = computed(() => {
  return route.query.reason === 'timeout'
    ? t('locked.reasonTimeout')
    : t('locked.reasonGeneral')
})

async function unlockVault() {
  errorMsg.value = ''
  const password = masterPasswordInput.value.trim()

  if (!password) {
    errorMsg.value = t('locked.errorRequired')
    return
  }

  isLoading.value = true
  try {
    setMasterPassword(password)
    await navigateTo((route.query.next as string) || '/dashboard')
  } catch {
    errorMsg.value = t('locked.errorGeneric')
  } finally {
    isLoading.value = false
  }
}
</script>
