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
        <h1 class="text-2xl font-bold text-white">Créer un compte</h1>
        <p class="text-sm text-surface-400 mt-2">Commencez à sécuriser vos données</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-surface-300 mb-1">Nom</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="input-field"
            placeholder="Votre nom"
          />
        </div>

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
            minlength="8"
            class="input-field"
            placeholder="Minimum 8 caractères"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-surface-300 mb-1">Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
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
          <span v-if="isLoading">Création...</span>
          <span v-else>Créer mon compte</span>
        </button>
      </form>

      <!-- Footer -->
      <p class="text-center text-sm text-surface-400">
        Déjà un compte ?
        <NuxtLink to="/auth/login" class="text-accent-400 hover:text-accent-300 font-medium">
          Se connecter
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

const { signUp } = useAuthClient()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const isLoading = ref(false)
const errorMsg = ref('')

async function handleRegister() {
  isLoading.value = true
  errorMsg.value = ''

  if (form.password !== form.confirmPassword) {
    errorMsg.value = 'Les mots de passe ne correspondent pas.'
    isLoading.value = false
    return
  }

  if (form.password.length < 8) {
    errorMsg.value = 'Le mot de passe doit contenir au moins 8 caractères.'
    isLoading.value = false
    return
  }

  try {
    await signUp({
      name: form.name,
      email: form.email,
      password: form.password,
    })
    navigateTo('/auth/verify')
  } catch (err: any) {
    errorMsg.value = err.data?.message || 'Erreur lors de la création du compte.'
  } finally {
    isLoading.value = false
  }
}
</script>
