<template>
  <div class="min-h-screen bg-surface-950 flex">
    <!-- Sidebar -->
    <aside class="hidden lg:flex w-64 flex-col border-r border-surface-800 bg-surface-950">
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-surface-800">
        <NuxtLink to="/dashboard" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">
            <Icon name="lucide:shield" class="w-5 h-5 text-white" />
          </div>
          <span class="text-lg font-semibold text-white">Kipit</span>
        </NuxtLink>
      </div>

      <!-- Navigation -->
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

      <!-- User info -->
      <div class="p-4 border-t border-surface-800">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center">
            <span class="text-sm font-medium text-surface-300">
              {{ user?.name?.charAt(0)?.toUpperCase() || '?' }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-surface-200 truncate">{{ user?.name }}</p>
            <p class="text-xs text-surface-500 truncate">
              {{ isPremium ? 'Premium' : 'Free' }}
            </p>
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

      <!-- Mobile menu overlay -->
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

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, isPremium, signOut } = useAuthClient()
const mobileMenuOpen = ref(false)

const navItems = [
  { to: '/dashboard', label: 'Tableau de bord', icon: 'lucide:layout-dashboard' },
  { to: '/dashboard/vault', label: 'Coffre-fort', icon: 'lucide:vault' },
  { to: '/dashboard/links', label: 'Liens', icon: 'lucide:link' },
  { to: '/dashboard/passwords', label: 'Mots de passe', icon: 'lucide:key-round' },
  { to: '/dashboard/crypto', label: 'Crypto', icon: 'lucide:bitcoin' },
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
