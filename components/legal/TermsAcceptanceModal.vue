<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-2xl glass-panel p-5 md:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 class="text-xl font-semibold text-white">{{ t('legal.acceptTitle') }}</h2>
              <p class="text-sm text-surface-400 mt-1">
                {{ t('legal.acceptDesc') }}
              </p>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-accent-600/20 flex items-center justify-center flex-shrink-0 border border-white/10">
              <Icon name="lucide:file-text" class="w-5 h-5 text-accent-400" />
            </div>
          </div>

          <div class="grid gap-3 mb-6">
            <NuxtLink to="/legal/cgu" class="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
              <span class="text-sm font-medium text-surface-200">{{ t('footer.terms') }}</span>
              <Icon name="lucide:arrow-up-right" class="w-4 h-4 text-surface-500" />
            </NuxtLink>
            <NuxtLink to="/legal/confidentialite" class="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
              <span class="text-sm font-medium text-surface-200">{{ t('footer.privacy') }}</span>
              <Icon name="lucide:arrow-up-right" class="w-4 h-4 text-surface-500" />
            </NuxtLink>
            <NuxtLink to="/legal/mentions-legales" class="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
              <span class="text-sm font-medium text-surface-200">{{ t('footer.legalNotice') }}</span>
              <Icon name="lucide:arrow-up-right" class="w-4 h-4 text-surface-500" />
            </NuxtLink>
          </div>

          <label class="flex items-start gap-3 text-sm text-surface-300 cursor-pointer mb-6">
            <input v-model="accepted" type="checkbox" class="mt-1" />
            <span class="leading-relaxed">
              {{ t('legal.acceptCheckbox') }}
            </span>
          </label>

          <div class="flex flex-col sm:flex-row gap-2">
            <button class="btn-primary" :disabled="!accepted || saving" @click="accept">
              <span v-if="saving">{{ t('legal.accepting') }}</span>
              <span v-else>{{ t('legal.acceptCta') }}</span>
            </button>
            <button class="btn-secondary" @click="logout">
              {{ t('settings.logout') }}
            </button>
          </div>

          <p v-if="error" class="mt-4 text-sm text-red-400">
            {{ error }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'

const visible = ref(false)
const accepted = ref(false)
const saving = ref(false)
const error = ref('')

const { t } = useLang()
const { signOut } = useAuthClient()

onMounted(async () => {
  try {
    const me = await $fetch<{ termsAccepted: boolean }>('/api/auth/me')
    visible.value = !me.termsAccepted
  } catch {
    visible.value = false
  }
})

async function accept() {
  saving.value = true
  error.value = ''
  try {
    await $fetch('/api/legal/accept', { method: 'POST' })
    visible.value = false
    window.location.reload()
  } catch (err: any) {
    error.value = err.data?.message || t('legal.acceptError')
  } finally {
    saving.value = false
  }
}

function logout() {
  signOut()
}
</script>
