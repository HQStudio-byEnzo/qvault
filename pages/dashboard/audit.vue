<template>
  <div class="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-white">Audit de securite</h1>
      <p class="text-surface-400 text-sm mt-1">Analyse zero-knowledge des risques visibles dans votre coffre</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card">
        <p class="text-xs text-surface-500 mb-2">Score</p>
        <p class="text-3xl font-bold" :class="scoreColor">{{ securityScore }}%</p>
      </div>
      <div class="card">
        <p class="text-xs text-surface-500 mb-2">Alertes hautes</p>
        <p class="text-3xl font-bold text-red-400">{{ highIssues.length }}</p>
      </div>
      <div class="card">
        <p class="text-xs text-surface-500 mb-2">A corriger</p>
        <p class="text-3xl font-bold text-yellow-400">{{ mediumIssues.length }}</p>
      </div>
      <div class="card">
        <p class="text-xs text-surface-500 mb-2">Elements</p>
        <p class="text-3xl font-bold text-white">{{ items.length }}</p>
      </div>
    </div>

    <div class="bg-surface-900 border border-accent-500/20 rounded-xl p-4 flex items-start gap-3">
      <Icon name="lucide:shield-check" class="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
      <p class="text-sm text-surface-400">
        L'audit ne dechiffre pas vos secrets. Il inspecte les metadonnees, le format de chiffrement, les doublons visibles et les anciens items non chiffres.
      </p>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="w-6 h-6 text-accent-400 animate-spin" />
    </div>

    <div v-else-if="issues.length === 0" class="text-center py-16">
      <Icon name="lucide:shield-check" class="w-12 h-12 text-green-500 mx-auto mb-4" />
      <p class="text-surface-300 font-medium">Aucun risque visible detecte.</p>
      <p class="text-sm text-surface-500 mt-1">Votre coffre respecte les controles zero-knowledge disponibles.</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="issue in issues"
        :key="issue.key"
        class="bg-surface-900 border rounded-xl p-4"
        :class="issue.severity === 'high' ? 'border-red-500/30' : issue.severity === 'medium' ? 'border-yellow-500/30' : 'border-surface-700'"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="issue.severity === 'high' ? 'bg-red-500/10' : issue.severity === 'medium' ? 'bg-yellow-500/10' : 'bg-surface-800'"
            >
              <Icon :name="issue.icon" class="w-5 h-5" :class="issue.severity === 'high' ? 'text-red-400' : issue.severity === 'medium' ? 'text-yellow-400' : 'text-surface-400'" />
            </div>
            <div>
              <p class="text-sm font-medium text-white">{{ issue.title }}</p>
              <p class="text-sm text-surface-400 mt-1">{{ issue.description }}</p>
              <p class="text-xs text-surface-500 mt-2">{{ issue.action }}</p>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-medium" :class="issue.severity === 'high' ? 'bg-red-500/10 text-red-400' : issue.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-surface-800 text-surface-400'">
            {{ severityLabel[issue.severity] }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VaultItem } from '~/composables/useVault'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { items, loading, fetchItems } = useVault()

type Severity = 'high' | 'medium' | 'low'

interface AuditIssue {
  key: string
  severity: Severity
  icon: string
  title: string
  description: string
  action: string
}

const severityLabel: Record<Severity, string> = {
  high: 'Critique',
  medium: 'Important',
  low: 'Info',
}

const issues = computed<AuditIssue[]>(() => {
  const result: AuditIssue[] = []
  const vaultItems = items.value
  const unencrypted = vaultItems.filter(item => !item.is_encrypted)
  const invalidEncrypted = vaultItems.filter(item => item.is_encrypted && (!item.iv || !hasEncryptedPayload(item)))
  const passwordWithoutUrl = vaultItems.filter(item => item.type === 'password' && !item.url)
  const duplicateUrls = findDuplicates(vaultItems.filter(item => item.url), item => normalizeUrl(item.url || ''))
  const duplicateLabels = findDuplicates(vaultItems, item => item.label.trim().toLowerCase()).filter(group => group.key)
  const oldItems = vaultItems.filter(item => daysSince(item.updated_at || item.created_at) >= 180)

  if (unencrypted.length) {
    result.push({
      key: 'unencrypted',
      severity: 'high',
      icon: 'lucide:unlock',
      title: `${unencrypted.length} element(s) non chiffre(s)`,
      description: 'Ces anciens items exposent leur payload cote serveur et dans les exports.',
      action: 'Recreez-les avec un mot de passe maitre puis supprimez les anciennes versions.',
    })
  }

  if (invalidEncrypted.length) {
    result.push({
      key: 'invalid-encrypted',
      severity: 'high',
      icon: 'lucide:file-warning',
      title: `${invalidEncrypted.length} element(s) chiffre(s) semblent corrompus`,
      description: 'Ils n ont pas de iv ou pas de payload au format salt:ciphertext.',
      action: 'Exportez un backup, puis remplacez les items concernes par une nouvelle sauvegarde chiffree.',
    })
  }

  if (passwordWithoutUrl.length) {
    result.push({
      key: 'password-missing-url',
      severity: 'medium',
      icon: 'lucide:link-2-off',
      title: `${passwordWithoutUrl.length} mot(s) de passe sans URL`,
      description: 'Sans URL, l extension ne peut pas les associer automatiquement au bon site.',
      action: 'Ajoutez le site officiel dans chaque item password.',
    })
  }

  duplicateUrls.forEach(group => {
    result.push({
      key: `duplicate-url-${group.key}`,
      severity: 'medium',
      icon: 'lucide:copy',
      title: `${group.items.length} items partagent le site ${group.key}`,
      description: group.items.map(item => item.label || 'Sans titre').join(', '),
      action: 'Verifiez que ces doublons sont voulus et supprimez les anciennes versions.',
    })
  })

  duplicateLabels.slice(0, 5).forEach(group => {
    result.push({
      key: `duplicate-label-${group.key}`,
      severity: 'low',
      icon: 'lucide:tags',
      title: `${group.items.length} items ont le meme libelle`,
      description: group.items.map(item => item.type).join(', '),
      action: 'Renommez-les pour rendre la recherche et les exports plus lisibles.',
    })
  })

  if (oldItems.length) {
    result.push({
      key: 'old-items',
      severity: 'low',
      icon: 'lucide:calendar-clock',
      title: `${oldItems.length} element(s) n ont pas ete modifies depuis 180 jours`,
      description: 'Les vieux secrets meritent une verification reguliere.',
      action: 'Passez-les en revue et remplacez les mots de passe importants.',
    })
  }

  return result
})

const highIssues = computed(() => issues.value.filter(issue => issue.severity === 'high'))
const mediumIssues = computed(() => issues.value.filter(issue => issue.severity === 'medium'))

const securityScore = computed(() => {
  const penalty = issues.value.reduce((sum, issue) => sum + (issue.severity === 'high' ? 25 : issue.severity === 'medium' ? 12 : 5), 0)
  return Math.max(0, 100 - penalty)
})

const scoreColor = computed(() => {
  if (securityScore.value >= 80) return 'text-green-400'
  if (securityScore.value >= 55) return 'text-yellow-400'
  return 'text-red-400'
})

function hasEncryptedPayload(item: VaultItem) {
  return typeof item.payload === 'string' && item.payload.split(':').length === 2
}

function normalizeUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url.toLowerCase()
  }
}

function daysSince(date: string | undefined) {
  if (!date) return 0
  const timestamp = new Date(date).getTime()
  if (Number.isNaN(timestamp)) return 0
  return Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000))
}

function findDuplicates(itemsToGroup: VaultItem[], getKey: (item: VaultItem) => string) {
  const groups = new Map<string, VaultItem[]>()
  itemsToGroup.forEach(item => {
    const key = getKey(item)
    if (!key) return
    groups.set(key, [...(groups.get(key) || []), item])
  })

  return Array.from(groups.entries())
    .filter(([, group]) => group.length > 1)
    .map(([key, group]) => ({ key, items: group }))
}

onMounted(() => {
  fetchItems()
})
</script>
