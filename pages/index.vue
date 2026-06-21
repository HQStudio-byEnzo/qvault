<template>
  <div class="min-h-screen flex flex-col bg-surface-950 overflow-hidden scroll-smooth">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 h-[4.5rem] md:h-20 flex items-center gap-4 px-5 sm:px-6 lg:px-12 backdrop-blur-xl bg-surface-950/92 border-b border-surface-800/70">
      <NuxtLink to="/" class="inline-flex items-center shrink-0 min-w-0 gap-3">
        <div class="w-10 h-10 rounded-xl border border-accent-500/20 bg-accent-600/10 text-accent-400 flex items-center justify-center">
          <AppIcon name="lucide:shield" class="w-5 h-5" />
        </div>
        <span class="text-2xl font-bold tracking-tight text-white">BitLock</span>
      </NuxtLink>

      <!-- Desktop navigation -->
      <div class="hidden lg:flex flex-1 items-center justify-center px-8">
        <div class="flex items-center gap-8">
        <div class="relative group">
          <NuxtLink
            to="/features"
            class="nav-link"
          >
            {{ t('nav.features') }}
            <AppIcon name="lucide:chevron-down" class="w-4 h-4" />
          </NuxtLink>
          <div class="absolute left-0 top-full pt-3 w-[340px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
            <div class="rounded-2xl border border-surface-800 bg-surface-900/95 shadow-2xl overflow-hidden">
              <div class="p-3">
                <NuxtLink
                  v-for="feature in features"
                  :key="feature.slug"
                  :to="`/features/${feature.slug}`"
                  class="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-surface-800 transition-colors"
                >
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="feature.badgeClass">
                    <AppIcon :name="feature.icon" class="w-4 h-4" :class="feature.iconClass" />
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
          class="nav-link"
        >
          {{ t(link.label) }}
        </a>
        <NuxtLink to="/changelog" class="nav-link">
          {{ t('nav.changelog') }}
        </NuxtLink>
      </div>
      </div>

      <div class="ml-auto flex items-center gap-3 shrink-0">
        <LangSwitch />
        <!-- Show avatar if logged in -->
        <div v-if="loggedIn" class="relative">
          <button @click.stop="showUserMenu = !showUserMenu" class="w-9 h-9 rounded-full bg-accent-600 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_20px_rgba(79,70,229,0.25)] hover:bg-accent-500 transition-all">
            {{ user?.name?.charAt(0)?.toUpperCase() || '?' }}
          </button>
          <!-- Dropdown -->
          <div v-if="showUserMenu" class="absolute right-0 top-12 w-48 bg-surface-900 border border-surface-700 rounded-xl shadow-2xl py-2 z-50">
            <p class="px-4 py-2 text-xs text-surface-500 truncate">{{ user?.email }}</p>
            <NuxtLink to="/dashboard" class="flex items-center gap-2 px-4 py-2 text-sm text-surface-300 hover:text-white hover:bg-surface-800 transition-colors" @click="showUserMenu = false">
              <AppIcon name="lucide:layout-dashboard" class="w-4 h-4" />
              {{ t('nav.dashboard') }}
            </NuxtLink>
            <button @click="handleLogout" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-surface-800 transition-colors">
              <AppIcon name="lucide:log-out" class="w-4 h-4" />
              {{ t('nav.signout') }}
            </button>
          </div>
        </div>
        <!-- Show login/register if not logged in -->
        <template v-else>
          <NuxtLink to="/auth/login" class="hidden sm:inline-flex btn-secondary text-sm">
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
        <div class="absolute bottom-0 left-1/4 h-[420px] w-[420px] rounded-full bg-surface-800/40 blur-[120px]"></div>
      </div>

      <div class="section-shell max-w-7xl relative">
        <div class="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div class="space-y-8 animate-fade-in">
            <div class="flex flex-wrap items-center gap-3">
              <span class="eyebrow">{{ t('hero.badge') }}</span>
              <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                <AppIcon name="lucide:shield-check" class="w-3.5 h-3.5 text-emerald-300" />
                {{ t('trust.zeroKnowledge') }}
              </span>
            </div>

            <div class="space-y-4 max-w-3xl">
              <h1 class="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.02]">
                {{ t('hero.title1') }}<br>
                <span class="bg-gradient-to-r from-accent-300 to-accent-600 bg-clip-text text-transparent">{{ t('hero.title2') }}</span>
              </h1>

              <p class="text-lg md:text-xl text-surface-300 max-w-2xl leading-relaxed">
                {{ t('hero.subtitle') }}
              </p>
            </div>

            <div class="flex flex-col sm:flex-row flex-wrap gap-3">
              <NuxtLink to="/auth/register" class="group btn-primary text-base px-7 py-3.5 inline-flex items-center justify-center gap-2">
                {{ t('hero.cta') }}
                <AppIcon name="lucide:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
            <div class="hero-panel relative overflow-hidden rounded-[2rem]">
              <div class="absolute inset-0 pointer-events-none">
                <div class="absolute top-0 right-0 h-40 w-40 rounded-full bg-accent-500/10 blur-[80px]"></div>
              </div>
              <div class="relative space-y-5">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-xs uppercase tracking-[0.18em] text-surface-500">{{ t('dash.title') }}</p>
                    <p class="mt-1 text-sm text-surface-300">{{ t('dash.overview') }}</p>
                  </div>
                  <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <AppIcon name="lucide:lock" class="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                <div class="space-y-3">
                  <div
                    v-for="feature in featuredFeatures"
                    :key="feature.slug"
                    class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <div class="w-11 h-11 rounded-2xl flex items-center justify-center border border-white/10" :class="feature.badgeClass">
                      <AppIcon :name="feature.icon" class="w-5 h-5" :class="feature.iconClass" />
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

    <!-- Features -->
    <section id="features" class="px-6 lg:px-12 py-24 bg-surface-900/30 border-t border-surface-800/50 scroll-mt-28">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-semibold text-white mb-4">{{ t('features.title') }}</h2>
          <p class="text-surface-400 max-w-lg mx-auto">{{ t('features.subtitle') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="feature in features"
            :key="feature.slug"
            :to="`/features/${feature.slug}`"
            class="card-hover group block hover:border-surface-700"
          >
            <div class="w-11 h-11 rounded-xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110" :class="feature.badgeClass">
              <AppIcon :name="feature.icon" class="w-5 h-5" :class="feature.iconClass" />
            </div>
            <h3 class="font-semibold text-white mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-surface-400 leading-relaxed">{{ feature.summary }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Security section -->
    <section id="security" class="px-6 lg:px-12 py-24 border-t border-surface-800/50 scroll-mt-28">
      <div class="max-w-4xl mx-auto">
        <div class="card p-8 md:p-12 border-accent-500/20 bg-gradient-to-br from-accent-900/10 to-surface-900">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400 mb-4">
                <AppIcon name="lucide:shield-check" class="w-3 h-3" />
                {{ t('security.badge') }}
              </div>
              <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">{{ t('security.title') }}</h2>
              <p class="text-surface-400 leading-relaxed">
                {{ t('security.desc') }}
              </p>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                <AppIcon name="lucide:check-circle" class="w-5 h-5 text-green-400 flex-shrink-0" />
                <span class="text-sm text-surface-200">{{ t('security.aes') }}</span>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                <AppIcon name="lucide:check-circle" class="w-5 h-5 text-green-400 flex-shrink-0" />
                <span class="text-sm text-surface-200">{{ t('security.pbkdf2') }}</span>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                <AppIcon name="lucide:check-circle" class="w-5 h-5 text-green-400 flex-shrink-0" />
                <span class="text-sm text-surface-200">{{ t('security.client') }}</span>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                <AppIcon name="lucide:check-circle" class="w-5 h-5 text-green-400 flex-shrink-0" />
                <span class="text-sm text-surface-200">{{ t('security.open') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reviews -->
    <section id="reviews" class="px-6 lg:px-12 py-24 border-t border-surface-800/50 scroll-mt-28">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-semibold text-white mb-4">{{ t('reviews.title') }}</h2>
          <p class="text-surface-400 max-w-lg mx-auto">{{ t('reviews.subtitle') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card">
            <div class="flex items-center gap-1 mb-3">
              <span class="text-yellow-400">★★★★★</span>
            </div>
            <p class="text-sm text-surface-300 leading-relaxed mb-4">"{{ t('reviews.review1.text') }}"</p>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">K</div>
              <div>
                <p class="text-xs font-medium text-surface-200">Kevin M.</p>
                <p class="text-xs text-surface-500">{{ t('reviews.review1.role') }}</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center gap-1 mb-3">
              <span class="text-yellow-400">★★★★★</span>
            </div>
            <p class="text-sm text-surface-300 leading-relaxed mb-4">"{{ t('reviews.review2.text') }}"</p>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400">S</div>
              <div>
                <p class="text-xs font-medium text-surface-200">Sarah L.</p>
                <p class="text-xs text-surface-500">{{ t('reviews.review2.role') }}</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center gap-1 mb-3">
              <span class="text-yellow-400">★★★★★</span>
            </div>
            <p class="text-sm text-surface-300 leading-relaxed mb-4">"{{ t('reviews.review3.text') }}"</p>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center text-xs font-bold text-accent-400">D</div>
              <div>
                <p class="text-xs font-medium text-surface-200">David N.</p>
                <p class="text-xs text-surface-500">{{ t('reviews.review3.role') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="px-6 lg:px-12 py-24 bg-surface-900/30 border-t border-surface-800/50 scroll-mt-28">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ t('faq.title') }}</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="i in 6"
            :key="i"
            class="card overflow-hidden"
          >
            <button
              class="w-full flex items-center justify-between gap-4 p-5 text-left"
              @click="toggleFaq(i)"
            >
              <span class="font-medium text-white text-sm md:text-base">{{ t(`faq.q${i}`) }}</span>
              <AppIcon
                name="lucide:chevron-down"
                class="w-5 h-5 text-surface-400 flex-shrink-0 transition-transform duration-200"
                :class="{ 'rotate-180': openFaq === i }"
              />
            </button>
            <div
              v-show="openFaq === i"
              class="px-5 pb-5 -mt-1"
            >
              <p class="text-sm text-surface-400 leading-relaxed">{{ t(`faq.a${i}`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="px-6 lg:px-12 py-24 border-t border-surface-800/50 scroll-mt-28">
      <div class="max-w-3xl mx-auto text-center space-y-6">
        <h2 class="text-3xl md:text-4xl font-bold text-white">{{ t('contact.title') }}</h2>
        <p class="text-surface-400 text-lg">{{ t('contact.desc') }}</p>
        <a href="https://discord.gg/J9xmQchpX6" target="_blank" class="group btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2">
          <AppIcon name="lucide:message-circle" class="w-5 h-5" />
          {{ t('contact.btn') }}
        </a>
      </div>
    </section>

    <!-- Footer -->
    <footer class="px-6 lg:px-12 py-12 border-t border-surface-800/50">
      <div class="max-w-5xl mx-auto space-y-8">
        <!-- Open Source links -->
        <div class="flex flex-col md:flex-row items-center justify-center gap-4">
          <a href="https://github.com/wave3k/BitLock" target="_blank" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-surface-300 hover:text-white hover:border-surface-600 transition-all">
            <AppIcon name="lucide:github" class="w-4 h-4" />
            {{ t('footer.sourceCode') }}
          </a>
          <a href="https://github.com/wave3k/BitLock-extension" target="_blank" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-surface-300 hover:text-white hover:border-surface-600 transition-all">
            <AppIcon name="lucide:chrome" class="w-4 h-4" />
            {{ t('footer.chromeExtension') }}
          </a>
          <a href="https://discord.gg/J9xmQchpX6" target="_blank" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-surface-300 hover:text-white hover:border-surface-600 transition-all">
            <AppIcon name="lucide:message-circle" class="w-4 h-4" />
            {{ t('footer.discord') }}
          </a>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 text-sm text-surface-500">
          <NuxtLink to="/legal/cgu" class="hover:text-surface-300 transition-colors">{{ t('footer.terms') }}</NuxtLink>
          <NuxtLink to="/legal/confidentialite" class="hover:text-surface-300 transition-colors">{{ t('footer.privacy') }}</NuxtLink>
          <NuxtLink to="/legal/mentions-legales" class="hover:text-surface-300 transition-colors">{{ t('footer.legalNotice') }}</NuxtLink>
        </div>

        <!-- Bottom -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-surface-800/50">
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold tracking-tight text-white">BitLock</span>
          </div>
          <p class="text-sm text-surface-500">&copy; {{ new Date().getFullYear() }} BitLock — by <span class="text-surface-300 font-medium">Tensor Team</span></p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { t } = useLang()
const { loggedIn, user } = useUserSession()
const { features } = useFeatureCatalog()
const showUserMenu = ref(false)
const featuredFeatures = computed(() => features.value.slice(0, 3))

const openFaq = ref<number | null>(null)

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}

const navLinks = [
  { id: 'security', label: 'nav.security' },
  { id: 'reviews', label: 'nav.reviews' },
  { id: 'faq', label: 'nav.faq' },
  { id: 'contact', label: 'nav.contact' },
]

async function handleLogout() {
  showUserMenu.value = false
  await $fetch('/api/auth/logout', { method: 'POST' })
  window.location.reload()
}

function closeMenu(e: Event) {
  if (showUserMenu.value) showUserMenu.value = false
}

onMounted(() => {
  window.scrollTo(0, 0)
  document.addEventListener('click', closeMenu)
})
</script>
