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
        <h1 class="text-2xl font-bold text-white">Bon retour</h1>
        <p class="text-sm text-surface-400 mt-2">Connectez-vous à votre coffre-fort</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-surface-300 mb-1">Email</label>
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
          <label for="password" class="block text-sm font-medium text-surface-300 mb-1">Mot de passe</label>
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
        <div v-if="errorMsg" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="btn-primary w-full py-2.5"
        >
          <span v-if="isLoading">Connexion...</span>
          <span v-else>Se connecter</span>
        </button>
      </form>

      <!-- Footer -->
      <p class="text-center text-sm text-surface-400">
        Pas encore de compte ?
        <NuxtLink to="/auth/register" class="text-accent-400 hover:text-accent-300 font-medium">
          Créer un compte
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
    errorMsg.value = err.data?.message || 'Email ou mot de passe incorrect.'
  } finally {
    isLoading.value = false
  }
}
</script>
