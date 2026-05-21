<template>
  <div class="p-6 lg:p-8 max-w-md mx-auto">
    <div class="card text-center space-y-4 animate-fade-in">
      <div v-if="loading" class="space-y-4">
        <Icon name="lucide:loader-2" class="w-12 h-12 text-accent-400 animate-spin mx-auto" />
        <p class="text-surface-300">Vérification du paiement...</p>
      </div>

      <div v-else-if="success" class="space-y-4">
        <div class="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
          <Icon name="lucide:check-circle" class="w-8 h-8 text-green-400" />
        </div>
        <h2 class="text-xl font-bold text-white">Paiement réussi !</h2>
        <p class="text-sm text-surface-400">{{ message }}</p>
        <NuxtLink to="/dashboard" class="btn-primary inline-block">
          Retour au tableau de bord
        </NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
          <Icon name="lucide:x-circle" class="w-8 h-8 text-red-400" />
        </div>
        <h2 class="text-xl font-bold text-white">Paiement échoué</h2>
        <p class="text-sm text-surface-400">{{ message }}</p>
        <NuxtLink to="/dashboard/settings" class="btn-secondary inline-block">
          Réessayer
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const route = useRoute()
const loading = ref(true)
const success = ref(false)
const message = ref('')

onMounted(async () => {
  const txRef = route.query.tx_ref as string
  const transactionId = route.query.transaction_id as string
  const status = route.query.status as string

  if (status === 'cancelled') {
    loading.value = false
    success.value = false
    message.value = 'Le paiement a été annulé.'
    return
  }

  if (!transactionId) {
    loading.value = false
    success.value = false
    message.value = 'Aucune transaction trouvée.'
    return
  }

  try {
    const response = await $fetch<{ status: string; message: string }>('/api/payment/verify', {
      params: { tx_ref: txRef, transaction_id: transactionId },
    })

    success.value = response.status === 'success'
    message.value = response.message
  } catch (err: any) {
    success.value = false
    message.value = err.data?.message || 'Erreur de vérification.'
  } finally {
    loading.value = false
  }
})
</script>
