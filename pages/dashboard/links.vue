<template>
  <div class="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">{{ t('links.title') }}</h1>
        <p class="text-surface-400 text-sm mt-1">{{ t('links.subtitle') }}</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary flex items-center gap-2">
        <Icon name="lucide:plus" class="w-4 h-4" />
        {{ t('links.add') }}
      </button>
    </div>

    <!-- Items -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="w-6 h-6 text-accent-400 animate-spin" />
    </div>

    <div v-else-if="filteredItems.length === 0" class="text-center py-16">
      <Icon name="lucide:link" class="w-12 h-12 text-surface-600 mx-auto mb-4" />
      <p class="text-surface-400">{{ t('links.empty') }}</p>
    </div>

    <div v-else class="space-y-2">
      <VaultItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
        @toggle-favorite="toggleFavorite(item)"
        @delete="handleDelete(item)"
        @decrypt="handleDecrypt(item)"
      />
    </div>

    <VaultAddModal
      v-if="showAddModal"
      default-type="link"
      @close="showAddModal = false"
      @added="showAddModal = false"
    />

    <VaultDecryptModal
      v-if="decryptTarget"
      :item="decryptTarget"
      @close="decryptTarget = null"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const { t } = useLang()
const { items, loading, fetchItems, toggleFavorite, deleteItem } = useVault()
const { masterPassword, setMasterPassword } = useMasterPassword()
const showAddModal = ref(false)
const decryptTarget = ref<any>(null)

const filteredItems = computed(() => items.value.filter(i => i.type === 'link'))

function handleDecrypt(item: any) { decryptTarget.value = item }
async function handleDelete(item: any) {
  if (!confirm(t('links.confirmDelete'))) return

  let secret = masterPassword.value || ''
  if (item.is_encrypted) {
    secret = window.prompt('Entrez votre mot de passe maître pour supprimer cet élément.')?.trim() || ''
    if (!secret) return
    setMasterPassword(secret)
  }

  await deleteItem(item, secret)
}

onMounted(() => fetchItems({ type: 'link' }))
</script>
