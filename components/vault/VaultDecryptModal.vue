<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>

      <!-- Modal -->
      <div class="relative w-full max-w-md glass-panel p-5 md:p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white flex items-center gap-2">
            <Icon name="lucide:unlock" class="w-5 h-5 text-accent-400" />
            {{ t('vault.decrypt') }}
          </h2>
          <button @click="$emit('close')" class="p-2 rounded-xl hover:bg-white/5 text-surface-300">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Not yet decrypted -->
        <div v-if="!decryptedValue" class="space-y-4">
          <p class="text-sm text-surface-400">
            {{ t('vault.decryptPrompt') }} "<strong class="text-surface-200">{{ item.label || t('vault.untitled') }}</strong>".
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

            <div v-if="errorMsg" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
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
          <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <p class="text-xs text-surface-500 mb-3">{{ t('vault.decryptedContent') }}</p>

            <div v-if="passwordEntry" class="space-y-3">
              <div>
                <p class="text-[11px] uppercase tracking-[0.14em] text-surface-500">{{ t('vault.passwordValue') }}</p>
                <p class="mt-1 text-sm text-surface-100 font-mono break-all whitespace-pre-wrap">{{ passwordEntry.password }}</p>
              </div>
              <div v-if="passwordEntry.username">
                <p class="text-[11px] uppercase tracking-[0.14em] text-surface-500">{{ t('vault.username') }}</p>
                <p class="mt-1 text-sm text-surface-100 break-all">{{ passwordEntry.username }}</p>
              </div>
              <div v-if="passwordEntry.email">
                <p class="text-[11px] uppercase tracking-[0.14em] text-surface-500">{{ t('vault.loginEmail') }}</p>
                <p class="mt-1 text-sm text-surface-100 break-all">{{ passwordEntry.email }}</p>
              </div>
              <div v-if="passwordEntry.phone">
                <p class="text-[11px] uppercase tracking-[0.14em] text-surface-500">{{ t('vault.phone') }}</p>
                <p class="mt-1 text-sm text-surface-100 break-all">{{ passwordEntry.phone }}</p>
              </div>
              <div v-if="item.url">
                <p class="text-[11px] uppercase tracking-[0.14em] text-surface-500">{{ t('vault.websiteUrl') }}</p>
                <p class="mt-1 text-sm text-surface-100 break-all">{{ item.url }}</p>
              </div>
            </div>

            <p v-else class="text-sm text-surface-100 font-mono break-all whitespace-pre-wrap">{{ decryptedValue }}</p>
          </div>

          <div class="flex gap-2">
            <button @click="copyDecrypted" class="btn-primary flex-1 flex items-center justify-center gap-2">
              <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
              {{ copied ? t('vault.copied') : passwordEntry ? t('vault.copyPassword') : t('vault.copy') }}
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
import { useLang } from '~/composables/useI18n'
import type { VaultItem } from '~/composables/useVault'
import { parsePasswordEntry } from '~/utils/password-entry'

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

const passwordEntry = computed(() => {
  if (!decryptedValue.value || props.item.type !== 'password') return null
  return parsePasswordEntry(decryptedValue.value)
})

const copyValue = computed(() => passwordEntry.value?.password || decryptedValue.value)

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
    await navigator.clipboard.writeText(copyValue.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
    scheduleClipboardClear(copyValue.value)
  } catch {
    // Fallback
  }
}

function scheduleClipboardClear(value: string) {
  const seconds = Number(localStorage.getItem('bitlock.security.clipboardClearSeconds') || 30)
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
