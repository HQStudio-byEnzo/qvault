<template>
  <div class="dashboard-shell relative flex">
    <aside class="app-sidebar">
      <div class="app-sidebar__brand">
        <NuxtLink to="/" class="tech-brand" aria-label="Back to landing page">
          <UiBitLockLogo :size="30" />
          <span>BitLock</span>
          <small>vault / 01</small>
        </NuxtLink>
      </div>

      <div class="app-sidebar__context">
        <strong>online workspace</strong>
        <small>{{ t('dash.overview') }}</small>
      </div>

      <nav class="app-nav" aria-label="Dashboard navigation">
        <section v-for="group in navGroups" :key="group.label" class="app-nav__group">
          <p class="app-nav__label">{{ t(group.label) }}</p>
          <NuxtLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="app-nav__link"
            :aria-current="isActive(item.to) ? 'page' : undefined"
          >
            <Icon :name="item.icon" class="h-[18px] w-[18px]" />
            <span>{{ t(item.label) }}</span>
          </NuxtLink>
        </section>
      </nav>

      <div class="app-sidebar__user">
        <span class="app-user-mark">{{ user?.username?.charAt(0)?.toUpperCase() || '?' }}</span>
        <span class="min-w-0">
          <strong>@{{ user?.username }}</strong>
          <small>{{ t('nav.localAccount') }}</small>
        </span>
        <button type="button" class="icon-button" :aria-label="t('nav.signout')" @click="signOut">
          <Icon name="lucide:log-out" class="h-4 w-4" />
        </button>
      </div>
    </aside>

    <div class="app-column">
      <header class="app-mobile-bar">
        <div class="app-mobile-bar__brand">
          <button type="button" class="icon-button" aria-label="Open navigation" @click="mobileMenuOpen = true">
            <Icon name="lucide:menu" class="h-5 w-5" />
          </button>
          <NuxtLink to="/" class="tech-brand" aria-label="Back to landing page">
            <UiBitLockLogo :size="26" />
            <span>BitLock</span>
          </NuxtLink>
        </div>
        <button type="button" class="icon-button" :aria-label="t('nav.signout')" @click="signOut">
          <Icon name="lucide:log-out" class="h-4 w-4" />
        </button>
      </header>

      <Teleport to="body">
        <Transition name="fade">
          <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Dashboard navigation">
            <button class="modal-backdrop absolute inset-0 w-full" aria-label="Close navigation" @click="mobileMenuOpen = false" />
            <aside class="app-mobile-sheet">
              <div class="app-mobile-sheet__head">
                <span class="tech-status">online workspace</span>
                <button type="button" class="icon-button" aria-label="Close navigation" @click="mobileMenuOpen = false">
                  <Icon name="lucide:x" class="h-5 w-5" />
                </button>
              </div>
              <nav aria-label="Mobile dashboard navigation">
                <section v-for="group in navGroups" :key="group.label" class="app-nav__group">
                  <p class="app-nav__label">{{ t(group.label) }}</p>
                  <NuxtLink
                    v-for="item in group.items"
                    :key="item.to"
                    :to="item.to"
                    class="app-nav__link"
                    :aria-current="isActive(item.to) ? 'page' : undefined"
                    @click="mobileMenuOpen = false"
                  >
                    <Icon :name="item.icon" class="h-[18px] w-[18px]" />
                    <span>{{ t(item.label) }}</span>
                  </NuxtLink>
                </section>
              </nav>
            </aside>
          </div>
        </Transition>
      </Teleport>

      <main class="app-main">
        <slot />
      </main>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <aside v-if="showWarning" class="app-toast" role="status">
          <div class="flex items-start gap-3">
            <Icon name="lucide:alert-triangle" class="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <strong class="block text-sm">{{ t('autolock.title') }}</strong>
              <p class="mt-1 text-xs text-surface-300">
                {{ t('autolock.desc').replace('{seconds}', String(remainingSeconds)) }}
              </p>
              <button type="button" class="btn-secondary mt-3 min-h-0 py-2" @click="resetTimers">
                {{ t('autolock.stay') }}
              </button>
            </div>
          </div>
        </aside>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <button v-if="shielded" type="button" class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface-950 text-center" @click="reveal">
          <UiBitLockLogo :size="58" />
          <strong class="mt-5 text-xl text-surface-50">{{ t('privacy.title') }}</strong>
          <span class="mt-2 text-sm text-surface-400">{{ t('privacy.reveal') }}</span>
        </button>
      </Transition>
    </Teleport>

    <LegalTermsAcceptanceModal />
    <SecurityMasterPasswordOnboarding />
  </div>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'

const { user, signOut } = useAuthClient()
const { t } = useLang()
useAppShortcuts()
const route = useRoute()
const mobileMenuOpen = ref(false)
const { showWarning, remainingSeconds, resetTimers } = useAutoLock()
const { shielded, reveal } = usePrivacyShield()

const mainNavItems = [
  { to: '/dashboard', label: 'sidebar.dashboard', icon: 'lucide:layout-dashboard' },
  { to: '/dashboard/vault', label: 'sidebar.vault', icon: 'lucide:vault' },
  { to: '/dashboard/links', label: 'sidebar.links', icon: 'lucide:link' },
  { to: '/dashboard/passwords', label: 'sidebar.passwords', icon: 'lucide:key-round' },
  { to: '/dashboard/notes', label: 'sidebar.notes', icon: 'lucide:notebook-tabs' },
  { to: '/dashboard/totp', label: 'sidebar.totp', icon: 'lucide:timer-reset' },
]

const toolNavItems = [
  { to: '/dashboard/password-generator', label: 'sidebar.passwordGenerator', icon: 'lucide:wand-sparkles' },
  { to: '/dashboard/seed-generator', label: 'sidebar.seedGenerator', icon: 'lucide:scroll-text' },
  { to: '/dashboard/audit', label: 'sidebar.audit', icon: 'lucide:shield-alert' },
]

const securityNavItems = [
  { to: '/dashboard/crypto', label: 'sidebar.crypto', icon: 'lucide:bitcoin' },
  { to: '/dashboard/recovery-codes', label: 'sidebar.recoveryCode', icon: 'lucide:ticket-check' },
  { to: '/dashboard/export', label: 'sidebar.export', icon: 'lucide:download' },
  { to: '/dashboard/organization', label: 'sidebar.organization', icon: 'lucide:folder-tree' },
  { to: '/dashboard/history', label: 'sidebar.history', icon: 'lucide:history' },
  { to: '/dashboard/transfer', label: 'sidebar.transfer', icon: 'lucide:scan-line' },
]

const settingsNavItems = [
  { to: '/support', label: 'sidebar.support', icon: 'lucide:heart-handshake' },
  { to: '/dashboard/settings', label: 'sidebar.settings', icon: 'lucide:settings' },
]

const navGroups = [
  { label: 'sidebar.groupMain', items: mainNavItems },
  { label: 'sidebar.groupTools', items: toolNavItems },
  { label: 'sidebar.groupSecurity', items: securityNavItems },
  { label: 'sidebar.settings', items: settingsNavItems },
]

function isActive(path: string) {
  if (path === '/dashboard') return route.path === path
  return route.path === path || route.path.startsWith(`${path}/`)
}

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>
