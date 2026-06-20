<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-sm space-y-8 animate-fade-in">
      <!-- Header -->
      <div class="text-center">
        <NuxtLink to="/" class="inline-flex items-center gap-2 mb-6">
          <div class="w-10 h-10 bg-accent-600 rounded-xl flex items-center justify-center">
            <Icon name="lucide:shield" class="w-6 h-6 text-white" />
          </div>
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">{{ t('auth.login.title') }}</h1>
        <p class="text-sm text-surface-400 mt-2">{{ t('auth.login.subtitle') }}</p>
      </div>

      <!-- Form -->
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

        <!-- Hint section -->
        <div class="flex items-center justify-between">
          <button
            type="button"
            @click="showHint"
            class="text-xs text-accent-400 hover:text-accent-300 font-medium"
          >
            {{ t('auth.login.forgotHint') }}
          </button>
        </div>

        <div v-if="hintResult || hintMessage" class="p-3 rounded-lg bg-accent-500/10 border border-accent-500/20 text-sm text-accent-300">
          <span v-if="hintResult">{{ hintResult }}</span>
          <span v-else>{{ hintMessage }}</span>
        </div>

        <!-- Error message -->
        <div v-if="errorMsg" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
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

      <!-- Footer -->
      <div class="space-y-4">
        <p class="text-center text-sm text-surface-400">
          {{ t('auth.login.noAccount') }}
          <NuxtLink to="/auth/register" class="text-accent-400 hover:text-accent-300 font-medium">
            {{ t('auth.login.createAccount') }}
          </NuxtLink>
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3 text-xs text-surface-500">
          <NuxtLink to="/legal/cgu" class="hover:text-surface-300 transition-colors">Terms of Use</NuxtLink>
          <NuxtLink to="/legal/confidentialite" class="hover:text-surface-300 transition-colors">Privacy Policy</NuxtLink>
          <NuxtLink to="/legal/mentions-legales" class="hover:text-surface-300 transition-colors">Legal notice</NuxtLink>
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
const hintResult = ref('')
const hintMessage = ref('')

async function showHint() {
  hintResult.value = ''
  hintMessage.value = ''

  if (!form.email) {
    hintMessage.value = t('auth.login.enterEmail')
    return
  }

  try {
    const res = await $fetch<{ hint: string | null; message?: string }>(`/api/auth/hint?email=${encodeURIComponent(form.email)}`)
    if (res.hint) {
      hintResult.value = res.hint
    } else {
      hintMessage.value = res.message || t('auth.login.noHint')
    }
  } catch (err: any) {
    hintMessage.value = err.data?.message || t('auth.login.hintError')
  }
}

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
