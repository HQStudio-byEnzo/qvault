<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>

      <!-- Modal -->
      <div class="relative w-full max-w-md bg-surface-900 border border-surface-700 rounded-2xl p-6 animate-scale-in">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white">Ajouter un élément</h2>
          <button @click="$emit('close')" class="p-2 rounded-lg hover:bg-surface-800 text-surface-400">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-surface-300 mb-2">Type</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="t in types"
                :key="t.value"
                type="button"
                @click="form.type = t.value"
                class="p-3 rounded-lg border text-center transition-all text-sm"
                :class="[
                  form.type === t.value
                    ? 'border-accent-500 bg-accent-500/10 text-accent-300'
                    : 'border-surface-700 bg-surface-800 text-surface-400 hover:border-surface-600'
                ]"
              >
                <Icon :name="t.icon" class="w-5 h-5 mx-auto mb-1" />
                {{ t.label }}
              </button>
            </div>
          </div>

          <!-- Label -->
          <div>
            <label for="label" class="block text-sm font-medium text-surface-300 mb-1">Libellé</label>
            <input
              id="label"
              v-model="form.label"
              type="text"
              class="input-field"
              placeholder="Ex: Gmail, Binance, Portfolio..."
            />
          </div>

          <!-- Payload -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="payload" class="block text-sm font-medium text-surface-300">
                {{ payloadLabel }}
              </label>
              <button
                v-if="form.type === 'crypto'"
                type="button"
                @click="generateSeed"
                class="text-xs px-2 py-1 rounded bg-accent-600/20 text-accent-300 hover:bg-accent-600/30 transition-colors"
              >
                Générer seed phrase
              </button>
            </div>
            <textarea
              id="payload"
              v-model="form.payload"
              rows="3"
              required
              class="input-field resize-none font-mono text-sm"
              :placeholder="payloadPlaceholder"
            ></textarea>
          </div>

          <!-- URL (only for passwords) -->
          <div v-if="form.type === 'password'">
            <label for="url" class="block text-sm font-medium text-surface-300 mb-1">Website URL (optional)</label>
            <input id="url" v-model="form.url" type="url" class="input-field" placeholder="https://gmail.com" />
          </div>

          <!-- Master password (always required — encryption is mandatory) -->
          <div>
            <label for="masterPassword" class="block text-sm font-medium text-surface-300 mb-1">
              Master password
            </label>
            <input
              id="masterPassword"
              v-model="form.masterPassword"
              type="password"
              required
              class="input-field"
              placeholder="Votre mot de passe de chiffrement"
            />
            <p class="text-xs text-surface-500 mt-1">
              🔒 Required — used to encrypt your data locally. Never sent to the server.
            </p>
          </div>

          <!-- Error -->
          <div v-if="error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {{ error }}
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn-primary w-full py-2.5"
          >
            <span v-if="isSubmitting">Ajout en cours...</span>
            <span v-else>Ajouter au coffre-fort</span>
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  defaultType?: 'link' | 'password' | 'crypto'
}>()

const emit = defineEmits<{
  close: []
  added: []
}>()

const { addItem, error } = useVault()
const { generateSeedPhrase } = useSeedGenerator()
const isSubmitting = ref(false)

const form = reactive({
  type: props.defaultType || 'link' as 'link' | 'password' | 'crypto',
  label: '',
  payload: '',
  url: '',
  masterPassword: '',
})

const types = [
  { value: 'link' as const, label: 'Lien', icon: 'lucide:link' },
  { value: 'password' as const, label: 'Mot de passe', icon: 'lucide:key-round' },
  { value: 'crypto' as const, label: 'Crypto', icon: 'lucide:bitcoin' },
]

const payloadLabel = computed(() => {
  switch (form.type) {
    case 'link': return 'URL'
    case 'password': return 'Mot de passe'
    case 'crypto': return 'Seed phrase / Clé privée'
  }
})

const payloadPlaceholder = computed(() => {
  switch (form.type) {
    case 'link': return 'https://...'
    case 'password': return 'Votre mot de passe'
    case 'crypto': return 'word1 word2 word3...'
  }
})

async function handleSubmit() {
  if (!form.masterPassword) {
    return
  }

  isSubmitting.value = true

  try {
    await addItem({
      type: form.type,
      label: form.label,
      payload: form.payload,
      shouldEncrypt: true,
      masterPassword: form.masterPassword,
      url: form.type === 'password' ? form.url : undefined,
    })
    emit('added')
  } catch {
    // Error is handled by useVault composable
  } finally {
    isSubmitting.value = false
  }
}

function generateSeed() {
  form.payload = generateSeedPhrase()
}
</script>
