<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md space-y-8 animate-fade-in">
      <div class="text-center space-y-4">
        <NuxtLink to="/" class="inline-flex items-center justify-center">
          <UiBitLockLogo :size="64" />
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
import { useLang } from '~/composables/useI18n'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const route = useRoute()
const { t } = useLang()
const { setMasterPassword } = useMasterPassword()
const { items, fetchItems, decryptItem } = useVault()

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
    await fetchItems()
    const encryptedItem = items.value.find(item => item.is_encrypted)
    if (encryptedItem) {
      await decryptItem(encryptedItem, password)
    }
    setMasterPassword(password)
    const requestedPath = typeof route.query.next === 'string' ? route.query.next : '/dashboard'
    const nextPath = requestedPath.startsWith('/') && !requestedPath.startsWith('//')
      ? requestedPath
      : '/dashboard'
    await navigateTo(nextPath)
  } catch {
    errorMsg.value = t('locked.errorGeneric')
  } finally {
    isLoading.value = false
  }
}
</script>
