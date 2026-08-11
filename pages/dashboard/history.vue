<template>
  <div class="section-shell max-w-6xl py-10 md:py-16 space-y-6">
    <section class="hero-panel"><p class="eyebrow">{{ t('history.eyebrow') }}</p><h1 class="mt-3 text-3xl md:text-4xl font-semibold text-white">{{ t('history.title') }}</h1><p class="mt-3 text-surface-300">{{ t('history.subtitle') }}</p></section>
    <section class="glass-panel p-5 space-y-4">
      <label class="text-sm text-surface-300">{{ t('history.select') }}</label>
      <select v-model="selectedId" class="input-field"><option value="">{{ t('history.selectPlaceholder') }}</option><option v-for="item in items" :key="item.id" :value="item.id">{{ item.label || item.type }}</option></select>
    </section>
    <section v-if="selectedId" class="glass-panel p-5 md:p-6">
      <div v-if="loading" class="text-surface-400">{{ t('common.loading') }}</div>
      <div v-else-if="versions.length === 0" class="text-sm text-surface-400">{{ t('history.empty') }}</div>
      <ol v-else class="divide-y divide-white/10">
        <li v-for="version in versions" :key="version.id" class="flex flex-col sm:flex-row sm:items-center gap-4 py-4">
          <span class="flex h-9 w-9 items-center justify-center border border-accent-500/30 font-mono text-sm text-accent-300">v{{ version.version }}</span>
          <div class="flex-1"><p class="text-sm text-white">{{ version.label || t('vault.untitled') }}</p><p class="mt-1 text-xs text-surface-500">{{ formatDate(version.created_at) }} · {{ version.is_encrypted ? 'AES-256-GCM' : t('history.plain') }}</p></div>
          <button class="btn-secondary" :disabled="restoring === version.id" @click="restore(version.id)"><Icon name="lucide:rotate-ccw" class="w-4 h-4" />{{ t('history.restore') }}</button>
        </li>
      </ol>
      <p v-if="message" class="mt-4 text-sm" :class="failed ? 'text-red-400' : 'text-accent-300'">{{ message }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { t, locale } = useLang()
const { items, fetchItems } = useVault()
const selectedId = ref(''), versions = ref<any[]>([]), loading = ref(false), restoring = ref(''), message = ref(''), failed = ref(false)
async function loadHistory() { if (!selectedId.value) return; loading.value = true; try { const data: { history: any[] } = await $fetch(`/api/vault/${selectedId.value}/history`); versions.value = data.history } finally { loading.value = false } }
async function restore(historyId: string) { restoring.value = historyId; message.value = ''; failed.value = false; try { await $fetch(`/api/vault/${selectedId.value}/restore`, { method: 'POST', body: { history_id: historyId } }); message.value = t('history.restored'); await Promise.all([loadHistory(), fetchItems()]) } catch { failed.value = true; message.value = t('history.failed') } finally { restoring.value = '' } }
function formatDate(value: string) { return new Date(value).toLocaleString(locale.value === 'fr' ? 'fr-FR' : 'en-US') }
watch(selectedId, loadHistory)
onMounted(fetchItems)
</script>
