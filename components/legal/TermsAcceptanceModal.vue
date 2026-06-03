<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-2xl bg-surface-900 border border-surface-700 rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 class="text-xl font-semibold text-white">Acceptez les documents legaux</h2>
              <p class="text-sm text-surface-400 mt-1">
                Nous avons mis a jour les conditions de Kipit. Pour continuer, vous devez accepter les CGU, la politique de confidentialite et les mentions legales.
              </p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-accent-600/20 flex items-center justify-center flex-shrink-0">
              <Icon name="lucide:file-text" class="w-5 h-5 text-accent-400" />
            </div>
          </div>

          <div class="grid gap-3 mb-6">
            <NuxtLink to="/legal/cgu" class="flex items-center justify-between gap-3 p-4 rounded-lg bg-surface-800 border border-surface-700 hover:border-surface-600 transition-colors">
              <span class="text-sm font-medium text-surface-200">CGU</span>
              <Icon name="lucide:arrow-up-right" class="w-4 h-4 text-surface-500" />
            </NuxtLink>
            <NuxtLink to="/legal/confidentialite" class="flex items-center justify-between gap-3 p-4 rounded-lg bg-surface-800 border border-surface-700 hover:border-surface-600 transition-colors">
              <span class="text-sm font-medium text-surface-200">Politique de confidentialite</span>
              <Icon name="lucide:arrow-up-right" class="w-4 h-4 text-surface-500" />
            </NuxtLink>
            <NuxtLink to="/legal/mentions-legales" class="flex items-center justify-between gap-3 p-4 rounded-lg bg-surface-800 border border-surface-700 hover:border-surface-600 transition-colors">
              <span class="text-sm font-medium text-surface-200">Mentions legales</span>
              <Icon name="lucide:arrow-up-right" class="w-4 h-4 text-surface-500" />
            </NuxtLink>
          </div>

          <label class="flex items-start gap-3 text-sm text-surface-300 cursor-pointer mb-6">
            <input v-model="accepted" type="checkbox" class="mt-1" />
            <span class="leading-relaxed">
              J'ai lu et j'accepte l'ensemble des documents ci-dessus pour continuer a utiliser Kipit.
            </span>
          </label>

          <div class="flex flex-col sm:flex-row gap-2">
            <button class="btn-primary" :disabled="!accepted || saving" @click="accept">
              <span v-if="saving">Validation...</span>
              <span v-else>Accepter et continuer</span>
            </button>
            <button class="btn-secondary" @click="logout">
              Se deconnecter
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
const visible = ref(false)
const accepted = ref(false)
const saving = ref(false)
const error = ref('')

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
    error.value = err.data?.message || 'Impossible de valider les documents.'
  } finally {
    saving.value = false
  }
}

function logout() {
  signOut()
}
</script>
