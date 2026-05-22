<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-sm space-y-8 animate-fade-in">
      <!-- Header -->
      <div class="text-center">
        <div class="w-14 h-14 bg-accent-600/10 border border-accent-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icon name="lucide:mail-check" class="w-7 h-7 text-accent-400" />
        </div>
        <h1 class="text-2xl font-bold text-white">Vérifiez votre email</h1>
        <p class="text-sm text-surface-400 mt-2">
          Un code à 6 chiffres a été envoyé à votre adresse email.
        </p>
      </div>

      <!-- Code input -->
      <form @submit.prevent="handleVerify" class="space-y-4">
        <div>
          <label for="code" class="block text-sm font-medium text-surface-300 mb-1">Code de vérification</label>
          <input
            id="code"
            v-model="code"
            type="text"
            inputmode="numeric"
            maxlength="6"
            required
            autofocus
            class="input-field text-center text-2xl tracking-[0.5em] font-mono"
            placeholder="000000"
          />
        </div>

        <!-- Error / Success -->
        <div v-if="errorMsg" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {{ errorMsg }}
        </div>
        <div v-if="successMsg" class="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400">
          {{ successMsg }}
        </div>

        <button type="submit" :disabled="isLoading || code.length !== 6" class="btn-primary w-full py-2.5">
          <span v-if="isLoading">Vérification...</span>
          <span v-else>Vérifier</span>
        </button>
      </form>

      <!-- Resend -->
      <div class="text-center">
        <button
          @click="handleResend"
          :disabled="resendCooldown > 0"
          class="text-sm text-accent-400 hover:text-accent-300 disabled:text-surface-600 disabled:cursor-not-allowed"
        >
          <span v-if="resendCooldown > 0">Renvoyer dans {{ resendCooldown }}s</span>
          <span v-else>Renvoyer le code</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const code = ref('')
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const resendCooldown = ref(0)

let cooldownInterval: ReturnType<typeof setInterval>

async function handleVerify() {
  isLoading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    await $fetch('/api/auth/verify', {
      method: 'POST',
      body: { code: code.value },
    })
    successMsg.value = 'Email vérifié !'
    setTimeout(() => navigateTo('/dashboard'), 1000)
  } catch (err: any) {
    errorMsg.value = err.data?.message || 'Code incorrect.'
  } finally {
    isLoading.value = false
  }
}

async function handleResend() {
  errorMsg.value = ''
  try {
    await $fetch('/api/auth/resend-code', { method: 'POST' })
    successMsg.value = 'Nouveau code envoyé !'
    resendCooldown.value = 60
    cooldownInterval = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) clearInterval(cooldownInterval)
    }, 1000)
  } catch (err: any) {
    errorMsg.value = err.data?.message || 'Erreur lors de l\'envoi.'
  }
}
</script>
