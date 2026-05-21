<template>
  <div class="p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-white">Paramètres</h1>
      <p class="text-surface-400 text-sm mt-1">Gérez votre compte et votre abonnement</p>
    </div>

    <!-- Account section -->
    <section class="card space-y-4">
      <h2 class="text-lg font-semibold text-white flex items-center gap-2">
        <Icon name="lucide:user" class="w-5 h-5 text-surface-400" />
        Compte
      </h2>
      <div class="space-y-3">
        <div class="flex items-center justify-between py-2 border-b border-surface-800">
          <span class="text-sm text-surface-400">Nom</span>
          <span class="text-sm text-surface-200">{{ user?.name }}</span>
        </div>
        <div class="flex items-center justify-between py-2 border-b border-surface-800">
          <span class="text-sm text-surface-400">Email</span>
          <span class="text-sm text-surface-200">{{ user?.email }}</span>
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="text-sm text-surface-400">Membre depuis</span>
          <span class="text-sm text-surface-200">{{ formatDate(user?.created_at) }}</span>
        </div>
      </div>
    </section>

    <!-- Plan section -->
    <section class="card space-y-4">
      <h2 class="text-lg font-semibold text-white flex items-center gap-2">
        <Icon name="lucide:crown" class="w-5 h-5 text-accent-400" />
        Abonnement
      </h2>

      <div v-if="isPremium" class="p-4 rounded-lg bg-accent-500/10 border border-accent-500/20">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="lucide:check-circle" class="w-5 h-5 text-green-400" />
          <span class="font-medium text-white">Plan Premium actif</span>
        </div>
        <p class="text-sm text-surface-400">
          Votre plan Premium est actif jusqu'au 
          <span class="text-surface-200 font-medium">{{ formatDate(user?.premium_until) }}</span>.
        </p>
      </div>

      <div v-else class="space-y-4">
        <div class="p-4 rounded-lg bg-surface-800 border border-surface-700">
          <p class="font-medium text-white mb-1">Plan Free</p>
          <ul class="text-sm text-surface-400 space-y-1">
            <li class="flex items-center gap-2">
              <Icon name="lucide:check" class="w-3 h-3 text-green-400" />
              Liens illimités
            </li>
            <li class="flex items-center gap-2">
              <Icon name="lucide:x" class="w-3 h-3 text-red-400" />
              Mots de passe limités à 15
            </li>
            <li class="flex items-center gap-2">
              <Icon name="lucide:x" class="w-3 h-3 text-red-400" />
              Crypto limité à 15
            </li>
          </ul>
        </div>

        <div class="p-4 rounded-lg bg-accent-900/20 border border-accent-600/30">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="font-semibold text-white">Premium</p>
              <p class="text-sm text-surface-400">Tout illimité</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-white">2,99 €</p>
              <p class="text-xs text-surface-500">/mois</p>
            </div>
          </div>
          <ul class="text-sm text-surface-400 space-y-1 mb-4">
            <li class="flex items-center gap-2">
              <Icon name="lucide:check" class="w-3 h-3 text-green-400" />
              Tout illimité
            </li>
            <li class="flex items-center gap-2">
              <Icon name="lucide:check" class="w-3 h-3 text-green-400" />
              Paiement Mobile Money (M-Pesa, Orange Money, Airtel)
            </li>
          </ul>

          <div class="space-y-2">
            <button
              @click="initiatePayment('mobile_money_mpesa')"
              :disabled="paymentLoading"
              class="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Icon name="lucide:smartphone" class="w-4 h-4" />
              Payer avec M-Pesa
            </button>
            <button
              @click="initiatePayment('mobile_money_franco')"
              :disabled="paymentLoading"
              class="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Icon name="lucide:smartphone" class="w-4 h-4" />
              Payer avec Orange/Airtel Money
            </button>
          </div>

          <p v-if="paymentError" class="text-sm text-red-400 mt-2">{{ paymentError }}</p>
        </div>
      </div>
    </section>

    <!-- Security section -->
    <section class="card space-y-4">
      <h2 class="text-lg font-semibold text-white flex items-center gap-2">
        <Icon name="lucide:shield" class="w-5 h-5 text-surface-400" />
        Sécurité
      </h2>
      <div class="p-4 rounded-lg bg-surface-800 border border-surface-700">
        <p class="text-sm text-surface-400 leading-relaxed">
          Kipit utilise un chiffrement <strong class="text-surface-200">AES-256-GCM</strong> côté client.
          Vos données chiffrées ne sont jamais lisibles par nos serveurs. 
          Assurez-vous de ne jamais oublier votre mot de passe maître — il est impossible de récupérer des données chiffrées sans lui.
        </p>
      </div>
    </section>

    <!-- Danger zone -->
    <section class="card border-red-500/20 space-y-4">
      <h2 class="text-lg font-semibold text-red-400 flex items-center gap-2">
        <Icon name="lucide:alert-triangle" class="w-5 h-5" />
        Zone dangereuse
      </h2>
      <button @click="handleSignOut" class="btn-danger flex items-center gap-2">
        <Icon name="lucide:log-out" class="w-4 h-4" />
        Se déconnecter
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const { user, isPremium, signOut } = useAuthClient()

const paymentLoading = ref(false)
const paymentError = ref('')

function formatDate(date: string | undefined) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

async function initiatePayment(method: string) {
  paymentLoading.value = true
  paymentError.value = ''

  try {
    const response = await $fetch<{ payment_link: string }>('/api/payment/initiate', {
      method: 'POST',
      body: { payment_method: method },
    })

    if (response.payment_link) {
      window.location.href = response.payment_link
    } else {
      paymentError.value = 'Impossible de créer le lien de paiement.'
    }
  } catch (err: any) {
    paymentError.value = err.data?.message || 'Erreur lors de l\'initiation du paiement.'
  } finally {
    paymentLoading.value = false
  }
}

function handleSignOut() {
  signOut()
}
</script>
