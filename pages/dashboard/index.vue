<template>
  <div class="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
    <!-- Welcome -->
    <div>
      <h1 class="text-2xl font-bold text-white">{{ t('dash.title') }}</h1>
      <p class="text-surface-400 mt-1">{{ t('dash.welcome') }}, {{ user?.name }}. {{ t('dash.overview') }}</p>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:link" class="w-5 h-5 text-blue-400" />
          <span class="text-xs text-surface-500">{{ t('dash.unlimited') }}</span>
        </div>
        <p class="text-2xl font-bold text-white">{{ stats?.counts.links || 0 }}</p>
        <p class="text-sm text-surface-400">{{ t('dash.links') }}</p>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:key-round" class="w-5 h-5 text-amber-400" />
          <span class="text-xs text-surface-500">{{ t('dash.unlimited') }}</span>
        </div>
        <p class="text-2xl font-bold text-white">{{ stats?.counts.passwords || 0 }}</p>
        <p class="text-sm text-surface-400">{{ t('dash.passwords') }}</p>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:bitcoin" class="w-5 h-5 text-orange-400" />
          <span class="text-xs text-surface-500">{{ t('dash.unlimited') }}</span>
        </div>
        <p class="text-2xl font-bold text-white">{{ stats?.counts.crypto || 0 }}</p>
        <p class="text-sm text-surface-400">{{ t('dash.crypto') }}</p>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:star" class="w-5 h-5 text-yellow-400" />
        </div>
        <p class="text-2xl font-bold text-white">{{ stats?.counts.favorites || 0 }}</p>
        <p class="text-sm text-surface-400">{{ t('dash.favorites') }}</p>
      </div>
    </div>

    <!-- Quick actions -->
    <div>
      <h2 class="text-lg font-semibold text-white mb-4">{{ t('dash.quick') }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <NuxtLink to="/dashboard/links" class="card-hover flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Icon name="lucide:plus" class="w-5 h-5 text-blue-400" />
          </div>
          <span class="text-sm font-medium text-surface-200">{{ t('dash.addLink') }}</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/passwords" class="card-hover flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Icon name="lucide:plus" class="w-5 h-5 text-amber-400" />
          </div>
          <span class="text-sm font-medium text-surface-200">{{ t('dash.addPassword') }}</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/crypto" class="card-hover flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Icon name="lucide:plus" class="w-5 h-5 text-orange-400" />
          </div>
          <span class="text-sm font-medium text-surface-200">{{ t('dash.addCrypto') }}</span>
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
const { t } = useLang()
const { stats, fetchStats } = useVault()

onMounted(() => {
  fetchStats()
})
</script>
