<template>
  <div class="p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-white">Paramètres</h1>
      <p class="text-surface-400 text-sm mt-1">Gérez votre compte</p>
    </div>

    <!-- Account section -->
    <section class="card space-y-4">
      <h2 class="text-lg font-semibold text-white flex items-center gap-2">
        <Icon name="lucide:user" class="w-5 h-5 text-surface-400" />
        Compte
      </h2>
      <div class="space-y-3">
        <div class="flex items-center justify-between py-2 border-b border-surface-800">
          <span class="text-sm text-surface-400">Nom</span>
          <span class="text-sm text-surface-200">{{ user?.name }}</span>
        </div>
        <div class="flex items-center justify-between py-2 border-b border-surface-800">
          <span class="text-sm text-surface-400">Email</span>
          <span class="text-sm text-surface-200">{{ user?.email }}</span>
        </div>
        <div class="flex items-center justify-between py-2 border-b border-surface-800">
          <span class="text-sm text-surface-400">Email vérifié</span>
          <div class="flex items-center gap-2">
            <span v-if="user?.emailVerified" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400">
              <Icon name="lucide:check-circle" class="w-3 h-3" />
              Vérifié
            </span>
            <span v-else class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-400">
              <Icon name="lucide:alert-circle" class="w-3 h-3" />
              Non vérifié
            </span>
          </div>
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="text-sm text-surface-400">Membre depuis</span>
          <span class="text-sm text-surface-200">{{ formatDate(user?.created_at) }}</span>
        </div>
      </div>
    </section>

    <!-- Change password section -->
    <section class="card space-y-4">
      <h2 class="text-lg font-semibold text-white flex items-center gap-2">
        <Icon name="lucide:key-round" class="w-5 h-5 text-surface-400" />
        Changer le mot de passe
      </h2>

      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
          <label for="currentPwd" class="block text-sm font-medium text-surface-300 mb-1">Mot de passe actuel</label>
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
          <label for="newPwd" class="block text-sm font-medium text-surface-300 mb-1">Nouveau mot de passe</label>
          <input
            id="newPwd"
            v-model="pwdForm.newPassword"
            type="password"
            required
            minlength="8"
            class="input-field"
            placeholder="Minimum 8 caractères"
          />
        </div>
        <div>
          <label for="confirmPwd" class="block text-sm font-medium text-surface-300 mb-1">Confirmer</label>
          <input
            id="confirmPwd"
            v-model="pwdForm.confirmPassword"
            type="password"
            required
            class="input-field"
            placeholder="••••••••"
          />
        </div>

        <div v-if="pwdError" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {{ pwdError }}
        </div>
        <div v-if="pwdSuccess" class="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400">
          {{ pwdSuccess }}
        </div>

        <button type="submit" :disabled="pwdLoading" class="btn-primary">
          <span v-if="pwdLoading">Modification...</span>
          <span v-else>Modifier le mot de passe</span>
        </button>
      </form>
    </section>



    <!-- Security section -->
    <section class="card space-y-4">
      <h2 class="text-lg font-semibold text-white flex items-center gap-2">
        <Icon name="lucide:shield" class="w-5 h-5 text-surface-400" />
        Sécurité
      </h2>
      <div class="p-4 rounded-lg bg-surface-800 border border-surface-700">
        <p class="text-sm text-surface-400 leading-relaxed">
          Kipit utilise un chiffrement <strong class="text-surface-200">AES-256-GCM</strong> côté client.
          Vos données chiffrées ne sont jamais lisibles par nos serveurs. 
          Assurez-vous de ne jamais oublier votre mot de passe maître — il est impossible de récupérer des données chiffrées sans lui.
        </p>
      </div>
    </section>

    <!-- Danger zone -->
    <section class="card border-red-500/20 space-y-4">
      <h2 class="text-lg font-semibold text-red-400 flex items-center gap-2">
        <Icon name="lucide:alert-triangle" class="w-5 h-5" />
        Zone dangereuse
      </h2>

      <div class="space-y-4">
        <button @click="handleSignOut" class="btn-secondary flex items-center gap-2">
          <Icon name="lucide:log-out" class="w-4 h-4" />
          Se déconnecter
        </button>

        <div class="border-t border-surface-800 pt-4">
          <p class="text-sm text-surface-400 mb-3">
            La suppression est <strong class="text-red-400">irréversible</strong>. Toutes vos données (coffre-fort inclus) seront perdues.
          </p>

          <div v-if="!showDeleteConfirm">
            <button @click="showDeleteConfirm = true" class="btn-danger flex items-center gap-2">
              <Icon name="lucide:trash-2" class="w-4 h-4" />
              Supprimer mon compte
            </button>
          </div>

          <div v-else class="space-y-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
            <p class="text-sm text-red-300 font-medium">Confirmez avec votre mot de passe :</p>
            <input
              v-model="deletePassword"
              type="password"
              class="input-field"
              placeholder="Votre mot de passe"
            />
            <div v-if="deleteError" class="text-sm text-red-400">{{ deleteError }}</div>
            <div class="flex gap-2">
              <button @click="handleDeleteAccount" :disabled="deleteLoading" class="btn-danger flex items-center gap-2">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
                <span v-if="deleteLoading">Suppression...</span>
                <span v-else>Confirmer la suppression</span>
              </button>
              <button @click="showDeleteConfirm = false; deletePassword = ''" class="btn-secondary">
                Annuler
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

// Change password
const pwdForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const pwdLoading = ref(false)
const pwdError = ref('')
const pwdSuccess = ref('')

async function handleChangePassword() {
  pwdError.value = ''
  pwdSuccess.value = ''

  if (pwdForm.newPassword !== pwdForm.confirmPassword) {
    pwdError.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  pwdLoading.value = true
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword },
    })
    pwdSuccess.value = 'Mot de passe modifié avec succès.'
    pwdForm.currentPassword = ''
    pwdForm.newPassword = ''
    pwdForm.confirmPassword = ''
  } catch (err: any) {
    pwdError.value = err.data?.message || 'Erreur lors de la modification.'
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
    deleteError.value = 'Mot de passe requis.'
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
    deleteError.value = err.data?.message || 'Erreur lors de la suppression.'
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
</script>
