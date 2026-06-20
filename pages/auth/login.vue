<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10">
    <div class="w-full max-w-md space-y-8 animate-fade-in">
      <div class="text-center">
        <NuxtLink to="/" class="inline-flex items-center gap-3 justify-center mb-6 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[0_18px_50px_-26px_rgba(0,0,0,0.75)]">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 bg-gradient-to-br from-emerald-500 via-emerald-400 to-accent-600 shadow-lg shadow-emerald-950/35" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="block w-6 h-6">
              <path d="M12 2.5L19.5 5.3V11.2C19.5 16.2 16.1 20.7 12 21.5C7.9 20.7 4.5 16.2 4.5 11.2V5.3L12 2.5Z" fill="white" fill-opacity="0.16" />
              <path d="M12 5L17 6.9V11.1C17 14.9 14.7 18.3 12 19C9.3 18.3 7 14.9 7 11.1V6.9L12 5Z" fill="white" />
              <path d="M12 8.1C10.5 8.1 9.3 9.3 9.3 10.8V12.1H8.5V16H15.5V12.1H14.7V10.8C14.7 9.3 13.5 8.1 12 8.1ZM12 9.4C12.7 9.4 13.3 10 13.3 10.8V12.1H10.7V10.8C10.7 10 11.3 9.4 12 9.4Z" fill="#0f172a" />
            </svg>
          </div>
          <div class="text-left leading-tight min-w-0">
            <p class="text-base font-semibold tracking-tight text-white leading-none">BitLock</p>
            <p class="hidden sm:block text-[11px] text-surface-400 mt-1 truncate">Security vault</p>
          </div>
        </NuxtLink>
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
