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
        <h1 class="text-2xl font-bold text-white">{{ t('auth.register.title') }}</h1>
        <p class="text-sm text-surface-400 mt-2">{{ t('auth.register.subtitle') }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-surface-300 mb-1">{{ t('auth.register.name') }}</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="input-field"
            :placeholder="t('auth.register.namePlaceholder')"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-surface-300 mb-1">{{ t('auth.register.email') }}</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="input-field"
            placeholder="vous@exemple.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-surface-300 mb-1">{{ t('auth.register.password') }}</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            minlength="8"
            class="input-field"
            placeholder="Minimum 8 caractères"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-surface-300 mb-1">{{ t('auth.register.confirmPassword') }}</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="input-field"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label for="hint" class="block text-sm font-medium text-surface-300 mb-1">{{ t('auth.register.hint') }}</label>
          <input id="hint" v-model="form.hint" type="text" class="input-field" :placeholder="t('auth.register.hintPlaceholder')" />
          <p class="text-xs text-surface-500 mt-1">{{ t('auth.register.hintDesc') }}</p>
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
          <span v-if="isLoading">{{ t('auth.register.loading') }}</span>
          <span v-else>{{ t('auth.register.btn') }}</span>
        </button>
      </form>

      <!-- Footer -->
      <p class="text-center text-sm text-surface-400">
        {{ t('auth.register.hasAccount') }}
        <NuxtLink to="/auth/login" class="text-accent-400 hover:text-accent-300 font-medium">
          {{ t('auth.register.login') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'guest',
})

const { t } = useLang()
const { signUp } = useAuthClient()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  hint: '',
})

const isLoading = ref(false)
const errorMsg = ref('')

async function handleRegister() {
  isLoading.value = true
  errorMsg.value = ''

  if (form.password !== form.confirmPassword) {
    errorMsg.value = t('auth.register.pwdMismatch')
    isLoading.value = false
    return
  }

  if (form.password.length < 8) {
    errorMsg.value = t('auth.register.pwdTooShort')
    isLoading.value = false
    return
  }

  try {
    await signUp({
      name: form.name,
      email: form.email,
      password: form.password,
      hint: form.hint,
    })
    navigateTo('/dashboard')
  } catch (err: any) {
    errorMsg.value = err.data?.message || t('auth.register.error')
  } finally {
    isLoading.value = false
  }
}
</script>
