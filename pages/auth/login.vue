<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md space-y-8 animate-fade-in">
      <div class="text-center">
        <NuxtLink to="/" class="inline-flex items-center justify-center mb-6">
          <BitLockLogo :size="52" />
        </NuxtLink>
        <p class="eyebrow mb-4">{{ t('nav.login') }}</p>
        <h1 class="text-3xl font-semibold tracking-tight text-white">{{ t('auth.login.title') }}</h1>
        <p class="text-sm text-surface-400 mt-3">{{ t('auth.login.subtitle') }}</p>
      </div>

      <div class="glass-panel p-6 md:p-8">
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-surface-300 mb-1">{{ t('auth.login.email') }}</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="input-field"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-surface-300 mb-1">{{ t('auth.login.password') }}</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="input-field"
            placeholder="••••••••"
          />
        </div>

        <!-- Error message -->
        <div v-if="errorMsg" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="btn-primary w-full py-2.5"
        >
          <span v-if="isLoading">{{ t('auth.login.loading') }}</span>
          <span v-else>{{ t('auth.login.btn') }}</span>
        </button>
      </form>
      </div>

      <!-- Footer -->
      <div class="space-y-4">
        <p class="text-center text-sm text-surface-400">
          {{ t('auth.login.noAccount') }}
          <NuxtLink to="/auth/register" class="text-accent-400 hover:text-accent-300 font-medium">
            {{ t('auth.login.createAccount') }}
          </NuxtLink>
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3 text-xs text-surface-500">
          <NuxtLink to="/legal/cgu" class="hover:text-surface-300 transition-colors">{{ t('footer.terms') }}</NuxtLink>
          <NuxtLink to="/legal/confidentialite" class="hover:text-surface-300 transition-colors">{{ t('footer.privacy') }}</NuxtLink>
          <NuxtLink to="/legal/mentions-legales" class="hover:text-surface-300 transition-colors">{{ t('footer.legalNotice') }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'

definePageMeta({
  layout: 'default',
  middleware: 'guest',
})

const { t } = useLang()
const { signIn } = useAuthClient()

const form = reactive({
  email: '',
  password: '',
})

const isLoading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  isLoading.value = true
  errorMsg.value = ''

  try {
    await signIn({ email: form.email, password: form.password })
    navigateTo('/dashboard')
  } catch (err: any) {
    errorMsg.value = err.data?.message || t('auth.login.error')
  } finally {
    isLoading.value = false
  }
}
</script>
