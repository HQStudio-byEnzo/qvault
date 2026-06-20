<template>
  <div class="min-h-screen flex flex-col bg-surface-950 overflow-hidden scroll-smooth">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 h-[4.5rem] md:h-20 flex items-center justify-between gap-4 px-5 sm:px-6 lg:px-12 backdrop-blur-xl bg-surface-950/90 border-b border-surface-800/60">
      <NuxtLink to="/" class="group inline-flex items-center gap-3 shrink-0 min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 shadow-[0_18px_50px_-26px_rgba(0,0,0,0.75)]">
        <BitLockLogo :size="46" show-wordmark tagline="Security vault" />
      </NuxtLink>

      <!-- Desktop navigation -->
      <div class="hidden lg:flex items-center gap-2">
        <div class="relative group">
          <NuxtLink
            to="/features"
            class="px-3 py-1.5 rounded-full text-sm font-medium text-surface-400 hover:text-white hover:bg-surface-800/60 transition-all inline-flex items-center gap-1.5"
          >
            {{ t('nav.features') }}
            <Icon name="lucide:chevron-down" class="w-4 h-4" />
          </NuxtLink>
          <div class="absolute left-0 top-full pt-3 w-[340px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
            <div class="rounded-2xl border border-surface-700 bg-surface-900/95 shadow-2xl overflow-hidden">
              <div class="p-3">
                <NuxtLink
                  v-for="feature in features"
                  :key="feature.slug"
                  :to="`/features/${feature.slug}`"
                  class="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-surface-800 transition-colors"
                >
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="feature.badgeClass">
                    <Icon :name="feature.icon" class="w-4 h-4" :class="feature.iconClass" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-white">{{ feature.title }}</p>
                    <p class="text-xs text-surface-400 truncate">{{ feature.summary }}</p>
                  </div>
                </NuxtLink>
              </div>
              <div class="border-t border-surface-800 p-3 flex items-center gap-2">
                <NuxtLink to="/generateur-mot-de-passe" class="btn-secondary flex-1 text-center text-sm">{{ t('hero.passwordGenerator') }}</NuxtLink>
                <NuxtLink to="/changelog" class="btn-secondary text-sm">{{ t('nav.changelog') }}</NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <a
          v-for="link in navLinks"
          :key="link.id"
          :href="'#' + link.id"
          class="px-3 py-1.5 rounded-full text-sm font-medium text-surface-400 hover:text-white hover:bg-surface-800/60 transition-all"
        >
          {{ t(link.label) }}
        </a>
        <NuxtLink to="/changelog" class="px-3 py-1.5 rounded-full text-sm font-medium text-surface-400 hover:text-white hover:bg-surface-800/60 transition-all">
          {{ t('nav.changelog') }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <LangSwitch />
        <!-- Show avatar if logged in -->
        <div v-if="loggedIn" class="relative">
          <button @click.stop="showUserMenu = !showUserMenu" class="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center text-sm font-bold text-white hover:ring-2 hover:ring-accent-400 transition-all">
            {{ user?.name?.charAt(0)?.toUpperCase() || '?' }}
          </button>
          <!-- Dropdown -->
          <div v-if="showUserMenu" class="absolute right-0 top-12 w-48 bg-surface-900 border border-surface-700 rounded-xl shadow-2xl py-2 z-50">
            <p class="px-4 py-2 text-xs text-surface-500 truncate">{{ user?.email }}</p>
            <NuxtLink to="/dashboard" class="flex items-center gap-2 px-4 py-2 text-sm text-surface-300 hover:text-white hover:bg-surface-800 transition-colors" @click="showUserMenu = false">
              <Icon name="lucide:layout-dashboard" class="w-4 h-4" />
              {{ t('nav.dashboard') }}
            </NuxtLink>
            <button @click="handleLogout" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-surface-800 transition-colors">
              <Icon name="lucide:log-out" class="w-4 h-4" />
              {{ t('nav.signout') }}
            </button>
          </div>
        </div>
        <!-- Show login/register if not logged in -->
        <template v-else>
          <NuxtLink to="/auth/login" class="hidden sm:inline-flex text-sm text-surface-300 hover:text-white transition-colors px-4 py-2">
            {{ t('nav.login') }}
          </NuxtLink>
          <NuxtLink to="/auth/register" class="btn-primary text-sm">
            {{ t('nav.start') }}
          </NuxtLink>
        </template>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative pt-28 lg:pt-32 pb-20 lg:pb-24">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full bg-accent-600/10 blur-[140px]"></div>
        <div class="absolute bottom-0 left-1/4 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[120px]"></div>
      </div>

      <div class="section-shell max-w-7xl relative">
        <div class="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
          <div class="space-y-8 animate-fade-in">
            <div class="flex flex-wrap items-center gap-3">
              <span class="eyebrow">{{ t('hero.badge') }}</span>
              <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-surface-300">
                <Icon name="lucide:shield-check" class="w-3.5 h-3.5 text-emerald-300" />
                {{ t('trust.zeroKnowledge') }}
              </span>
            </div>

            <div class="space-y-4 max-w-3xl">
              <h1 class="text-5xl md:text-6xl xl:text-7xl font-semibold tracking-tight text-white leading-[0.98]">
                {{ t('hero.title1') }}<br>
                <span class="bg-gradient-to-r from-white via-emerald-200 to-accent-300 bg-clip-text text-transparent">{{ t('hero.title2') }}</span>
              </h1>

              <p class="text-lg md:text-xl text-surface-300 max-w-2xl leading-relaxed">
                {{ t('hero.subtitle') }}
              </p>
            </div>

            <div class="flex flex-col sm:flex-row flex-wrap gap-3">
              <NuxtLink to="/auth/register" class="group btn-primary text-base px-7 py-3.5 inline-flex items-center justify-center gap-2">
                {{ t('hero.cta') }}
                <Icon name="lucide:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
              <NuxtLink to="/generateur-mot-de-passe" class="btn-secondary text-base px-7 py-3.5 inline-flex items-center justify-center">{{ t('hero.passwordGenerator') }}</NuxtLink>
              <NuxtLink to="/auth/login" class="btn-secondary text-base px-7 py-3.5 inline-flex items-center justify-center">
                {{ t('hero.login') }}
              </NuxtLink>
            </div>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div class="metric-tile">
                <p class="text-[11px] uppercase tracking-[0.16em] text-surface-500">{{ t('trust.aes') }}</p>
                <p class="mt-2 text-sm text-white">{{ t('security.aes') }}</p>
              </div>
              <div class="metric-tile">
                <p class="text-[11px] uppercase tracking-[0.16em] text-surface-500">{{ t('nav.features') }}</p>
                <p class="mt-2 text-sm text-white">{{ features.length }} {{ t('featuresIndex.whatYouGet') }}</p>
              </div>
              <div class="metric-tile">
                <p class="text-[11px] uppercase tracking-[0.16em] text-surface-500">{{ t('dash.recovery') }}</p>
                <p class="mt-2 text-sm text-white">{{ t('trust.recoveryCodes') }}</p>
              </div>
              <div class="metric-tile">
                <p class="text-[11px] uppercase tracking-[0.16em] text-surface-500">{{ t('hero.free') }}</p>
                <p class="mt-2 text-sm text-white">{{ t('features.unlimited.title') }}</p>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="hero-panel relative overflow-hidden">
              <div class="absolute inset-0 pointer-events-none">
                <div class="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-[80px]"></div>
              </div>
              <div class="relative space-y-5">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-xs uppercase tracking-[0.18em] text-surface-500">{{ t('dash.title') }}</p>
                    <p class="mt-1 text-sm text-surface-300">{{ t('dash.overview') }}</p>
                  </div>
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-accent-500/20 border border-white/10 flex items-center justify-center">
                    <Icon name="lucide:shield-check" class="w-5 h-5 text-emerald-300" />
                  </div>
                </div>

                <div class="space-y-3">
                  <div
                    v-for="feature in featuredFeatures"
                    :key="feature.slug"
                    class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <div class="w-11 h-11 rounded-2xl flex items-center justify-center border border-white/10" :class="feature.badgeClass">
                      <Icon :name="feature.icon" class="w-5 h-5" :class="feature.iconClass" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-white">{{ feature.title }}</p>
                      <p class="text-xs text-surface-400 truncate">{{ feature.summary }}</p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-3">
                  <div class="metric-tile">
                    <p class="text-xs text-surface-500">{{ t('dash.links') }}</p>
                    <p class="mt-1 text-xl font-semibold text-white">∞</p>
                  </div>
                  <div class="metric-tile">
                    <p class="text-xs text-surface-500">{{ t('dash.passwords') }}</p>
                    <p class="mt-1 text-xl font-semibold text-white">∞</p>
                  </div>
                  <div class="metric-tile">
                    <p class="text-xs text-surface-500">{{ t('dash.crypto') }}</p>
                    <p class="mt-1 text-xl font-semibold text-white">∞</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="px-6 lg:px-12 py-24 border-t border-surface-800/50">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ t('how.title') }}</h2>
          <p class="text-surface-400 max-w-lg mx-auto">{{ t('how.subtitle') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mx-auto">
              <span class="text-xl font-bold text-accent-400">1</span>
            </div>
            <h3 class="text-lg font-semibold text-white">{{ t('how.step1.title') }}</h3>
            <p class="text-sm text-surface-400 leading-relaxed">{{ t('how.step1.desc') }}</p>
          </div>
          <div class="text-center space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mx-auto">
              <span class="text-xl font-bold text-accent-400">2</span>
            </div>
            <h3 class="text-lg font-semibold text-white">{{ t('how.step2.title') }}</h3>
            <p class="text-sm text-surface-400 leading-relaxed">{{ t('how.step2.desc') }}</p>
          </div>
          <div class="text-center space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mx-auto">
              <span class="text-xl font-bold text-accent-400">3</span>
            </div>
            <h3 class="text-lg font-semibold text-white">{{ t('how.step3.title') }}</h3>
            <p class="text-sm text-surface-400 leading-relaxed">{{ t('how.step3.desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Preview -->
    <section id="features" class="px-6 lg:px-12 py-24 border-t border-surface-800/50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <span class="eyebrow mb-3 inline-flex">{{ t('nav.features') }}</span>
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ t('featuresIndex.title') }}</h2>
          <p class="text-surface-400 max-w-2xl mx-auto">{{ t('featuresIndex.subtitle') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <NuxtLink
            v-for="feature in features"
            :key="feature.slug"
            :to="`/features/${feature.slug}`"
            class="group card-hover rounded-[28px] border border-white/10 bg-white/[0.03] p-6 flex flex-col gap-5"
          >
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10" :class="feature.badgeClass">
              <Icon :name="feature.icon" class="w-6 h-6" :class="feature.iconClass" />
            </div>
            <div class="space-y-3">
              <h3 class="text-xl font-semibold text-white">{{ feature.title }}</h3>
              <p class="text-sm text-surface-400 leading-relaxed">{{ feature.summary }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useLang()
const { user, loggedIn, signOut } = useAuthClient()
const showUserMenu = ref(false)

const features = [
  {
    slug: 'links',
    title: t('features.links.title'),
    summary: t('features.links.summary'),
    icon: 'lucide:link',
    badgeClass: 'bg-blue-500/10',
    iconClass: 'text-blue-300',
  },
  {
    slug: 'passwords',
    title: t('features.passwords.title'),
    summary: t('features.passwords.summary'),
    icon: 'lucide:key-round',
    badgeClass: 'bg-amber-500/10',
    iconClass: 'text-amber-300',
  },
  {
    slug: 'crypto',
    title: t('features.crypto.title'),
    summary: t('features.crypto.summary'),
    icon: 'lucide:bitcoin',
    badgeClass: 'bg-orange-500/10',
    iconClass: 'text-orange-300',
  },
  {
    slug: 'recovery-codes',
    title: t('features.recoveryCodes.title'),
    summary: t('features.recoveryCodes.summary'),
    icon: 'lucide:badge-alert',
    badgeClass: 'bg-pink-500/10',
    iconClass: 'text-pink-300',
  },
  {
    slug: 'seed-phrases',
    title: t('features.seedPhrases.title'),
    summary: t('features.seedPhrases.summary'),
    icon: 'lucide:wallet-cards',
    badgeClass: 'bg-purple-500/10',
    iconClass: 'text-purple-300',
  },
  {
    slug: 'audit',
    title: t('features.audit.title'),
    summary: t('features.audit.summary'),
    icon: 'lucide:shield-check',
    badgeClass: 'bg-emerald-500/10',
    iconClass: 'text-emerald-300',
  },
]

const featuredFeatures = computed(() => features.slice(0, 3))

const navLinks = [
  { id: 'features', label: 'nav.features' },
  { id: 'how', label: 'how.title' },
]

async function handleLogout() {
  showUserMenu.value = false
  await signOut()
  navigateTo('/')
}
</script>
