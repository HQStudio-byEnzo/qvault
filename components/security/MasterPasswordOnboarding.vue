<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-lg bg-surface-900 border border-surface-700 rounded-xl p-6 shadow-2xl">
          <div class="flex items-start gap-4">
            <div class="w-11 h-11 rounded-lg bg-accent-600/20 flex items-center justify-center flex-shrink-0">
              <Icon name="lucide:key-round" class="w-5 h-5 text-accent-400" />
            </div>
            <div class="space-y-3">
              <div>
                <h2 class="text-lg font-semibold text-white">Choisissez votre mot de passe maitre</h2>
                <p class="text-sm text-surface-400 mt-1">
                  Il sert a chiffrer et dechiffrer tout votre coffre dans ce navigateur. Kipit ne le stocke pas et ne peut pas le recuperer.
                </p>
              </div>

              <div class="grid gap-2 text-sm text-surface-300">
                <div class="flex items-start gap-2">
                  <Icon name="lucide:check" class="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Utilisez une phrase longue et unique, differente du mot de passe de connexion.</span>
                </div>
                <div class="flex items-start gap-2">
                  <Icon name="lucide:check" class="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Gardez-la dans un endroit sur: perdre ce mot de passe rend les secrets illisibles.</span>
                </div>
                <div class="flex items-start gap-2">
                  <Icon name="lucide:check" class="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Vous pouvez le modifier dans les parametres; vos elements existants seront rechiffres avec le nouveau mot de passe.</span>
                </div>
              </div>

              <label class="flex items-start gap-2 text-sm text-surface-300 cursor-pointer">
                <input v-model="understood" type="checkbox" class="mt-1" />
                <span>Je comprends que Kipit ne peut pas recuperer mon mot de passe maitre.</span>
              </label>

              <div class="flex flex-col sm:flex-row gap-2 pt-2">
                <button :disabled="!understood" class="btn-primary" @click="complete">
                  Continuer
                </button>
                <button class="btn-secondary" @click="remindLater">
                  Me le rappeler plus tard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const visible = ref(false)
const understood = ref(false)

onMounted(() => {
  const done = localStorage.getItem('kipit.masterPasswordOnboarded') === 'true'
  const snoozedUntil = Number(localStorage.getItem('kipit.masterPasswordOnboardingSnoozedUntil') || 0)
  visible.value = !done && Date.now() > snoozedUntil
})

function complete() {
  localStorage.setItem('kipit.masterPasswordOnboarded', 'true')
  localStorage.removeItem('kipit.masterPasswordOnboardingSnoozedUntil')
  visible.value = false
}

function remindLater() {
  localStorage.setItem('kipit.masterPasswordOnboardingSnoozedUntil', String(Date.now() + 24 * 60 * 60 * 1000))
  visible.value = false
}
</script>
