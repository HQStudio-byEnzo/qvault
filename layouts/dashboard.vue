<template>
  <div class="min-h-screen bg-surface-950 flex">
    <!-- Sidebar -->
    <aside class="hidden lg:flex w-64 flex-col border-r border-surface-800 bg-surface-950">
      <div class="h-16 flex items-center px-6 border-b border-surface-800">
        <NuxtLink to="/dashboard" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">
            <Icon name="lucide:shield" class="w-5 h-5 text-white" />
          </div>
          <span class="text-lg font-semibold text-white">Kipit</span>
        </NuxtLink>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="[
            $route.path === item.to 
              ? 'bg-surface-800 text-white' 
              : 'text-surface-400 hover:text-surface-200 hover:bg-surface-900'
          ]"
        >
          <Icon :name="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-surface-800">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center">
            <span class="text-sm font-medium text-surface-300">
              {{ user?.name?.charAt(0)?.toUpperCase() || '?' }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-surface-200 truncate">{{ user?.name }}</p>
          </div>
          <button @click="signOut" class="p-1.5 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors">
            <Icon name="lucide:log-out" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile header -->
    <div class="flex-1 flex flex-col">
      <header class="lg:hidden h-16 flex items-center justify-between px-4 border-b border-surface-800">
        <div class="flex items-center gap-2">
          <button @click="mobileMenuOpen = true" class="p-2 rounded-lg hover:bg-surface-800 text-surface-400">
            <Icon name="lucide:menu" class="w-5 h-5" />
          </button>
          <div class="w-7 h-7 bg-accent-600 rounded-lg flex items-center justify-center">
            <Icon name="lucide:shield" class="w-4 h-4 text-white" />
          </div>
          <span class="font-semibold text-white">Kipit</span>
        </div>
        <button @click="signOut" class="p-2 rounded-lg hover:bg-surface-800 text-surface-400">
          <Icon name="lucide:log-out" class="w-5 h-5" />
        </button>
      </header>

      <!-- Mobile menu -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 lg:hidden">
            <div class="absolute inset-0 bg-black/60" @click="mobileMenuOpen = false"></div>
            <div class="absolute left-0 top-0 bottom-0 w-64 bg-surface-950 border-r border-surface-800 p-4">
              <nav class="space-y-1">
                <NuxtLink
                  v-for="item in navItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-surface-400 hover:text-surface-200 hover:bg-surface-900 transition-colors"
                  @click="mobileMenuOpen = false"
                >
                  <Icon :name="item.icon" class="w-5 h-5" />
                  <span>{{ item.label }}</span>
                </NuxtLink>
              </nav>
            </div>
          </div>
        </Transition>
      </Teleport>

      <main class="flex-1 overflow-y-auto">
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
              <p class="text-sm font-medium text-yellow-200">Session bientôt expirée</p>
              <p class="text-xs text-yellow-400 mt-1">
                Déconnexion automatique dans {{ remainingSeconds }}s pour des raisons de sécurité.
              </p>
              <button
                @click="resetTimers"
                class="mt-2 text-xs px-3 py-1.5 rounded-lg bg-yellow-600/30 text-yellow-200 hover:bg-yellow-600/50 transition-colors"
              >
                Rester connecté
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { user, signOut } = useAuthClient()
const mobileMenuOpen = ref(false)
const { showWarning, remainingSeconds, resetTimers } = useAutoLock()

const navItems = [
  { to: '/dashboard', label: 'Tableau de bord', icon: 'lucide:layout-dashboard' },
  { to: '/dashboard/vault', label: 'Coffre-fort', icon: 'lucide:vault' },
  { to: '/dashboard/links', label: 'Liens', icon: 'lucide:link' },
  { to: '/dashboard/passwords', label: 'Mots de passe', icon: 'lucide:key-round' },
  { to: '/dashboard/crypto', label: 'Crypto', icon: 'lucide:bitcoin' },
  { to: '/dashboard/audit', label: 'Audit', icon: 'lucide:shield-alert' },
  { to: '/dashboard/export', label: 'Export / Import', icon: 'lucide:download' },
  { to: '/dashboard/settings', label: 'Paramètres', icon: 'lucide:settings' },
]
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
