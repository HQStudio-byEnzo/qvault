<template>
  <div class="section-shell max-w-7xl py-10 md:py-16 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-8">
    <section>
      <p class="eyebrow mb-4">{{ t('sidebar.seedGenerator') }}</p>
      <h1 class="text-4xl md:text-6xl font-semibold tracking-tight mb-5">{{ t('seedGenerator.title') }}</h1>
      <p class="text-surface-300 text-lg leading-relaxed mb-8 max-w-2xl">{{ t('seedGenerator.desc') }}</p>

      <div class="glass-panel p-5 md:p-6 space-y-6">
        <div class="space-y-2">
          <label class="text-sm text-surface-400">{{ t('seedGenerator.generatedLabel') }}</label>
          <textarea :value="seedPhrase" readonly rows="4" class="input-field font-mono text-base resize-none"></textarea>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button class="btn-primary flex-1" @click="regenerate">{{ t('seedGenerator.generate') }}</button>
          <button class="btn-secondary" @click="copySeed">
            <AppIcon name="lucide:copy" class="w-4 h-4" />
          </button>
        </div>

        <p v-if="copied" class="text-sm text-emerald-300">{{ t('seedGenerator.copied') }}</p>
      </div>
    </section>

    <aside class="space-y-4">
      <div class="glass-panel p-5 md:p-6 space-y-4">
        <h2 class="text-xl font-semibold text-white">{{ t('seedGenerator.saveTitle') }}</h2>
        <p class="text-sm text-surface-400 leading-relaxed">{{ t('seedGenerator.saveDesc') }}</p>

        <div v-if="!isUnlocked" class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-200">
          {{ t('seedGenerator.masterPasswordNeeded') }}
        </div>

        <div>
          <label for="itemLabel" class="block text-sm font-medium text-surface-300 mb-1">{{ t('seedGenerator.label') }}</label>
          <input id="itemLabel" v-model="itemLabel" type="text" class="input-field" :placeholder="t('seedGenerator.labelPlaceholder')" />
        </div>

        <div>
          <label for="masterPassword" class="block text-sm font-medium text-surface-300 mb-1">{{ t('seedGenerator.masterPassword') }}</label>
          <input id="masterPassword" v-model="masterPasswordInput" type="password" class="input-field" :placeholder="t('seedGenerator.masterPasswordPlaceholder')" />
        </div>

        <div v-if="saveError" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {{ saveError }}
        </div>
        <div v-if="saveSuccess" class="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400">
          {{ saveSuccess }}
        </div>

        <button class="btn-primary w-full py-3" :disabled="saving" @click="saveToVault">
          <span v-if="saving">{{ t('seedGenerator.saving') }}</span>
          <span v-else>{{ t('seedGenerator.saveToVault') }}</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const { t } = useLang()
const { generateSeedPhrase } = useSeedGenerator()
const { addItem } = useVault()
const { masterPassword, isUnlocked, setMasterPassword } = useMasterPassword()

const seedPhrase = ref('')
const copied = ref(false)
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref('')
const itemLabel = ref('')
const masterPasswordInput = ref('')

function regenerate() {
  seedPhrase.value = generateSeedPhrase()
}

async function copySeed() {
  await navigator.clipboard.writeText(seedPhrase.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1600)
}

async function saveToVault() {
  saveError.value = ''
  saveSuccess.value = ''

  const label = itemLabel.value.trim() || t('seedGenerator.defaultLabel')
  const currentMaster = masterPassword.value || masterPasswordInput.value.trim()

  if (!currentMaster) {
    saveError.value = t('seedGenerator.masterPasswordNeeded')
    return
  }

  saving.value = true
  try {
    if (!masterPassword.value) setMasterPassword(currentMaster)

    await addItem({
      type: 'crypto',
      label,
      payload: seedPhrase.value,
      shouldEncrypt: true,
    })

    saveSuccess.value = t('seedGenerator.saved')
  } catch (err: any) {
    saveError.value = err.data?.message || t('seedGenerator.saveError')
  } finally {
    saving.value = false
  }
}

onMounted(regenerate)
</script>
