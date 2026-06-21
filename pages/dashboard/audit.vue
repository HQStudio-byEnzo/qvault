<template>
  <div class="section-shell max-w-7xl py-10 md:py-16 space-y-6">
    <section class="hero-panel space-y-3">
      <p class="eyebrow">{{ t('sidebar.audit') }}</p>
      <h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-white">{{ t('audit.title') }}</h1>
      <p class="text-surface-300 text-base md:text-lg max-w-3xl leading-relaxed">{{ t('audit.subtitle') }}</p>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="glass-panel p-5">
        <p class="text-xs text-surface-500 mb-2">{{ t('audit.score') }}</p>
        <p class="text-3xl font-bold" :class="scoreColor">{{ securityScore }}%</p>
      </div>
      <div class="glass-panel p-5">
        <p class="text-xs text-surface-500 mb-2">{{ t('audit.highAlerts') }}</p>
        <p class="text-3xl font-bold text-red-400">{{ highIssues.length }}</p>
      </div>
      <div class="glass-panel p-5">
        <p class="text-xs text-surface-500 mb-2">{{ t('audit.toFix') }}</p>
        <p class="text-3xl font-bold text-yellow-400">{{ mediumIssues.length }}</p>
      </div>
      <div class="glass-panel p-5">
        <p class="text-xs text-surface-500 mb-2">{{ t('audit.elements') }}</p>
        <p class="text-3xl font-bold text-white">{{ items.length }}</p>
      </div>
    </div>

    <div class="glass-panel p-4 flex items-start gap-3 border-accent-500/20 bg-accent-500/5">
      <AppIcon name="lucide:shield-check" class="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
      <p class="text-sm text-surface-400">
        {{ t('audit.notice') }}
      </p>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <AppIcon name="lucide:loader-2" class="w-6 h-6 text-accent-400 animate-spin" />
    </div>

    <div v-else-if="issues.length === 0" class="text-center py-16">
      <AppIcon name="lucide:shield-check" class="w-12 h-12 text-green-500 mx-auto mb-4" />
      <p class="text-surface-300 font-medium">{{ t('audit.empty') }}</p>
      <p class="text-sm text-surface-500 mt-1">{{ t('audit.emptyHint') }}</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="issue in issues"
        :key="issue.key"
        class="glass-panel p-4"
        :class="issue.severity === 'high' ? 'border-red-500/30' : issue.severity === 'medium' ? 'border-yellow-500/30' : 'border-surface-700'"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-3">
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              :class="issue.severity === 'high' ? 'bg-red-500/10' : issue.severity === 'medium' ? 'bg-yellow-500/10' : 'bg-surface-800'"
            >
              <AppIcon :name="issue.icon" class="w-5 h-5" :class="issue.severity === 'high' ? 'text-red-400' : issue.severity === 'medium' ? 'text-yellow-400' : 'text-surface-400'" />
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

const { t } = useLang()
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

const severityLabel = computed<Record<Severity, string>>(() => ({
  high: t('audit.severityHigh'),
  medium: t('audit.severityMedium'),
  low: t('audit.severityLow'),
}))

const issues = computed<AuditIssue[]>(() => {
  const result: AuditIssue[] = []
  const vaultItems = items.value
  const unencrypted = vaultItems.filter(item => !item.is_encrypted && item.type !== 'link')
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
      title: `${unencrypted.length} ${t('audit.unencryptedTitle')}`,
      description: t('audit.unencryptedDesc'),
      action: t('audit.unencryptedAction'),
    })
  }

  if (invalidEncrypted.length) {
    result.push({
      key: 'invalid-encrypted',
      severity: 'high',
      icon: 'lucide:file-warning',
      title: `${invalidEncrypted.length} ${t('audit.invalidTitle')}`,
      description: t('audit.invalidDesc'),
      action: t('audit.invalidAction'),
    })
  }

  if (passwordWithoutUrl.length) {
    result.push({
      key: 'password-missing-url',
      severity: 'medium',
      icon: 'lucide:link-2-off',
      title: `${passwordWithoutUrl.length} ${t('audit.noUrlTitle')}`,
      description: t('audit.noUrlDesc'),
      action: t('audit.noUrlAction'),
    })
  }

  duplicateUrls.forEach(group => {
    result.push({
      key: `duplicate-url-${group.key}`,
      severity: 'medium',
      icon: 'lucide:copy',
      title: `${group.items.length} ${t('audit.dupUrlTitle')} ${group.key}`,
      description: group.items.map(item => item.label || t('vault.untitled')).join(', '),
      action: t('audit.dupUrlDesc'),
    })
  })

  duplicateLabels.slice(0, 5).forEach(group => {
    result.push({
      key: `duplicate-label-${group.key}`,
      severity: 'low',
      icon: 'lucide:tags',
      title: `${group.items.length} ${t('audit.dupLabelTitle')}`,
      description: group.items.map(item => item.type).join(', '),
      action: t('audit.dupLabelAction'),
    })
  })

  if (oldItems.length) {
    result.push({
      key: 'old-items',
      severity: 'low',
      icon: 'lucide:calendar-clock',
      title: `${oldItems.length} ${t('audit.oldTitle')}`,
      description: t('audit.oldDesc'),
      action: t('audit.oldAction'),
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
