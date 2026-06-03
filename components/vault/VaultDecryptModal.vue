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
            {{ t('vault.decrypt') }}
          </h2>
          <button @click="$emit('close')" class="p-2 rounded-lg hover:bg-surface-800 text-surface-400">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Not yet decrypted -->
        <div v-if="!decryptedValue" class="space-y-4">
          <p class="text-sm text-surface-400">
            {{ t('vault.decryptPrompt') }} « <strong class="text-surface-200">{{ item.label || t('vault.untitled') }}</strong> ».
          </p>

          <form @submit.prevent="handleDecrypt" class="space-y-4">
            <div>
              <label for="masterPwd" class="block text-sm font-medium text-surface-300 mb-1">
                {{ t('vault.masterPwd') }}
              </label>
              <input
                id="masterPwd"
                v-model="masterPassword"
                type="password"
                required
                autofocus
                class="input-field"
                :placeholder="t('vault.masterPwdPlaceholder')"
              />
            </div>

            <div v-if="errorMsg" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {{ errorMsg }}
            </div>

            <button type="submit" :disabled="isDecrypting" class="btn-primary w-full">
              <span v-if="isDecrypting">{{ t('vault.decrypting') }}</span>
              <span v-else>{{ t('vault.decryptBtn') }}</span>
            </button>
          </form>
        </div>

        <!-- Decrypted result -->
        <div v-else class="space-y-4">
          <div class="p-4 rounded-lg bg-surface-800 border border-surface-700">
            <p class="text-xs text-surface-500 mb-2">{{ t('vault.decryptedContent') }}</p>
            <p class="text-sm text-surface-100 font-mono break-all whitespace-pre-wrap">{{ decryptedValue }}</p>
          </div>

          <div class="flex gap-2">
            <button @click="copyDecrypted" class="btn-primary flex-1 flex items-center justify-center gap-2">
              <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
              {{ copied ? t('vault.copied') : t('vault.copy') }}
            </button>
            <button @click="$emit('close')" class="btn-secondary flex-1">
              {{ t('vault.close') }}
            </button>
          </div>

          <p class="text-xs text-surface-500 text-center">
            {{ t('vault.decryptNotice') }}
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

const { t } = useLang()
const { decryptItem } = useVault()
const { setMasterPassword } = useMasterPassword()

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
    setMasterPassword(masterPassword.value)
  } catch (err: any) {
    errorMsg.value = t('vault.decryptError')
  } finally {
    isDecrypting.value = false
  }
}

async function copyDecrypted() {
  try {
    await navigator.clipboard.writeText(decryptedValue.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
    scheduleClipboardClear(decryptedValue.value)
  } catch {
    // Fallback
  }
}

function scheduleClipboardClear(value: string) {
  const seconds = Number(localStorage.getItem('kipit.security.clipboardClearSeconds') || 30)
  if (seconds <= 0) return

  setTimeout(async () => {
    try {
      const current = await navigator.clipboard.readText()
      if (current === value) await navigator.clipboard.writeText('')
    } catch {
      // Clipboard permissions are browser-dependent.
    }
  }, seconds * 1000)
}
</script>
