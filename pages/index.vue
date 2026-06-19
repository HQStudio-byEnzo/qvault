<template>
  <div class="min-h-screen flex flex-col bg-surface-950 overflow-hidden scroll-smooth">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 lg:px-12 backdrop-blur-xl bg-surface-950/80 border-b border-surface-800/50">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">
          <Icon name="lucide:shield" class="w-5 h-5 text-white" />
        </div>
        <span class="text-lg font-bold text-white tracking-tight">BitLock</span><span class="hidden sm:inline text-xs text-surface-500">Security vault</span>
      </div>

      <!-- Section nav links (desktop only) -->
      <div class="hidden lg:flex items-center gap-1">
        <a
          v-for="link in navLinks"
          :key="link.id"
          :href="'#' + link.id"
          class="px-3 py-1.5 rounded-full text-sm font-medium text-surface-400 hover:text-white hover:bg-surface-800/60 transition-all"
        >
          {{ t(link.label) }}
        </a>
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
    <section class="relative flex-1 flex items-center justify-center px-6 pt-32 pb-20 lg:pt-36 lg:pb-32">
      <!-- Background effects -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-accent-600/8 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div class="relative max-w-4xl text-center space-y-8 animate-fade-in">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-500/20 bg-accent-500/5 text-xs font-medium text-accent-300">
          <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          {{ t('hero.badge') }}
        </div>

        <!-- Title -->
        <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          {{ t('hero.title1') }}<br>
          <span class="bg-gradient-to-r from-accent-400 to-emerald-300 bg-clip-text text-transparent">{{ t('hero.title2') }}</span>
        </h1>

        <!-- Subtitle -->
        <p class="text-lg md:text-xl text-surface-400 max-w-2xl mx-auto leading-relaxed">
          {{ t('hero.subtitle') }}
        </p>

        <!-- CTA -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <NuxtLink to="/auth/register" class="group btn-primary text-base px-8 py-3.5 flex items-center gap-2">
            {{ t('hero.cta') }}
            <Icon name="lucide:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
          <NuxtLink to="/generateur-mot-de-passe" class="btn-secondary text-base px-8 py-3.5">Générer un mot de passe</NuxtLink>
          <NuxtLink to="/auth/login" class="btn-secondary text-base px-8 py-3.5">
            {{ t('hero.login') }}
          </NuxtLink>
        </div>

        <!-- Social proof -->
        <div class="flex items-center justify-center gap-6 pt-8 text-sm text-surface-500">
          <div class="flex items-center gap-1.5">
            <Icon name="lucide:shield-check" class="w-4 h-4 text-green-400" />
            <span>AES-256-GCM</span>
          </div>
          <div class="w-1 h-1 rounded-full bg-surface-700"></div>
          <div class="flex items-center gap-1.5">
            <Icon name="lucide:eye-off" class="w-4 h-4 text-accent-400" />
            <span>Zero-Knowledge</span>
          </div>
          <div class="w-1 h-1 rounded-full bg-surface-700"></div>
          <div class="flex items-center gap-1.5">
            <Icon name="lucide:zap" class="w-4 h-4 text-amber-400" />
            <span>{{ t('hero.free') }}</span>
          </div>
          <div class="w-1 h-1 rounded-full bg-surface-700"></div>
          <div class="flex items-center gap-1.5">
            <Icon name="lucide:ticket-check" class="w-4 h-4 text-purple-400" />
            <span>Recovery codes</span>
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
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ t('features.title') }}</h2>
          <p class="text-surface-400 max-w-lg mx-auto">{{ t('features.subtitle') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="card group hover:border-blue-500/30 transition-all duration-300">
            <div class="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:link" class="w-5 h-5 text-blue-400" />
            </div>
            <h3 class="font-semibold text-white mb-2">{{ t('features.links.title') }}</h3>
            <p class="text-sm text-surface-400 leading-relaxed">{{ t('features.links.desc') }}</p>
          </div>

          <div class="card group hover:border-amber-500/30 transition-all duration-300">
            <div class="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:key-round" class="w-5 h-5 text-amber-400" />
            </div>
            <h3 class="font-semibold text-white mb-2">{{ t('features.passwords.title') }}</h3>
            <p class="text-sm text-surface-400 leading-relaxed">{{ t('features.passwords.desc') }}</p>
          </div>

          <div class="card group hover:border-orange-500/30 transition-all duration-300">
            <div class="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:bitcoin" class="w-5 h-5 text-orange-400" />
            </div>
            <h3 class="font-semibold text-white mb-2">{{ t('features.crypto.title') }}</h3>
            <p class="text-sm text-surface-400 leading-relaxed">{{ t('features.crypto.desc') }}</p>
          </div>

          <div class="card group hover:border-green-500/30 transition-all duration-300">
            <div class="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:lock" class="w-5 h-5 text-green-400" />
            </div>
            <h3 class="font-semibold text-white mb-2">{{ t('features.encryption.title') }}</h3>
            <p class="text-sm text-surface-400 leading-relaxed">{{ t('features.encryption.desc') }}</p>
          </div>

          <div class="card group hover:border-purple-500/30 transition-all duration-300">
            <div class="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:star" class="w-5 h-5 text-purple-400" />
            </div>
            <h3 class="font-semibold text-white mb-2">{{ t('features.favorites.title') }}</h3>
            <p class="text-sm text-surface-400 leading-relaxed">{{ t('features.favorites.desc') }}</p>
          </div>

          <div class="card group hover:border-rose-500/30 transition-all duration-300">
            <div class="w-11 h-11 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:ticket-check" class="w-5 h-5 text-rose-400" />
            </div>
            <h3 class="font-semibold text-white mb-2">Recovery codes</h3>
            <p class="text-sm text-surface-400 leading-relaxed">Importez des fichiers .txt et protégez vos codes de secours GitHub, Google ou cloud dans le coffre chiffré.</p>
          </div>
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
                <Icon name="lucide:shield-check" class="w-3 h-3" />
                {{ t('security.badge') }}
              </div>
              <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">{{ t('security.title') }}</h2>
              <p class="text-surface-400 leading-relaxed">
                {{ t('security.desc') }}
              </p>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-400 flex-shrink-0" />
                <span class="text-sm text-surface-200">{{ t('security.aes') }}</span>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-400 flex-shrink-0" />
                <span class="text-sm text-surface-200">{{ t('security.pbkdf2') }}</span>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-400 flex-shrink-0" />
                <span class="text-sm text-surface-200">{{ t('security.client') }}</span>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-400 flex-shrink-0" />
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
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ t('reviews.title') }}</h2>
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
              <Icon
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
          <Icon name="lucide:message-circle" class="w-5 h-5" />
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
            <Icon name="lucide:github" class="w-4 h-4" />
            Source Code
          </a>
          <a href="https://github.com/wave3k/BitLock-extension" target="_blank" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-surface-300 hover:text-white hover:border-surface-600 transition-all">
            <Icon name="lucide:chrome" class="w-4 h-4" />
            Chrome Extension
          </a>
          <a href="https://discord.gg/J9xmQchpX6" target="_blank" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-surface-300 hover:text-white hover:border-surface-600 transition-all">
            <Icon name="lucide:message-circle" class="w-4 h-4" />
            Discord
          </a>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 text-sm text-surface-500">
          <NuxtLink to="/legal/cgu" class="hover:text-surface-300 transition-colors">CGU</NuxtLink>
          <NuxtLink to="/legal/confidentialite" class="hover:text-surface-300 transition-colors">Politique de confidentialite</NuxtLink>
          <NuxtLink to="/legal/mentions-legales" class="hover:text-surface-300 transition-colors">Mentions legales</NuxtLink>
        </div>

        <!-- Bottom -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-surface-800/50">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-accent-600 rounded-md flex items-center justify-center">
              <Icon name="lucide:shield" class="w-3.5 h-3.5 text-white" />
            </div>
            <span class="text-sm font-medium text-surface-400">BitLock</span>
          </div>
          <p class="text-sm text-surface-500">&copy; {{ new Date().getFullYear() }} BitLock — by <span class="text-surface-300 font-medium">RLT Labs</span></p>
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
const showUserMenu = ref(false)

const openFaq = ref<number | null>(null)

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}

const navLinks = [
  { id: 'features', label: 'nav.features' },
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
