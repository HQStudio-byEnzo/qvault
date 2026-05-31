<template>
  <div class="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-white">Export / Import</h1>
      <p class="text-surface-400 text-sm mt-1">Exportez ou importez vos données de coffre-fort</p>
    </div>

    <!-- Export Section -->
    <div class="bg-surface-900 border border-surface-700 rounded-xl p-6 space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-accent-600/20 flex items-center justify-center">
          <Icon name="lucide:download" class="w-5 h-5 text-accent-400" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-white">Exporter</h2>
        <p class="text-sm text-surface-400">Téléchargez un backup JSON complet de votre coffre</p>
        </div>
      </div>
      <p class="text-sm text-surface-500">
        Les secrets restent chiffrés. L'export inclut aussi les URLs, favoris et dates pour restaurer le coffre sans perte de contexte.
      </p>
      <button
        @click="handleExport"
        :disabled="exporting"
        class="btn-primary flex items-center gap-2"
      >
        <Icon name="lucide:download" class="w-4 h-4" />
        <span v-if="exporting">Export en cours...</span>
        <span v-else>Exporter les données</span>
      </button>
    </div>

    <!-- Import Section -->
    <div class="bg-surface-900 border border-surface-700 rounded-xl p-6 space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
          <Icon name="lucide:upload" class="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-white">Importer</h2>
          <p class="text-sm text-surface-400">Importez des éléments depuis un fichier JSON</p>
        </div>
      </div>
      <p class="text-sm text-surface-500">
        Sélectionnez un fichier JSON précédemment exporté depuis Kipit. Les items invalides seront ignorés.
      </p>
      <div class="flex items-center gap-3">
        <label class="btn-primary flex items-center gap-2 cursor-pointer">
          <Icon name="lucide:upload" class="w-4 h-4" />
          <span v-if="importing">Import en cours...</span>
          <span v-else>Importer un fichier</span>
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
      <div v-if="importResult" class="p-3 rounded-lg text-sm" :class="importResult.success ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'">
        {{ importResult.message }}
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

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
      app: 'Kipit',
      counts: {
        total: items.value.length,
        links: items.value.filter(item => item.type === 'link').length,
        passwords: items.value.filter(item => item.type === 'password').length,
        crypto: items.value.filter(item => item.type === 'crypto').length,
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
    a.download = `kipit-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'export.'
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
      throw new Error('Format de fichier invalide.')
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
            is_encrypted: true,
            iv: item.iv,
            url: item.url || undefined,
          },
        })

        if (item.favorite) {
          await $fetch(`/api/vault/${created.id}`, {
            method: 'PUT',
            body: {
              favorite: true,
              payload: item.payload,
              iv: item.iv,
              is_encrypted: true,
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
      message: `Import terminé : ${imported} élément(s) importé(s)${failed > 0 ? `, ${failed} erreur(s)` : ''}.`,
    }
  } catch (err: any) {
    importResult.value = {
      success: false,
      message: err.message || 'Erreur lors de l\'import.',
    }
  } finally {
    importing.value = false
    input.value = ''
  }
}

function isValidImportItem(item: any) {
  return (
    item &&
    ['link', 'password', 'crypto'].includes(item.type) &&
    typeof item.payload === 'string' &&
    item.payload.split(':').length === 2 &&
    typeof item.iv === 'string' &&
    item.iv.length > 0
  )
}
</script>
