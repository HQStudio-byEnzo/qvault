<template>
  <div class="min-h-screen bg-surface-950 text-white">
    <header class="border-b border-white/10 bg-surface-950/80 backdrop-blur">
      <div class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 font-semibold">
          <Icon name="lucide:shield" class="w-6 h-6 text-accent-300" />
          BitLock
        </NuxtLink>
        <NuxtLink to="/auth/register" class="btn-primary">{{ t('generator.cta') }}</NuxtLink>
      </div>
    </header>
    <main class="max-w-5xl mx-auto px-6 py-16 grid lg:grid-cols-[1fr_380px] gap-10">
      <section>
        <p class="text-accent-300 font-medium mb-3">{{ t('generator.badge') }}</p>
        <h1 class="text-4xl md:text-6xl font-semibold tracking-tight mb-5">{{ t('generator.title') }}</h1>
        <p class="text-surface-300 text-lg leading-relaxed mb-8">{{ t('generator.desc') }}</p>
        <div class="card p-6 space-y-6">
          <div>
            <label class="text-sm text-surface-400">{{ t('generator.generatedLabel') }}</label>
            <div class="mt-2 flex gap-2">
              <input :value="password" readonly class="input-field font-mono text-lg" />
              <button class="btn-secondary" @click="copyPassword"><Icon name="lucide:copy" class="w-5 h-5" /></button>
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <label class="space-y-2">
              <span class="text-sm text-surface-300">{{ t('generator.length') }}: {{ options.length }}</span>
              <input v-model.number="options.length" type="range" min="12" max="64" class="w-full" />
            </label>
            <div class="rounded-xl border border-surface-700 p-4">
              <p class="text-sm text-surface-400">{{ t('generator.entropy') }}</p>
              <p class="text-2xl font-semibold text-emerald-300">{{ passwordEntropy }} bits</p>
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-3">
            <label v-for="option in toggles" :key="option.key" class="flex items-center gap-3 rounded-xl border border-surface-700 p-3">
              <input v-model="options[option.key]" type="checkbox" class="rounded" />
              <span>{{ option.label }}</span>
            </label>
          </div>
          <button class="btn-primary w-full py-3" @click="regenerate">{{ t('generator.generate') }}</button>
          <p v-if="copied" class="text-sm text-emerald-300">{{ t('generator.copied') }}</p>
        </div>
      </section>
      <aside class="card p-6 h-fit space-y-4">
        <h2 class="text-xl font-semibold">{{ t('generator.bestPractices') }}</h2>
        <ul class="space-y-3 text-sm text-surface-300">
          <li>{{ t('generator.practice1') }}</li>
          <li>{{ t('generator.practice2') }}</li>
          <li>{{ t('generator.practice3') }}</li>
          <li>{{ t('generator.practice4') }}</li>
        </ul>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useLang()
useSeoMeta({ title: t('generator.seoTitle'), description: t('generator.seoDesc') })
const { generatePassword, entropy } = usePasswordGenerator()
const options = reactive({ length: 24, uppercase: true, lowercase: true, numbers: true, symbols: true, avoidAmbiguous: true })
const password = ref('')
const copied = ref(false)
const toggles = computed(() => [
  { key: 'uppercase' as const, label: t('generator.uppercase') },
  { key: 'lowercase' as const, label: t('generator.lowercase') },
  { key: 'numbers' as const, label: t('generator.numbers') },
  { key: 'symbols' as const, label: t('generator.symbols') },
  { key: 'avoidAmbiguous' as const, label: t('generator.avoidAmbiguous') },
])
const passwordEntropy = computed(() => entropy(password.value, options))
function regenerate() { password.value = generatePassword(options) }
async function copyPassword() { await navigator.clipboard.writeText(password.value); copied.value = true; setTimeout(() => { copied.value = false }, 1600) }
watch(options, regenerate, { deep: true })
onMounted(regenerate)
</script>
