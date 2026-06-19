<template>
  <div class="min-h-screen bg-surface-950 text-white">
    <header class="border-b border-white/10 bg-surface-950/80 backdrop-blur">
      <div class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 font-semibold"><Icon name="lucide:shield" class="w-6 h-6 text-accent-300" />BitLock</NuxtLink>
        <NuxtLink to="/auth/register" class="btn-primary">Créer un coffre</NuxtLink>
      </div>
    </header>
    <main class="max-w-5xl mx-auto px-6 py-16 grid lg:grid-cols-[1fr_380px] gap-10">
      <section>
        <p class="text-accent-300 font-medium mb-3">Outil gratuit, sans connexion</p>
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-5">Générateur de mot de passe sécurisé</h1>
        <p class="text-surface-300 text-lg leading-relaxed mb-8">Générez localement un mot de passe robuste pour vos comptes. BitLock ne reçoit jamais le mot de passe généré.</p>
        <div class="card p-6 space-y-6">
          <div>
            <label class="text-sm text-surface-400">Mot de passe généré</label>
            <div class="mt-2 flex gap-2">
              <input :value="password" readonly class="input-field font-mono text-lg" />
              <button class="btn-secondary" @click="copyPassword"><Icon name="lucide:copy" class="w-5 h-5" /></button>
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <label class="space-y-2"><span class="text-sm text-surface-300">Longueur: {{ options.length }}</span><input v-model.number="options.length" type="range" min="12" max="64" class="w-full" /></label>
            <div class="rounded-xl border border-surface-700 p-4"><p class="text-sm text-surface-400">Entropie estimée</p><p class="text-2xl font-bold text-emerald-300">{{ passwordEntropy }} bits</p></div>
          </div>
          <div class="grid sm:grid-cols-2 gap-3">
            <label v-for="option in toggles" :key="option.key" class="flex items-center gap-3 rounded-xl border border-surface-700 p-3"><input v-model="options[option.key]" type="checkbox" class="rounded" /><span>{{ option.label }}</span></label>
          </div>
          <button class="btn-primary w-full py-3" @click="regenerate">Générer un nouveau mot de passe</button>
          <p v-if="copied" class="text-sm text-emerald-300">Copié dans le presse-papiers.</p>
        </div>
      </section>
      <aside class="card p-6 h-fit space-y-4">
        <h2 class="text-xl font-semibold">Bonnes pratiques</h2>
        <ul class="space-y-3 text-sm text-surface-300">
          <li>• Utilisez au moins 16 caractères pour les comptes sensibles.</li>
          <li>• Ne réutilisez jamais le même mot de passe.</li>
          <li>• Stockez vos identifiants dans un coffre chiffré.</li>
          <li>• Activez la double authentification et sauvegardez vos recovery codes.</li>
        </ul>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Générateur de mot de passe gratuit - BitLock', description: 'Créez un mot de passe fort en local, sans connexion et sans envoi serveur.' })
const { generatePassword, entropy } = usePasswordGenerator()
const options = reactive({ length: 24, uppercase: true, lowercase: true, numbers: true, symbols: true, avoidAmbiguous: true })
const password = ref('')
const copied = ref(false)
const toggles = [
  { key: 'uppercase' as const, label: 'Majuscules' }, { key: 'lowercase' as const, label: 'Minuscules' },
  { key: 'numbers' as const, label: 'Chiffres' }, { key: 'symbols' as const, label: 'Symboles' },
  { key: 'avoidAmbiguous' as const, label: 'Éviter les caractères ambigus' },
]
const passwordEntropy = computed(() => entropy(password.value, options))
function regenerate() { password.value = generatePassword(options) }
async function copyPassword() { await navigator.clipboard.writeText(password.value); copied.value = true; setTimeout(() => copied.value = false, 1600) }
watch(options, regenerate, { deep: true })
onMounted(regenerate)
</script>
