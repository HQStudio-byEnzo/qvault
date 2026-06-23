<template>
  <div class="min-h-screen text-white">
    <header class="sticky top-0 z-40 border-b border-surface-800/80 bg-surface-950/85 backdrop-blur-2xl">
      <div class="section-shell max-w-7xl py-4 flex items-center justify-between gap-4">
        <NuxtLink to="/" class="flex items-center gap-3 font-semibold">
          <UiBitLockLogo :size="56" />
          <span class="text-xl tracking-tight text-white">BitLock</span>
        </NuxtLink>
        <NuxtLink to="/auth/register" class="btn-primary">{{ t('generator.cta') }}</NuxtLink>
      </div>
    </header>

    <main class="section-shell max-w-7xl py-10 md:py-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8">
      <section>
        <p class="eyebrow mb-4">{{ t('sidebar.seedGenerator') }}</p>
        <h1 class="text-4xl md:text-6xl font-semibold tracking-tight mb-5">{{ t('seedGenerator.toolTitle') }}</h1>
        <p class="text-surface-300 text-lg leading-relaxed mb-8 max-w-2xl">{{ t('seedGenerator.toolDesc') }}</p>

        <div class="glass-panel p-5 md:p-6 space-y-6">
          <div class="space-y-2">
            <label class="text-sm text-surface-400">{{ t('seedGenerator.generatedLabel') }}</label>
            <textarea :value="seedPhrase" readonly rows="4" class="input-field font-mono text-base resize-none"></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="space-y-2">
              <span class="text-sm text-surface-300">{{ t('seedGenerator.wordCount') }}: {{ wordCount }}</span>
              <input v-model.number="wordCount" type="range" min="12" max="24" step="3" class="w-full" />
            </label>
            <div class="metric-tile">
              <p class="text-sm text-surface-400">{{ t('seedGenerator.securityHintTitle') }}</p>
              <p class="text-sm font-semibold text-white mt-2">{{ t('seedGenerator.securityHintValue') }}</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <button class="btn-primary flex-1" @click="regenerate">{{ t('seedGenerator.generate') }}</button>
            <button class="btn-secondary" @click="copySeed">
              <Icon name="lucide:copy" class="w-4 h-4" />
            </button>
          </div>

          <p v-if="copied" class="text-sm text-emerald-300">{{ t('seedGenerator.copied') }}</p>
        </div>
      </section>

      <aside class="glass-panel p-5 md:p-6 h-fit space-y-4">
        <h2 class="text-xl font-semibold text-white">{{ t('seedGenerator.bestPractices') }}</h2>
        <ul class="space-y-3 text-sm text-surface-300">
          <li>{{ t('seedGenerator.practice1') }}</li>
          <li>{{ t('seedGenerator.practice2') }}</li>
          <li>{{ t('seedGenerator.practice3') }}</li>
          <li>{{ t('seedGenerator.practice4') }}</li>
        </ul>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'

definePageMeta({ layout: 'default' })

const { t } = useLang()
const { generateSeedPhrase } = useSeedGenerator()

useSeoMeta({
  title: t('seedGenerator.toolSeoTitle'),
  description: t('seedGenerator.toolSeoDesc'),
})

const seedPhrase = ref('')
const copied = ref(false)
const wordCount = ref(12)

function regenerate() {
  seedPhrase.value = generateSeedPhrase(wordCount.value)
}

async function copySeed() {
  await navigator.clipboard.writeText(seedPhrase.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1600)
}

watch(wordCount, regenerate)
onMounted(regenerate)
</script>
