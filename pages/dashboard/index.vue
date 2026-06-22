<template>
  <div class="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
    <section class="hero-panel overflow-hidden relative">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-20 right-0 h-56 w-56 rounded-full bg-emerald-500/10 blur-[90px]"></div>
        <div class="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-accent-500/10 blur-[100px]"></div>
      </div>

      <div class="relative grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
        <div class="space-y-6">
          <div class="flex flex-wrap items-center gap-3">
            <span class="eyebrow">{{ t('dash.title') }}</span>
            <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {{ t('security.badge') }}
            </span>
          </div>

          <div class="space-y-3">
            <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {{ t('dash.welcome') }}, {{ user?.name || 'there' }}.
            </h1>
            <p class="text-surface-300 text-base md:text-lg max-w-2xl leading-relaxed">
              {{ t('dash.overview') }} {{ t('dash.healthDesc') }}
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <NuxtLink to="/dashboard/vault" class="btn-primary inline-flex items-center gap-2">
              <Icon name="lucide:vault" class="w-4 h-4" />
              {{ t('dash.openVault') }}
            </NuxtLink>
            <NuxtLink to="/dashboard/audit" class="btn-secondary inline-flex items-center gap-2">
              <Icon name="lucide:shield-alert" class="w-4 h-4" />
              {{ t('dash.runAudit') }}
            </NuxtLink>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="metric-tile">
              <p class="text-xs uppercase tracking-[0.16em] text-surface-500">{{ t('dash.links') }}</p>
              <p class="mt-2 text-2xl font-semibold text-white">{{ stats?.counts.links || 0 }}</p>
            </div>
            <div class="metric-tile">
              <p class="text-xs uppercase tracking-[0.16em] text-surface-500">{{ t('dash.passwords') }}</p>
              <p class="mt-2 text-2xl font-semibold text-white">{{ stats?.counts.passwords || 0 }}</p>
            </div>
            <div class="metric-tile">
              <p class="text-xs uppercase tracking-[0.16em] text-surface-500">{{ t('dash.crypto') }}</p>
              <p class="mt-2 text-2xl font-semibold text-white">{{ stats?.counts.crypto || 0 }}</p>
            </div>
            <div class="metric-tile">
              <p class="text-xs uppercase tracking-[0.16em] text-surface-500">{{ t('security.badge') }}</p>
              <p class="mt-2 text-2xl font-semibold text-white">{{ encryptedItems + unencryptedItems }}</p>
            </div>
          </div>

        </div>

        <div class="flex flex-col gap-4 min-h-full">
          <div class="glass-panel p-6 h-full">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-xs uppercase tracking-[0.16em] text-surface-500">{{ t('dash.healthTitle') }}</p>
                <p class="mt-1 text-sm text-surface-300">{{ t('dash.healthDesc') }}</p>
              </div>
              <div class="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Icon name="lucide:shield" class="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            <div class="mt-5 space-y-3">
              <div class="flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3">
                <span class="text-sm text-surface-300">{{ t('dash.healthEncrypted') }}</span>
                <span class="text-sm font-semibold text-white">{{ encryptedItems }}</span>
              </div>
              <div class="flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3">
                <span class="text-sm text-surface-300">{{ t('dash.healthUnencrypted') }}</span>
                <span class="text-sm font-semibold text-white">{{ unencryptedItems }}</span>
              </div>
              <div class="flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3">
                <span class="text-sm text-surface-300">{{ t('sidebar.audit') }}</span>
                <span class="text-sm font-semibold text-white">{{ t('audit.ready') }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="glass-panel p-5 md:p-6 mt-6 md:mt-8">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.16em] text-surface-500">{{ t('dash.quick') }}</p>
            <p class="mt-1 text-sm text-surface-400">{{ t('dash.overview') }}</p>
          </div>
          <NuxtLink to="/dashboard/vault" class="hidden sm:inline-flex btn-secondary text-sm px-3 py-2">
            {{ t('dash.openVault') }}
          </NuxtLink>
        </div>

        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 auto-rows-fr">
          <NuxtLink to="/dashboard/links" class="feature-tile flex items-center gap-3 min-h-[96px] h-full">
            <div class="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Icon name="lucide:link" class="w-5 h-5 text-blue-300" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-white">{{ t('dash.addLink') }}</p>
              <p class="text-xs text-surface-500">{{ t('sidebar.links') }}</p>
            </div>
          </NuxtLink>
          <NuxtLink to="/dashboard/passwords" class="feature-tile flex items-center gap-3 min-h-[96px] h-full">
            <div class="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Icon name="lucide:key-round" class="w-5 h-5 text-amber-300" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-white">{{ t('dash.addPassword') }}</p>
              <p class="text-xs text-surface-500">{{ t('sidebar.passwords') }}</p>
            </div>
          </NuxtLink>
          <NuxtLink to="/dashboard/password-generator" class="feature-tile flex items-center gap-3 min-h-[96px] h-full">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Icon name="lucide:wand-sparkles" class="w-5 h-5 text-emerald-300" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-white">{{ t('sidebar.passwordGenerator') }}</p>
              <p class="text-xs text-surface-500">{{ t('dashboardGenerator.saveDesc') }}</p>
            </div>
          </NuxtLink>
          <NuxtLink to="/dashboard/crypto" class="feature-tile flex items-center gap-3 min-h-[96px] h-full">
            <div class="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Icon name="lucide:bitcoin" class="w-5 h-5 text-orange-300" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-white">{{ t('dash.addCrypto') }}</p>
              <p class="text-xs text-surface-500">{{ t('sidebar.crypto') }}</p>
            </div>
          </NuxtLink>
          <NuxtLink to="/dashboard/audit" class="feature-tile flex items-center gap-3 min-h-[96px] h-full">
            <div class="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <Icon name="lucide:shield-alert" class="w-5 h-5 text-rose-300" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-white">{{ t('sidebar.audit') }}</p>
              <p class="text-xs text-surface-500">{{ t('audit.notice') }}</p>
            </div>
          </NuxtLink>
          <NuxtLink to="/dashboard/seed-generator" class="feature-tile flex items-center gap-3 min-h-[96px] h-full">
            <div class="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Icon name="lucide:hash" class="w-5 h-5 text-violet-300" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-white">{{ t('sidebar.seedGenerator') }}</p>
              <p class="text-xs text-surface-500">{{ t('seedGenerator.saveDesc') }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:star" class="w-5 h-5 text-yellow-400" />
          <span class="text-xs text-surface-500">{{ t('dash.favorites') }}</span>
        </div>
        <p class="text-3xl font-semibold text-white">{{ stats?.counts.favorites || 0 }}</p>
        <p class="text-sm text-surface-400 mt-1">{{ t('dash.favorites') }}</p>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:shield-check" class="w-5 h-5 text-emerald-400" />
          <span class="text-xs text-surface-500">{{ t('security.badge') }}</span>
        </div>
        <p class="text-3xl font-semibold text-white">{{ totalItems }}</p>
        <p class="text-sm text-surface-400 mt-1">{{ t('dash.overview') }}</p>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <Icon name="lucide:shield-alert" class="w-5 h-5 text-rose-400" />
          <span class="text-xs text-surface-500">{{ t('sidebar.audit') }}</span>
        </div>
        <p class="text-3xl font-semibold text-white">{{ t('audit.ready') }}</p>
        <p class="text-sm text-surface-400 mt-1">{{ t('audit.notice') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { user } = useAuthClient()
const { t } = useLang()
const { items, stats, fetchItems, fetchStats } = useVault()

const totalItems = computed(() => stats.value?.counts.total || items.value.length || 0)
const encryptedItems = computed(() => items.value.filter(item => item.is_encrypted).length)
const unencryptedItems = computed(() => items.value.filter(item => !item.is_encrypted).length)

onMounted(() => {
  fetchItems()
  fetchStats()
})
</script>
