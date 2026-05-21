<template>
  <div class="p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-white">Paramètres</h1>
      <p class="text-surface-400 text-sm mt-1">Gérez votre compte</p>
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

const { user, signOut } = useAuthClient()

function formatDate(date: string | undefined) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function handleSignOut() {
  signOut()
}
</script>
