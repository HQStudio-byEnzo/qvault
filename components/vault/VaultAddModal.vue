<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>

      <div class="relative w-full max-w-md glass-panel p-5 md:p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white">{{ t('vault.addTitle') }}</h2>
          <button @click="$emit('close')" class="p-2 rounded-xl hover:bg-white/5 text-surface-300">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <div
          v-if="needsEncryption && !isUnlocked"
          class="mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-200 space-y-3"
        >
          <p>{{ t('vault.masterPwdNotice') }}</p>
          <div>
            <label for="masterPassword" class="block text-xs font-medium text-amber-100 mb-1">
              {{ t('vault.masterPwdLabel') }}
            </label>
            <input
              id="masterPassword"
              v-model="masterPasswordInput"
              type="password"
              class="input-field"
              placeholder="••••••••••••"
              autocomplete="current-password"
            />
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-surface-300 mb-2">{{ t('vault.typeLabel') }}</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                v-for="tp in types"
                :key="tp.value"
                type="button"
                @click="form.type = tp.value"
                class="p-3 rounded-2xl border text-center transition-all text-sm"
                :class="[
                  form.type === tp.value
                    ? 'border-accent-500 bg-accent-500/10 text-accent-300'
                    : 'border-surface-700 bg-surface-800 text-surface-400 hover:border-surface-600'
                ]"
              >
                <Icon :name="tp.icon" class="w-5 h-5 mx-auto mb-1" />
                {{ tp.label }}
              </button>
            </div>
          </div>

          <div>
            <label for="label" class="block text-sm font-medium text-surface-300 mb-1">{{ t('vault.labelField') }}</label>
            <input
              id="label"
              v-model="form.label"
              type="text"
              class="input-field"
              :placeholder="t('vault.labelPlaceholder')"
            />
          </div>

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
                {{ t('vault.generateSeed') }}
              </button>
              <label
                v-if="form.type === 'recovery'"
                class="text-xs px-2 py-1 rounded bg-surface-800 text-surface-300 hover:bg-surface-700 transition-colors cursor-pointer"
              >
                {{ t('vault.importTxt') }}
                <input type="file" accept=".txt,text/plain" class="hidden" @change="importTxt" />
              </label>
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

          <div v-if="form.type === 'password'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="username" class="block text-sm font-medium text-surface-300 mb-1">{{ t('vault.username') }}</label>
              <input id="username" v-model="form.username" type="text" class="input-field" :placeholder="t('vault.usernamePlaceholder')" />
            </div>
            <div>
              <label for="loginEmail" class="block text-sm font-medium text-surface-300 mb-1">{{ t('vault.loginEmail') }}</label>
              <input id="loginEmail" v-model="form.loginEmail" type="email" class="input-field" :placeholder="t('vault.loginEmailPlaceholder')" />
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-surface-300 mb-1">{{ t('vault.phone') }}</label>
              <input id="phone" v-model="form.phone" type="tel" class="input-field" :placeholder="t('vault.phonePlaceholder')" />
            </div>
            <div>
              <label for="url" class="block text-sm font-medium text-surface-300 mb-1">{{ t('vault.websiteUrl') }}</label>
              <input id="url" v-model="form.url" type="url" class="input-field" placeholder="https://gmail.com" />
            </div>
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-3 text-sm text-surface-300 cursor-pointer">
              <input
                v-model="form.encrypt"
                type="checkbox"
                :disabled="form.type !== 'link'"
                class="rounded border-surface-600 text-accent-500 focus:ring-accent-500"
              />
              <span>{{ form.type === 'link' ? t('vault.encryptThisLink') : t('vault.encryptionRequired') }}</span>
            </label>
            <p v-if="form.type === 'link' && !form.encrypt" class="text-xs text-surface-500">
              {{ t('vault.linkPlainTextNotice') }}
            </p>
          </div>

          <div v-if="error" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn-primary w-full py-2.5"
          >
            <span v-if="isSubmitting">{{ t('vault.adding') }}</span>
            <span v-else>{{ t('vault.addBtn') }}</span>
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'
import { serializePasswordEntry } from '~/utils/password-entry'

const props = defineProps<{
  defaultType?: 'link' | 'password' | 'crypto' | 'recovery'
}>()

const emit = defineEmits<{
  close: []
  added: []
}>()

const { addItem, error } = useVault()
const { masterPassword, isUnlocked, setMasterPassword } = useMasterPassword()
const { generateSeedPhrase } = useSeedGenerator()
const { t } = useLang()
const isSubmitting = ref(false)
const masterPasswordInput = ref('')

const form = reactive({
  type: props.defaultType || 'link' as 'link' | 'password' | 'crypto' | 'recovery',
  label: '',
  payload: '',
  username: '',
  loginEmail: '',
  phone: '',
  url: '',
  encrypt: props.defaultType === 'link' ? false : true,
})

const types = computed(() => [
  { value: 'link' as const, label: t('vault.typeLink'), icon: 'lucide:link' },
  { value: 'password' as const, label: t('vault.typePassword'), icon: 'lucide:key-round' },
  { value: 'crypto' as const, label: t('vault.typeCrypto'), icon: 'lucide:bitcoin' },
  { value: 'recovery' as const, label: t('vault.typeRecovery'), icon: 'lucide:ticket-check' },
])

const payloadLabel = computed(() => {
  switch (form.type) {
    case 'link': return t('vault.payloadLink')
    case 'password': return t('vault.payloadPassword')
    case 'crypto': return t('vault.payloadCrypto')
    case 'recovery': return t('vault.payloadRecovery')
  }
})

const payloadPlaceholder = computed(() => {
  switch (form.type) {
    case 'link': return t('vault.payloadPlaceholderLink')
    case 'password': return t('vault.payloadPlaceholderPassword')
    case 'crypto': return t('vault.payloadPlaceholderCrypto')
    case 'recovery': return t('vault.payloadPlaceholderRecovery')
  }
})

const needsEncryption = computed(() => form.type !== 'link' || form.encrypt)

watch(
  () => form.type,
  (type) => {
    form.encrypt = type === 'link' ? false : true
  },
  { immediate: true }
)

async function handleSubmit() {
  const sessionPassword = masterPassword.value || masterPasswordInput.value.trim()

  if (needsEncryption && !sessionPassword) {
    error.value = t('vault.needMasterPasswordToAdd')
    return
  }

  isSubmitting.value = true

  try {
    if (needsEncryption && sessionPassword && !masterPassword.value) {
      setMasterPassword(sessionPassword)
    }

    await addItem({
      type: form.type,
      label: form.label,
      payload: form.type === 'password'
        ? serializePasswordEntry({
            password: form.payload,
            username: form.username,
            email: form.loginEmail,
            phone: form.phone,
          })
        : form.payload,
      shouldEncrypt: form.type === 'link' ? form.encrypt : true,
      url: form.type === 'password' ? form.url : form.type === 'link' ? form.payload : undefined,
    })
    masterPasswordInput.value = ''
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

async function importTxt(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 100_000) {
    error.value = t('vault.importTooLarge')
    input.value = ''
    return
  }
  form.payload = (await file.text()).trim()
  if (!form.label) form.label = file.name.replace(/\.txt$/i, '')
  input.value = ''
}
</script>
