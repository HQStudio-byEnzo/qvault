<template>
  <div class="min-h-screen flex flex-col bg-surface-950 overflow-hidden">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 lg:px-12 backdrop-blur-xl bg-surface-950/80 border-b border-surface-800/50">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">
          <Icon name="lucide:shield" class="w-5 h-5 text-white" />
        </div>
        <span class="text-lg font-bold text-white tracking-tight">Kipit</span>
      </div>
      <div class="flex items-center gap-3">
        <LangSwitch />
        <NuxtLink to="/auth/login" class="hidden sm:inline-flex text-sm text-surface-300 hover:text-white transition-colors px-4 py-2">
          {{ t('nav.login') }}
        </NuxtLink>
        <NuxtLink to="/auth/register" class="btn-primary text-sm">
          {{ t('nav.start') }}
        </NuxtLink>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative flex-1 flex items-center justify-center px-6 pt-32 pb-20 lg:pt-40 lg:pb-32">
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
            <span>Gratuit</span>
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
            <h3 class="text-lg font-semibold text-white">Créez votre compte</h3>
            <p class="text-sm text-surface-400 leading-relaxed">Inscription gratuite en 10 secondes. Pas de carte bancaire, pas de piège.</p>
          </div>
          <div class="text-center space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mx-auto">
              <span class="text-xl font-bold text-accent-400">2</span>
            </div>
            <h3 class="text-lg font-semibold text-white">Ajoutez vos éléments</h3>
            <p class="text-sm text-surface-400 leading-relaxed">Liens, mots de passe, clés crypto. Choisissez de chiffrer ou non chaque élément.</p>
          </div>
          <div class="text-center space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mx-auto">
              <span class="text-xl font-bold text-accent-400">3</span>
            </div>
            <h3 class="text-lg font-semibold text-white">Accédez partout</h3>
            <p class="text-sm text-surface-400 leading-relaxed">Vos données vous suivent sur tous vos appareils, toujours chiffrées.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="px-6 lg:px-12 py-24 bg-surface-900/30 border-t border-surface-800/50">
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
            <h3 class="font-semibold text-white mb-2">Liens</h3>
            <p class="text-sm text-surface-400 leading-relaxed">Sauvegardez vos URLs importantes. Bookmarks, outils, ressources — tout au même endroit.</p>
          </div>

          <div class="card group hover:border-amber-500/30 transition-all duration-300">
            <div class="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:key-round" class="w-5 h-5 text-amber-400" />
            </div>
            <h3 class="font-semibold text-white mb-2">Mots de passe</h3>
            <p class="text-sm text-surface-400 leading-relaxed">Stockez vos identifiants avec un chiffrement militaire. Fini les post-its et les fichiers texte.</p>
          </div>

          <div class="card group hover:border-orange-500/30 transition-all duration-300">
            <div class="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:bitcoin" class="w-5 h-5 text-orange-400" />
            </div>
            <h3 class="font-semibold text-white mb-2">Crypto</h3>
            <p class="text-sm text-surface-400 leading-relaxed">Seed phrases, clés privées. Protégés par un chiffrement que même nous ne pouvons pas casser.</p>
          </div>

          <div class="card group hover:border-green-500/30 transition-all duration-300">
            <div class="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:lock" class="w-5 h-5 text-green-400" />
            </div>
            <h3 class="font-semibold text-white mb-2">Chiffrement côté client</h3>
            <p class="text-sm text-surface-400 leading-relaxed">Vos données sont chiffrées dans votre navigateur AVANT d'être envoyées. Le serveur ne voit que du charabia.</p>
          </div>

          <div class="card group hover:border-purple-500/30 transition-all duration-300">
            <div class="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:star" class="w-5 h-5 text-purple-400" />
            </div>
            <h3 class="font-semibold text-white mb-2">Favoris & Recherche</h3>
            <p class="text-sm text-surface-400 leading-relaxed">Retrouvez vos éléments en un clic. Organisez par favoris, filtrez par type.</p>
          </div>

          <div class="card group hover:border-rose-500/30 transition-all duration-300">
            <div class="w-11 h-11 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:infinity" class="w-5 h-5 text-rose-400" />
            </div>
            <h3 class="font-semibold text-white mb-2">Illimité & Gratuit</h3>
            <p class="text-sm text-surface-400 leading-relaxed">Pas de limite. Pas de plan payant. Kipit est 100% gratuit, pour toujours.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Security section -->
    <section class="px-6 lg:px-12 py-24 border-t border-surface-800/50">
      <div class="max-w-4xl mx-auto">
        <div class="card p-8 md:p-12 border-accent-500/20 bg-gradient-to-br from-accent-900/10 to-surface-900">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400 mb-4">
                <Icon name="lucide:shield-check" class="w-3 h-3" />
                Sécurité maximale
              </div>
              <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">Zero-Knowledge par design</h2>
              <p class="text-surface-400 leading-relaxed">
                Kipit ne peut physiquement pas accéder à vos données chiffrées. 
                Le mot de passe maître ne quitte jamais votre navigateur. 
                Même en cas de piratage du serveur, vos données restent illisibles.
              </p>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-400 flex-shrink-0" />
                <span class="text-sm text-surface-200">AES-256-GCM (standard militaire)</span>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-400 flex-shrink-0" />
                <span class="text-sm text-surface-200">PBKDF2 — 100 000 itérations</span>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-400 flex-shrink-0" />
                <span class="text-sm text-surface-200">Chiffrement côté client uniquement</span>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-400 flex-shrink-0" />
                <span class="text-sm text-surface-200">Open-source & auditable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="px-6 lg:px-12 py-24 border-t border-surface-800/50">
      <div class="max-w-2xl mx-auto text-center space-y-6">
        <h2 class="text-3xl md:text-4xl font-bold text-white">{{ t('cta.title') }}</h2>
        <p class="text-surface-400 text-lg">{{ t('cta.subtitle') }}</p>
        <NuxtLink to="/auth/register" class="group btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2">
          {{ t('cta.btn') }}
          <Icon name="lucide:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="px-6 lg:px-12 py-8 border-t border-surface-800/50">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-accent-600 rounded-md flex items-center justify-center">
            <Icon name="lucide:shield" class="w-3.5 h-3.5 text-white" />
          </div>
          <span class="text-sm font-medium text-surface-400">Kipit</span>
        </div>
        <p class="text-sm text-surface-500">&copy; {{ new Date().getFullYear() }} Kipit — {{ t('footer.by') }} <span class="text-surface-300 font-medium">Team RootLayer</span></p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { t } = useLang()
</script>
