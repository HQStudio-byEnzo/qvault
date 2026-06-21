<template>
  <div class="section-shell max-w-4xl py-10 md:py-16 space-y-8">
    <section class="hero-panel space-y-3">
      <p class="eyebrow">{{ t('sidebar.settings') }}</p>
      <h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-white">{{ t('settings.title') }}</h1>
      <p class="text-surface-300 text-base md:text-lg max-w-2xl leading-relaxed">{{ t('settings.subtitle') }}</p>
    </section>

    <!-- Account section -->
    <section class="glass-panel p-5 md:p-6 space-y-4">
      <h2 class="text-lg font-semibold text-white flex items-center gap-2">
        <Icon name="lucide:user" class="w-5 h-5 text-surface-400" />
        {{ t('settings.account') }}
      </h2>
      <div class="space-y-3">
        <div class="flex items-center justify-between py-2 border-b border-surface-800">
          <span class="text-sm text-surface-400">{{ t('settings.name') }}</span>
          <span class="text-sm text-surface-200">{{ user?.name }}</span>
        </div>
        <div class="flex items-center justify-between py-2 border-b border-surface-800">
          <span class="text-sm text-surface-400">{{ t('settings.email') }}</span>
          <span class="text-sm text-surface-200">{{ user?.email }}</span>
        </div>

        <div class="flex items-center justify-between py-2">
          <span class="text-sm text-surface-400">{{ t('settings.since') }}</span>
          <span class="text-sm text-surface-200">{{ formatDate(userInfo?.created_at) }}</span>
        </div>
      </div>
    </section>

    <!-- Change password section -->
    <section class="glass-panel p-5 md:p-6 space-y-4">
      <h2 class="text-lg font-semibold text-white flex items-center gap-2">
        <Icon name="lucide:key-round" class="w-5 h-5 text-surface-400" />
        {{ t('settings.changePwd') }}
      </h2>

      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
          <label for="currentPwd" class="block text-sm font-medium text-surface-300 mb-1">{{ t('settings.currentPwd') }}</label>
          <input
            id="currentPwd"
            v-model="pwdForm.currentPassword"
            type="password"
            required
            class="input-field"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label for="newPwd" class="block text-sm font-medium text-surface-300 mb-1">{{ t('settings.newPwd') }}</label>
          <input
            id="newPwd"
            v-model="pwdForm.newPassword"
            type="password"
            required
            minlength="8"
            class="input-field"
            :placeholder="t('settings.newPwdPlaceholder')"
          />
        </div>
        <div>
          <label for="confirmPwd" class="block text-sm font-medium text-surface-300 mb-1">{{ t('settings.confirmPwd') }}</label>
          <input
            id="confirmPwd"
            v-model="pwdForm.confirmPassword"
            type="password"
            required
            class="input-field"
            placeholder="••••••••"
          />
        </div>

        <div v-if="pwdError" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {{ pwdError }}
        </div>
        <div v-if="pwdSuccess" class="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400">
          {{ pwdSuccess }}
        </div>

        <button type="submit" :disabled="pwdLoading" class="btn-primary">
          <span v-if="pwdLoading">{{ t('settings.changePwdBtn') }}...</span>
          <span v-else>{{ t('settings.changePwdBtn') }}</span>
        </button>
      </form>
    </section>



    <!-- Language section -->
    <section class="glass-panel p-5 md:p-6 space-y-4">
      <h2 class="text-lg font-semibold text-white flex items-center gap-2">
        <Icon name="lucide:globe" class="w-5 h-5 text-surface-400" />
        {{ t('settings.language') }}
      </h2>
      <div class="flex gap-2">
        <button
          @click="setLocale('fr')"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="locale === 'fr' ? 'bg-accent-600 text-white' : 'bg-surface-800 text-surface-400 border border-surface-700 hover:border-surface-600'"
        >
          French
        </button>
        <button
          @click="setLocale('en')"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="locale === 'en' ? 'bg-accent-600 text-white' : 'bg-surface-800 text-surface-400 border border-surface-700 hover:border-surface-600'"
        >
          English
        </button>
      </div>
    </section>

    <!-- Support -->
    <section class="glass-panel p-5 md:p-6 space-y-4">
      <h2 class="text-lg font-semibold text-white flex items-center gap-2">
        <Icon name="lucide:message-circle" class="w-5 h-5 text-surface-400" />
        {{ t('settings.support') }}
      </h2>
      <p class="text-sm text-surface-400">{{ t('settings.supportDesc') }}</p>
      <a href="https://discord.gg/J9xmQchpX6" target="_blank" class="btn-secondary inline-flex items-center gap-2">
        <Icon name="lucide:message-circle" class="w-4 h-4" />
        {{ t('settings.joinDiscord') }}
      </a>
    </section>

    <!-- Security section -->
    <section class="card space-y-4">
      <h2 class="text-lg font-semibold text-white flex items-center gap-2">
        <Icon name="lucide:shield" class="w-5 h-5 text-surface-400" />
        {{ t('settings.security') }}
      </h2>
      <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
        <p class="text-sm text-surface-400 leading-relaxed">
          {{ t('settings.securityDesc') }}
        </p>
      </div>
    </section>

    <!-- Master password -->
    <section class="glass-panel p-5 md:p-6 space-y-4">
      <h2 class="text-lg font-semibold text-white flex items-center gap-2">
        <Icon name="lucide:key-round" class="w-5 h-5 text-surface-400" />
        {{ t('settings.masterPwdTitle') }}
      </h2>

      <p class="text-sm text-surface-400 leading-relaxed">
        {{ t('settings.masterPwdDesc') }}
      </p>

      <form @submit.prevent="handleChangeMasterPassword" class="space-y-4">
        <div>
          <label for="currentMasterPassword" class="block text-sm font-medium text-surface-300 mb-1">
            {{ t('settings.masterPwdCurrent') }}
          </label>
          <input
            id="currentMasterPassword"
            v-model="masterPwdForm.currentPassword"
            type="password"
            class="input-field"
            :placeholder="t('settings.masterPwdCurrentPlaceholder')"
          />
        </div>
        <div>
          <label for="newMasterPassword" class="block text-sm font-medium text-surface-300 mb-1">
            {{ t('settings.masterPwdNew') }}
          </label>
          <input
            id="newMasterPassword"
            v-model="masterPwdForm.newPassword"
            type="password"
            required
            minlength="8"
            class="input-field"
            :placeholder="t('settings.masterPwdNewPlaceholder')"
          />
        </div>
        <div>
          <label for="confirmMasterPassword" class="block text-sm font-medium text-surface-300 mb-1">
            {{ t('settings.masterPwdConfirm') }}
          </label>
          <input
            id="confirmMasterPassword"
            v-model="masterPwdForm.confirmPassword"
            type="password"
            required
            class="input-field"
            :placeholder="t('settings.masterPwdConfirmPlaceholder')"
          />
        </div>

        <div v-if="masterPwdError" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {{ masterPwdError }}
        </div>
        <div v-if="masterPwdSuccess" class="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400">
          {{ masterPwdSuccess }}
        </div>

        <div class="flex flex-wrap gap-2">
          <button type="submit" :disabled="masterPwdLoading" class="btn-primary">
            <span v-if="masterPwdLoading">{{ t('settings.masterPwdSaving') }}...</span>
            <span v-else>{{ t('settings.masterPwdSave') }}</span>
          </button>
          <button type="button" @click="handleLockVault" class="btn-secondary">
            {{ t('settings.lockVault') }}
          </button>
        </div>
      </form>
    </section>

    <!-- Security preferences -->
    <section class="glass-panel p-5 md:p-6 space-y-5">
      <h2 class="text-lg font-semibold text-white flex items-center gap-2">
        <Icon name="lucide:sliders-horizontal" class="w-5 h-5 text-surface-400" />
        {{ t('settings.securityPrefs') }}
      </h2>

      <div class="space-y-2">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-surface-200">{{ t('settings.autoLock') }}</p>
            <p class="text-xs text-surface-500">{{ t('settings.autoLockDesc') }}</p>
          </div>
          <select v-model="securitySettings.autoLockMinutes" class="input-field max-w-40">
            <option :value="1">1 min</option>
            <option :value="5">5 min</option>
            <option :value="15">15 min</option>
            <option :value="30">30 min</option>
            <option :value="0">{{ t('settings.disabled') }}</option>
          </select>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-surface-200">{{ t('settings.clipboardClear') }}</p>
            <p class="text-xs text-surface-500">{{ t('settings.clipboardClearDesc') }}</p>
          </div>
          <select v-model="securitySettings.clipboardClearSeconds" class="input-field max-w-40">
            <option :value="15">15 s</option>
            <option :value="30">30 s</option>
            <option :value="60">60 s</option>
            <option :value="0">{{ t('settings.disabled') }}</option>
          </select>
        </div>
      </div>

      <label class="flex items-start gap-3 text-sm text-surface-300 cursor-pointer">
        <input v-model="securitySettings.hideDecryptedByDefault" type="checkbox" class="mt-1" />
        <span>
          {{ t('settings.hideDecrypted') }}
          <span class="block text-xs text-surface-500 mt-0.5">{{ t('settings.hideDecryptedDesc') }}</span>
        </span>
      </label>

      <div class="flex flex-wrap gap-2 pt-2">
        <button class="btn-primary" @click="saveSecuritySettings">{{ t('settings.save') }}</button>
        <button class="btn-secondary" @click="resetMasterOnboarding">{{ t('settings.resetOnboarding') }}</button>
      </div>

      <div v-if="securitySaved" class="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400">
        {{ t('settings.saved') }}
      </div>
    </section>

    <!-- Danger zone -->
    <section class="card border-red-500/20 space-y-4">
      <h2 class="text-lg font-semibold text-red-400 flex items-center gap-2">
        <Icon name="lucide:alert-triangle" class="w-5 h-5" />
        {{ t('settings.danger') }}
      </h2>

      <div class="space-y-4">
        <button @click="handleSignOut" class="btn-secondary flex items-center gap-2">
          <Icon name="lucide:log-out" class="w-4 h-4" />
          {{ t('settings.logout') }}
        </button>

        <div class="border-t border-surface-800 pt-4">
          <p class="text-sm text-surface-400 mb-3">
            {{ t('settings.deleteWarning') }}
          </p>

          <div v-if="!showDeleteConfirm">
            <button @click="showDeleteConfirm = true" class="btn-danger flex items-center gap-2">
              <Icon name="lucide:trash-2" class="w-4 h-4" />
              {{ t('settings.deleteBtn') }}
            </button>
          </div>

          <div v-else class="space-y-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
            <p class="text-sm text-red-300 font-medium">{{ t('settings.deleteConfirm') }}</p>
            <input
              v-model="deletePassword"
              type="password"
              class="input-field"
              :placeholder="t('settings.yourPassword')"
            />
            <div v-if="deleteError" class="text-sm text-red-400">{{ deleteError }}</div>
            <div class="flex gap-2">
              <button @click="handleDeleteAccount" :disabled="deleteLoading" class="btn-danger flex items-center gap-2">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
                <span v-if="deleteLoading">{{ t('settings.deleting') }}</span>
                <span v-else>{{ t('settings.confirmDelete') }}</span>
              </button>
              <button @click="showDeleteConfirm = false; deletePassword = ''" class="btn-secondary">
                {{ t('settings.cancel') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const { user, signOut } = useAuthClient()
const { locale, setLocale, t } = useLang()
const { fetchItems, reencryptVault } = useVault()
const { masterPassword, setMasterPassword, clearMasterPassword, isUnlocked } = useMasterPassword()

const userInfo = ref<any>(null)
const securitySaved = ref(false)
const masterPwdLoading = ref(false)
const masterPwdError = ref('')
const masterPwdSuccess = ref('')
const securitySettings = reactive({
  autoLockMinutes: 5,
  clipboardClearSeconds: 30,
  hideDecryptedByDefault: true,
})

onMounted(async () => {
  try {
    userInfo.value = await $fetch('/api/auth/me')
  } catch {}
  loadSecuritySettings()
  await fetchItems()
})

// Change password
const pwdForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const pwdLoading = ref(false)
const pwdError = ref('')
const pwdSuccess = ref('')

async function handleChangePassword() {
  pwdError.value = ''
  pwdSuccess.value = ''

  if (pwdForm.newPassword !== pwdForm.confirmPassword) {
    pwdError.value = t('settings.pwdMismatch')
    return
  }

  pwdLoading.value = true
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword },
    })
    pwdSuccess.value = t('settings.pwdSuccess')
    pwdForm.currentPassword = ''
    pwdForm.newPassword = ''
    pwdForm.confirmPassword = ''
  } catch (err: any) {
    pwdError.value = err.data?.message || t('settings.pwdError')
  } finally {
    pwdLoading.value = false
  }
}

// Delete account
const showDeleteConfirm = ref(false)
const deletePassword = ref('')
const deleteLoading = ref(false)
const deleteError = ref('')

async function handleDeleteAccount() {
  if (!deletePassword.value) {
    deleteError.value = t('settings.deleteRequired')
    return
  }
  deleteError.value = ''
  deleteLoading.value = true
  try {
    await $fetch('/api/auth/delete-account', {
      method: 'POST',
      body: { password: deletePassword.value },
    })
    navigateTo('/')
  } catch (err: any) {
    deleteError.value = err.data?.message || t('settings.deleteError')
  } finally {
    deleteLoading.value = false
  }
}

function formatDate(date: string | undefined) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function handleSignOut() {
  signOut()
}

function handleLockVault() {
  clearMasterPassword()
  navigateTo('/auth/locked?reason=manual')
}

function loadSecuritySettings() {
  securitySettings.autoLockMinutes = Number(localStorage.getItem('bitlock.security.autoLockMinutes') || 5)
  securitySettings.clipboardClearSeconds = Number(localStorage.getItem('bitlock.security.clipboardClearSeconds') || 30)
  securitySettings.hideDecryptedByDefault = localStorage.getItem('bitlock.security.hideDecryptedByDefault') !== 'false'
}

function saveSecuritySettings() {
  localStorage.setItem('bitlock.security.autoLockMinutes', String(securitySettings.autoLockMinutes))
  localStorage.setItem('bitlock.security.clipboardClearSeconds', String(securitySettings.clipboardClearSeconds))
  localStorage.setItem('bitlock.security.hideDecryptedByDefault', String(securitySettings.hideDecryptedByDefault))
  window.dispatchEvent(new Event('bitlock-security-settings-changed'))
  securitySaved.value = true
  setTimeout(() => { securitySaved.value = false }, 2000)
}

function resetMasterOnboarding() {
  localStorage.removeItem('bitlock.masterPasswordOnboarded')
  localStorage.removeItem('bitlock.masterPasswordOnboardingSnoozedUntil')
  securitySaved.value = true
  setTimeout(() => { securitySaved.value = false }, 2000)
}

const masterPwdForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

async function handleChangeMasterPassword() {
  masterPwdError.value = ''
  masterPwdSuccess.value = ''

  if (masterPwdForm.newPassword !== masterPwdForm.confirmPassword) {
    masterPwdError.value = t('settings.masterPwdMismatch')
    return
  }

  masterPwdLoading.value = true

  try {
    await reencryptVault(masterPwdForm.currentPassword || (isUnlocked.value ? masterPassword.value || '' : ''), masterPwdForm.newPassword)
    setMasterPassword(masterPwdForm.newPassword)
    masterPwdForm.currentPassword = ''
    masterPwdForm.newPassword = ''
    masterPwdForm.confirmPassword = ''
    masterPwdSuccess.value = t('settings.masterPwdSuccess')
  } catch (err: any) {
    masterPwdError.value = err.data?.message || err.message || t('settings.masterPwdError')
  } finally {
    masterPwdLoading.value = false
  }
}

function lockMasterPassword() {
  clearMasterPassword()
  masterPwdSuccess.value = t('settings.masterPwdLocked')
}
</script>
