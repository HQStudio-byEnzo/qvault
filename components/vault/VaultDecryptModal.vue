<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>

      <!-- Modal -->
      <div class="relative w-full max-w-md bg-surface-900 border border-surface-700 rounded-2xl p-6 animate-scale-in">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white flex items-center gap-2">
            <Icon name="lucide:unlock" class="w-5 h-5 text-accent-400" />
            Déchiffrer
          </h2>
          <button @click="$emit('close')" class="p-2 rounded-lg hover:bg-surface-800 text-surface-400">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Not yet decrypted -->
        <div v-if="!decryptedValue" class="space-y-4">
          <p class="text-sm text-surface-400">
            Entrez votre mot de passe maître pour déchiffrer « <strong class="text-surface-200">{{ item.label || 'Sans titre' }}</strong> ».
          </p>

          <form @submit.prevent="handleDecrypt" class="space-y-4">
            <div>
              <label for="masterPwd" class="block text-sm font-medium text-surface-300 mb-1">
                Mot de passe maître
              </label>
              <input
                id="masterPwd"
                v-model="masterPassword"
                type="password"
                required
                autofocus
                class="input-field"
                placeholder="Votre mot de passe de chiffrement"
              />
            </div>

            <div v-if="errorMsg" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {{ errorMsg }}
            </div>

            <button type="submit" :disabled="isDecrypting" class="btn-primary w-full">
              <span v-if="isDecrypting">Déchiffrement...</span>
              <span v-else>Déchiffrer</span>
            </button>
          </form>
        </div>

        <!-- Decrypted result -->
        <div v-else class="space-y-4">
          <div class="p-4 rounded-lg bg-surface-800 border border-surface-700">
            <p class="text-xs text-surface-500 mb-2">Contenu déchiffré :</p>
            <p class="text-sm text-surface-100 font-mono break-all whitespace-pre-wrap">{{ decryptedValue }}</p>
          </div>

          <div class="flex gap-2">
            <button @click="copyDecrypted" class="btn-primary flex-1 flex items-center justify-center gap-2">
              <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
              {{ copied ? 'Copié !' : 'Copier' }}
            </button>
            <button @click="$emit('close')" class="btn-secondary flex-1">
              Fermer
            </button>
          </div>

          <p class="text-xs text-surface-500 text-center">
            🔒 Cette donnée n'est visible que dans votre navigateur.
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { VaultItem } from '~/composables/useVault'

const props = defineProps<{
  item: VaultItem
}>()

defineEmits<{
  close: []
}>()

const { decryptItem } = useVault()

const masterPassword = ref('')
const decryptedValue = ref('')
const errorMsg = ref('')
const isDecrypting = ref(false)
const copied = ref(false)

async function handleDecrypt() {
  isDecrypting.value = true
  errorMsg.value = ''

  try {
    decryptedValue.value = await decryptItem(props.item, masterPassword.value)
  } catch (err: any) {
    errorMsg.value = 'Mot de passe incorrect ou données corrompues.'
  } finally {
    isDecrypting.value = false
  }
}

async function copyDecrypted() {
  try {
    await navigator.clipboard.writeText(decryptedValue.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback
  }
}
</script>
