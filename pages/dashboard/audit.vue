<template>
  <div class="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-white">Audit de sécurité</h1>
      <p class="text-surface-400 text-sm mt-1">Vérifiez la robustesse de vos mots de passe</p>
    </div>

    <!-- Overall Health -->
    <div class="bg-surface-900 border border-surface-700 rounded-xl p-6">
      <div class="flex items-center gap-4">
        <div class="relative w-20 h-20">
          <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
            <path
              class="text-surface-700"
              stroke="currentColor"
              stroke-width="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              :class="healthColor"
              stroke="currentColor"
              stroke-width="3"
              fill="none"
              stroke-linecap="round"
              :stroke-dasharray="`${healthPercentage}, 100`"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span class="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
            {{ healthPercentage }}%
          </span>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-white">Santé du coffre-fort</h2>
          <p class="text-sm text-surface-400">
            {{ strongCount }} fort(s), {{ mediumCount }} moyen(s), {{ weakCount }} faible(s)
          </p>
        </div>
      </div>
    </div>

    <!-- Encryption notice -->
    <div class="bg-surface-900 border border-accent-500/20 rounded-xl p-4 flex items-start gap-3">
      <Icon name="lucide:info" class="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
      <p class="text-sm text-surface-400">
        Password audit only works with previously saved unencrypted passwords. All new passwords are encrypted.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="w-6 h-6 text-accent-400 animate-spin" />
    </div>

    <!-- No passwords -->
    <div v-else-if="passwordItems.length === 0" class="text-center py-16">
      <Icon name="lucide:shield-alert" class="w-12 h-12 text-surface-600 mx-auto mb-4" />
      <p class="text-surface-400">Aucun mot de passe non chiffré à auditer.</p>
      <p class="text-sm text-surface-500 mt-1">Seuls les mots de passe non chiffrés peuvent être analysés.</p>
    </div>

    <!-- Password list -->
    <div v-else class="space-y-3">
      <div
        v-for="item in auditResults"
        :key="item.id"
        class="bg-surface-900 border border-surface-700 rounded-xl p-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center"
            :class="gradeStyles[item.grade].bg"
          >
            <Icon name="lucide:key-round" class="w-5 h-5" :class="gradeStyles[item.grade].icon" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ item.label }}</p>
            <p class="text-xs text-surface-500">{{ item.details }}</p>
          </div>
        </div>
        <span
          class="px-3 py-1 rounded-full text-xs font-medium"
          :class="gradeStyles[item.grade].badge"
        >
          {{ item.grade }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { items, loading, fetchItems } = useVault()

// Only audit non-encrypted password items
const passwordItems = computed(() =>
  items.value.filter(item => item.type === 'password' && !item.is_encrypted)
)

interface AuditResult {
  id: string
  label: string
  grade: 'Fort' | 'Moyen' | 'Faible'
  score: number
  details: string
}

const gradeStyles = {
  Fort: {
    bg: 'bg-green-600/20',
    icon: 'text-green-400',
    badge: 'bg-green-500/10 text-green-400 border border-green-500/20',
  },
  Moyen: {
    bg: 'bg-yellow-600/20',
    icon: 'text-yellow-400',
    badge: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  },
  Faible: {
    bg: 'bg-red-600/20',
    icon: 'text-red-400',
    badge: 'bg-red-500/10 text-red-400 border border-red-500/20',
  },
}

function checkPasswordStrength(password: string): { score: number; grade: 'Fort' | 'Moyen' | 'Faible'; details: string } {
  let score = 0
  const checks: string[] = []

  // Length checks
  if (password.length >= 8) { score += 1; checks.push('8+ car.') }
  if (password.length >= 12) { score += 1; checks.push('12+ car.') }
  if (password.length >= 16) { score += 1; checks.push('16+ car.') }

  // Character variety
  if (/[a-z]/.test(password)) { score += 1; checks.push('minuscules') }
  if (/[A-Z]/.test(password)) { score += 1; checks.push('majuscules') }
  if (/[0-9]/.test(password)) { score += 1; checks.push('chiffres') }
  if (/[^a-zA-Z0-9]/.test(password)) { score += 1; checks.push('spéciaux') }

  let grade: 'Fort' | 'Moyen' | 'Faible'
  if (score >= 6) grade = 'Fort'
  else if (score >= 4) grade = 'Moyen'
  else grade = 'Faible'

  return { score, grade, details: checks.join(', ') }
}

const auditResults = computed<AuditResult[]>(() =>
  passwordItems.value.map(item => {
    const { score, grade, details } = checkPasswordStrength(item.payload)
    return {
      id: item.id,
      label: item.label,
      grade,
      score,
      details,
    }
  })
)

const strongCount = computed(() => auditResults.value.filter(r => r.grade === 'Fort').length)
const mediumCount = computed(() => auditResults.value.filter(r => r.grade === 'Moyen').length)
const weakCount = computed(() => auditResults.value.filter(r => r.grade === 'Faible').length)

const healthPercentage = computed(() => {
  if (auditResults.value.length === 0) return 100
  const maxScore = 7
  const totalScore = auditResults.value.reduce((sum, r) => sum + r.score, 0)
  const maxPossible = auditResults.value.length * maxScore
  return Math.round((totalScore / maxPossible) * 100)
})

const healthColor = computed(() => {
  if (healthPercentage.value >= 70) return 'text-green-500'
  if (healthPercentage.value >= 40) return 'text-yellow-500'
  return 'text-red-500'
})

onMounted(() => {
  fetchItems()
})
</script>
