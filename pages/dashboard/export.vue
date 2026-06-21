<template>
  <div class="section-shell max-w-4xl py-10 md:py-16 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-white">{{ t('export.title') }}</h1>
      <p class="text-surface-400 text-sm mt-1">{{ t('export.subtitle') }}</p>
    </div>

    <div class="glass-panel p-5 md:p-6 space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-accent-600/20 flex items-center justify-center border border-white/10">
          <AppIcon name="lucide:download" class="w-5 h-5 text-accent-400" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-white">{{ t('export.exportTitle') }}</h2>
          <p class="text-sm text-surface-400">{{ t('export.exportDesc') }}</p>
        </div>
      </div>
      <p class="text-sm text-surface-500">
        {{ t('export.exportNotice') }}
      </p>
      <button @click="handleExport" :disabled="exporting" class="btn-primary flex items-center gap-2">
        <AppIcon name="lucide:download" class="w-4 h-4" />
        <span v-if="exporting">{{ t('export.exporting') }}</span>
        <span v-else>{{ t('export.exportBtn') }}</span>
      </button>
    </div>

    <div class="glass-panel p-5 md:p-6 space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-green-600/20 flex items-center justify-center border border-white/10">
          <AppIcon name="lucide:upload" class="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-white">{{ t('export.importTitle') }}</h2>
          <p class="text-sm text-surface-400">{{ t('export.importDesc') }}</p>
        </div>
      </div>
      <p class="text-sm text-surface-500">
        {{ t('export.importNotice') }}
      </p>
      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <label class="btn-primary flex items-center gap-2 cursor-pointer">
          <AppIcon name="lucide:upload" class="w-4 h-4" />
          <span v-if="importing">{{ t('export.importing') }}</span>
          <span v-else>{{ t('export.importBtn') }}</span>
          <input
            type="file"
            accept=".json"
            class="hidden"
            @change="handleImport"
            :disabled="importing"
          />
        </label>
      </div>

      <!-- Import result -->
      <div v-if="importResult" class="p-3 rounded-xl text-sm" :class="importResult.success ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'">
        {{ importResult.message }}
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { t } = useLang()
const { items, fetchItems, addItem } = useVault()

const exporting = ref(false)
const importing = ref(false)
const error = ref<string | null>(null)
const importResult = ref<{ success: boolean; message: string } | null>(null)

async function handleExport() {
  exporting.value = true
  error.value = null

  try {
    await fetchItems()

    const exportData = {
      version: 2,
      exportedAt: new Date().toISOString(),
      app: 'BitLock',
      counts: {
        total: items.value.length,
        links: items.value.filter(item => item.type === 'link').length,
        passwords: items.value.filter(item => item.type === 'password').length,
        crypto: items.value.filter(item => item.type === 'crypto').length,
        recovery: items.value.filter(item => item.type === 'recovery').length,
      },
      items: items.value.map(item => ({
        id: item.id,
        type: item.type,
        label: item.label,
        payload: item.payload,
        is_encrypted: item.is_encrypted,
        iv: item.iv,
        url: item.url || null,
        favorite: item.favorite,
        created_at: item.created_at,
        updated_at: item.updated_at || null,
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bitlock-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (err: any) {
    error.value = err.message || t('export.exportError')
  } finally {
    exporting.value = false
  }
}

async function handleImport(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  importing.value = true
  error.value = null
  importResult.value = null

  try {
    const text = await file.text()
    const data = JSON.parse(text)

    if (!data.items || !Array.isArray(data.items)) {
      throw new Error(t('export.invalidFormat'))
    }

    let imported = 0
    let failed = 0

    for (const item of data.items) {
      try {
        if (!isValidImportItem(item)) {
          failed++
          continue
        }

        const created = await $fetch<{ id: string }>('/api/vault', {
          method: 'POST',
          body: {
            type: item.type,
            label: item.label || '',
            payload: item.payload,
            is_encrypted: !!item.is_encrypted,
            iv: item.is_encrypted ? item.iv : null,
            url: item.url || undefined,
          },
        })

        if (item.favorite) {
          await $fetch(`/api/vault/${created.id}`, {
            method: 'PUT',
            body: {
              favorite: true,
              payload: item.payload,
              iv: item.is_encrypted ? item.iv : null,
              is_encrypted: !!item.is_encrypted,
            },
          })
        }
        imported++
      } catch {
        failed++
      }
    }

    await fetchItems()

    importResult.value = {
      success: true,
      message: `${t('export.importSuccess')}: ${imported} item(s)${failed > 0 ? `, ${failed} error(s)` : ''}.`,
    }
  } catch (err: any) {
    importResult.value = {
      success: false,
      message: err.message || t('export.importError'),
    }
  } finally {
    importing.value = false
    input.value = ''
  }
}

function isValidImportItem(item: any) {
  return (
    item &&
    ['link', 'password', 'crypto', 'recovery'].includes(item.type) &&
    typeof item.payload === 'string' &&
    (
      (!item.is_encrypted && !item.iv) ||
      (item.is_encrypted && typeof item.iv === 'string' && item.payload.split(':').length === 2)
    )
  )
}
</script>
