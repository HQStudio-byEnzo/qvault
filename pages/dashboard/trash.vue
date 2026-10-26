<template>
  <div class="section-shell max-w-4xl py-10 md:py-16 space-y-6">
    <section class="hero-panel">
      <p class="eyebrow">{{ t('trash.eyebrow') }}</p>
      <h1 class="mt-3 text-3xl md:text-4xl font-semibold text-foreground">{{ t('trash.title') }}</h1>
      <p class="mt-3 text-surface-300">{{ t('trash.subtitle').replace('{days}', String(retentionDays)) }}</p>
    </section>

    <section class="glass-panel p-5 md:p-6 space-y-4">
      <div v-if="loading" class="text-surface-400">{{ t('common.loading') }}</div>
      <div v-else-if="items.length === 0" class="text-sm text-surface-400">{{ t('trash.empty') }}</div>
      <template v-else>
        <ul class="divide-y divide-border">
          <li v-for="item in items" :key="item.id" class="flex flex-col sm:flex-row sm:items-center gap-3 py-4">
            <div class="flex-1 min-w-0">
              <p class="text-sm text-foreground truncate">{{ item.label || t('vault.untitled') }}</p>
              <p class="mt-1 text-xs text-surface-500">
                {{ typeLabel(item.type) }}
                · {{ t('trash.deletedAt').replace('{date}', formatDate(item.deleted_at, { dateStyle: 'medium' })) }}
                · {{ t('trash.expires').replace('{date}', expiryLabel(item.deleted_at)) }}
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button class="btn-secondary" :disabled="busy === item.id" @click="restore(item.id)">
                <Icon name="hugeicons:rotate-ccw" class="w-4 h-4" />
                {{ t('trash.restore') }}
              </button>
              <template v-if="confirmId === item.id">
                <button class="btn-danger" :disabled="busy === item.id" @click="destroy(item.id)">
                  {{ t('trash.confirmDelete') }}
                </button>
                <button class="btn-secondary" @click="confirmId = ''">{{ t('common.cancel') }}</button>
              </template>
              <button v-else class="btn-secondary" :disabled="busy === item.id" @click="confirmId = item.id">
                {{ t('trash.delete') }}
              </button>
            </div>
          </li>
        </ul>

        <div class="border-t border-border pt-4">
          <template v-if="confirmPurge">
            <p class="text-sm text-red-600">{{ t('trash.purgeWarning') }}</p>
            <div class="flex flex-wrap gap-2 mt-3">
              <button class="btn-danger" :disabled="purging" @click="purge">{{ t('trash.confirmPurge') }}</button>
              <button class="btn-secondary" @click="confirmPurge = false">{{ t('common.cancel') }}</button>
            </div>
          </template>
          <button v-else class="btn-secondary" @click="confirmPurge = true">{{ t('trash.purge') }}</button>
        </div>
      </template>

      <p v-if="message" role="status" class="text-sm" :class="failed ? 'text-red-600' : 'text-accent-text'">{{ message }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'
import { TRASH_RETENTION_DAYS, trashExpiresAt } from '~/utils/trash'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

interface TrashItem {
  id: string
  type: string
  label: string
  url?: string | null
  deleted_at: string
}

const { t } = useLang()
const { formatDate } = useDateFormat()
const { fetchItems, fetchStats } = useVault()

const items = ref<TrashItem[]>([])
const retentionDays = ref(TRASH_RETENTION_DAYS)
const loading = ref(true)
const busy = ref('')
const confirmId = ref('')
const confirmPurge = ref(false)
const purging = ref(false)
const message = ref('')
const failed = ref(false)

const TYPE_KEYS: Record<string, string> = {
  link: 'vault.typeLink',
  password: 'vault.typePassword',
  crypto: 'vault.typeCrypto',
  recovery: 'vault.typeRecovery',
  note: 'vault.typeNote',
  totp: 'vault.typeTotp',
}

function typeLabel(type: string) {
  return t(TYPE_KEYS[type] || 'vault.typeNote')
}

function expiryLabel(deletedAt: string) {
  const date = trashExpiresAt(deletedAt)
  return date ? formatDate(date.toISOString(), { dateStyle: 'medium' }) : '—'
}

async function load() {
  loading.value = true
  try {
    const data = await $fetch<{ items: TrashItem[]; retentionDays: number }>('/api/vault/trash')
    items.value = data.items
    retentionDays.value = data.retentionDays
  } catch {
    failed.value = true
    message.value = t('trash.failed')
  } finally {
    loading.value = false
  }
}

async function restore(id: string) {
  busy.value = id
  message.value = ''
  failed.value = false
  try {
    await $fetch(`/api/vault/${id}/undelete`, { method: 'POST' })
    await Promise.all([load(), fetchItems(), fetchStats()])
    message.value = t('trash.restored')
  } catch {
    failed.value = true
    message.value = t('trash.failed')
  } finally {
    busy.value = ''
  }
}

async function destroy(id: string) {
  busy.value = id
  message.value = ''
  failed.value = false
  try {
    await $fetch(`/api/vault/${id}`, { method: 'DELETE', query: { permanent: 1 } })
    confirmId.value = ''
    await load()
    message.value = t('trash.deleted')
  } catch {
    failed.value = true
    message.value = t('trash.failed')
  } finally {
    busy.value = ''
  }
}

async function purge() {
  purging.value = true
  message.value = ''
  failed.value = false
  try {
    const result = await $fetch<{ purged: number }>('/api/vault/trash/purge', { method: 'POST' })
    confirmPurge.value = false
    await load()
    message.value = t('trash.purged').replace('{count}', String(result.purged))
  } catch {
    failed.value = true
    message.value = t('trash.failed')
  } finally {
    purging.value = false
  }
}

onMounted(load)
</script>
