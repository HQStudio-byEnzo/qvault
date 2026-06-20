<template>
  <div class="dashboard-shell relative overflow-hidden flex">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-accent-600/10 blur-[120px]"></div>
      <div class="absolute top-1/3 right-[-120px] h-96 w-96 rounded-full bg-emerald-500/10 blur-[140px]"></div>
    </div>

    <!-- Sidebar -->
    <aside class="hidden lg:flex w-72 flex-col border-r border-white/10 bg-surface-950/80 backdrop-blur-xl relative z-10">
      <div class="h-20 flex items-center px-6 border-b border-white/10">
        <NuxtLink to="/dashboard" class="flex items-center gap-3 group">
          <span class="text-xl font-bold tracking-tight text-white">BitLock</span>
        </NuxtLink>
      </div>

      <div class="px-6 pt-6">
        <div class="glass-panel px-4 py-3">
          <p class="text-[11px] uppercase tracking-[0.2em] text-surface-500">{{ t('sidebar.groupMain') }}</p>
          <p class="mt-1 text-sm text-surface-300 leading-snug">{{ t('dash.overview') }}</p>
        </div>
      </div>

      <nav class="flex-1 px-4 py-5 space-y-6">
        <div class="space-y-2">
          <NuxtLink
            v-for="item in mainNavItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all border"
            :class="isActive(item.to)
            ? 'bg-white/[0.08] border-white/10 text-white shadow-lg shadow-black/10'
              : 'border-transparent text-surface-400 hover:text-surface-100 hover:bg-white/[0.04] hover:border-white/10'"
          >
            <Icon :name="item.icon" class="w-5 h-5" />
            <span>{{ t(item.label) }}</span>
          </NuxtLink>
        </div>

        <div class="space-y-2">
          <p class="px-4 text-[11px] uppercase tracking-[0.2em] text-surface-500">{{ t('sidebar.groupSecurity') }}</p>
          <NuxtLink
            v-for="item in securityNavItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all border"
            :class="isActive(item.to)
            ? 'bg-white/[0.08] border-white/10 text-white shadow-lg shadow-black/10'
              : 'border-transparent text-surface-400 hover:text-surface-100 hover:bg-white/[0.04] hover:border-white/10'"
          >
            <Icon :name="item.icon" class="w-5 h-5" />
            <span>{{ t(item.label) }}</span>
          </NuxtLink>
        </div>
      </nav>

      <div class="p-4 border-t border-white/10">
        <div class="glass-panel p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-surface-700 to-surface-600 flex items-center justify-center">
            <span class="text-sm font-medium text-white">
              {{ user?.name?.charAt(0)?.toUpperCase() || '?' }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ user?.name }}</p>
            <p class="text-xs text-surface-500 truncate">{{ user?.email }}</p>
          </div>
          <button @click="signOut" class="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-surface-300 hover:text-white transition-colors border border-white/10">
            <Icon name="lucide:log-out" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile header -->
    <div class="flex-1 flex flex-col relative z-10">
      <header class="lg:hidden h-16 flex items-center justify-between px-4 border-b border-white/10 bg-surface-950/85 backdrop-blur-xl">
        <div class="flex items-center gap-3">
          <button @click="mobileMenuOpen = true" class="p-2 rounded-xl hover:bg-white/5 text-surface-300 border border-transparent hover:border-white/10 transition-colors">
            <Icon name="lucide:menu" class="w-5 h-5" />
          </button>
          <span class="text-lg font-bold tracking-tight text-white">BitLock</span>
        </div>
        <button @click="signOut" class="p-2 rounded-xl hover:bg-white/5 text-surface-300 border border-transparent hover:border-white/10 transition-colors">
          <Icon name="lucide:log-out" class="w-5 h-5" />
        </button>
      </header>

      <!-- Mobile menu -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 lg:hidden">
            <div class="absolute inset-0 bg-black/60" @click="mobileMenuOpen = false"></div>
            <div class="absolute left-0 top-0 bottom-0 w-72 bg-surface-950/95 border-r border-white/10 p-4 backdrop-blur-xl">
              <div class="glass-panel p-4 mb-4">
                <p class="text-[11px] uppercase tracking-[0.2em] text-surface-500">{{ t('sidebar.groupMain') }}</p>
                <p class="mt-1 text-sm text-surface-300">{{ t('dash.overview') }}</p>
              </div>
              <nav class="space-y-2">
                <NuxtLink
                  v-for="item in mainNavItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-surface-300 hover:text-white hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/10"
                  @click="mobileMenuOpen = false"
                >
                  <Icon :name="item.icon" class="w-5 h-5" />
                  <span>{{ t(item.label) }}</span>
                </NuxtLink>
                <div class="pt-3">
                  <p class="px-1 pb-2 text-[11px] uppercase tracking-[0.2em] text-surface-500">{{ t('sidebar.groupSecurity') }}</p>
                  <NuxtLink
                    v-for="item in securityNavItems"
                    :key="item.to"
                    :to="item.to"
                    class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-surface-300 hover:text-white hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/10"
                    @click="mobileMenuOpen = false"
                  >
                    <Icon :name="item.icon" class="w-5 h-5" />
                    <span>{{ t(item.label) }}</span>
                  </NuxtLink>
                </div>
              </nav>
            </div>
          </div>
        </Transition>
      </Teleport>

      <main class="flex-1 overflow-y-auto relative">
        <slot />
      </main>
    </div>

    <!-- Auto-lock warning toast -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showWarning"
          class="fixed bottom-6 right-6 z-[60] max-w-sm bg-yellow-900/90 border border-yellow-600/50 rounded-xl p-4 shadow-2xl backdrop-blur-sm"
        >
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-yellow-600/20 flex items-center justify-center flex-shrink-0">
              <Icon name="lucide:timer" class="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-yellow-200">{{ t('autolock.title') }}</p>
              <p class="text-xs text-yellow-400 mt-1">
                {{ t('autolock.desc').replace('{seconds}', String(remainingSeconds)) }}
              </p>
              <button
                @click="resetTimers"
                class="mt-2 text-xs px-3 py-1.5 rounded-lg bg-yellow-600/30 text-yellow-200 hover:bg-yellow-600/50 transition-colors"
              >
                {{ t('autolock.stay') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <LegalTermsAcceptanceModal />
    <SecurityMasterPasswordOnboarding />
  </div>
</template>

<script setup lang="ts">
const { user, signOut } = useAuthClient()
const { t } = useLang()
const route = useRoute()
const mobileMenuOpen = ref(false)
const { showWarning, remainingSeconds, resetTimers } = useAutoLock()

const mainNavItems = [
  { to: '/dashboard', label: 'sidebar.dashboard', icon: 'lucide:layout-dashboard' },
  { to: '/dashboard/vault', label: 'sidebar.vault', icon: 'lucide:vault' },
  { to: '/dashboard/password-generator', label: 'sidebar.passwordGenerator', icon: 'lucide:wand-sparkles' },
  { to: '/dashboard/links', label: 'sidebar.links', icon: 'lucide:link' },
  { to: '/dashboard/passwords', label: 'sidebar.passwords', icon: 'lucide:key-round' },
]

const securityNavItems = [
  { to: '/dashboard/crypto', label: 'sidebar.crypto', icon: 'lucide:bitcoin' },
  { to: '/dashboard/seed-generator', label: 'sidebar.seedGenerator', icon: 'lucide:hash' },
  { to: '/dashboard/recovery-codes', label: 'sidebar.recoveryCode', icon: 'lucide:ticket-check' },
  { to: '/dashboard/audit', label: 'sidebar.audit', icon: 'lucide:shield-alert' },
  { to: '/dashboard/export', label: 'sidebar.export', icon: 'lucide:download' },
  { to: '/dashboard/settings', label: 'sidebar.settings', icon: 'lucide:settings' },
]

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
