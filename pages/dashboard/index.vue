<template>
  <div class="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
    <!-- Welcome -->
    <div>
      <h1 class="text-2xl font-bold text-white">Tableau de bord</h1>
      <p class="text-surface-400 mt-1">Bienvenue, {{ user?.name }}. Voici un aperçu de votre coffre-fort.</p>
    </div>

    <!-- Premium banner (if not premium) -->
    <div v-if="stats && !stats.isPremium" class="card border-accent-600/30 bg-gradient-to-r from-accent-900/20 to-surface-900">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 class="font-semibold text-white flex items-center gap-2">
            <Icon name="lucide:crown" class="w-5 h-5 text-accent-400" />
            Passez à Premium
          </h3>
          <p class="text-sm text-surface-400 mt-1">
            Stockage illimité pour seulement 2,99$/mois. Payez en crypto (USDT, BTC, ETH).
          </p>
        </div>
        <NuxtLink to="/dashboard/settings" class="btn-primary text-sm whitespace-nowrap">
          Upgrader
        </NuxtLink>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:link" class="w-5 h-5 text-blue-400" />
          <span class="text-xs text-surface-500">Illimité</span>
        </div>
        <p class="text-2xl font-bold text-white">{{ stats?.counts.links || 0 }}</p>
        <p class="text-sm text-surface-400">Liens</p>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:key-round" class="w-5 h-5 text-amber-400" />
          <span v-if="stats?.limits" class="text-xs text-surface-500">
            {{ stats.counts.passwords }}/{{ stats.limits.passwords }}
          </span>
          <span v-else class="text-xs text-accent-400 font-medium">Illimité</span>
        </div>
        <p class="text-2xl font-bold text-white">{{ stats?.counts.passwords || 0 }}</p>
        <p class="text-sm text-surface-400">Mots de passe</p>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:bitcoin" class="w-5 h-5 text-orange-400" />
          <span v-if="stats?.limits" class="text-xs text-surface-500">
            {{ stats.counts.crypto }}/{{ stats.limits.crypto }}
          </span>
          <span v-else class="text-xs text-accent-400 font-medium">Illimité</span>
        </div>
        <p class="text-2xl font-bold text-white">{{ stats?.counts.crypto || 0 }}</p>
        <p class="text-sm text-surface-400">Crypto</p>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:star" class="w-5 h-5 text-yellow-400" />
        </div>
        <p class="text-2xl font-bold text-white">{{ stats?.counts.favorites || 0 }}</p>
        <p class="text-sm text-surface-400">Favoris</p>
      </div>
    </div>

    <!-- Quick actions -->
    <div>
      <h2 class="text-lg font-semibold text-white mb-4">Actions rapides</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <NuxtLink to="/dashboard/links" class="card-hover flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Icon name="lucide:plus" class="w-5 h-5 text-blue-400" />
          </div>
          <span class="text-sm font-medium text-surface-200">Ajouter un lien</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/passwords" class="card-hover flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Icon name="lucide:plus" class="w-5 h-5 text-amber-400" />
          </div>
          <span class="text-sm font-medium text-surface-200">Ajouter un mot de passe</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/crypto" class="card-hover flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Icon name="lucide:plus" class="w-5 h-5 text-orange-400" />
          </div>
          <span class="text-sm font-medium text-surface-200">Ajouter une clé crypto</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { user } = useAuthClient()
const { stats, fetchStats } = useVault()

onMounted(() => {
  fetchStats()
})
</script>
