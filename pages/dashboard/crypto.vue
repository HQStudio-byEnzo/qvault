<template>
  <div class="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">{{ t('crypto.title') }}</h1>
        <p class="text-surface-400 text-sm mt-1">{{ t('crypto.subtitle') }}</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary flex items-center gap-2">
        <Icon name="lucide:plus" class="w-4 h-4" />
        {{ t('crypto.add') }}
      </button>
    </div>

    <!-- Security notice -->
    <div class="p-3 rounded-lg bg-accent-500/10 border border-accent-500/20 text-sm text-accent-300 flex items-center gap-2">
      <Icon name="lucide:shield-check" class="w-4 h-4 flex-shrink-0" />
      <span>{{ t('crypto.recommend') }}</span>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="w-6 h-6 text-accent-400 animate-spin" />
    </div>

    <div v-else-if="filteredItems.length === 0" class="text-center py-16">
      <Icon name="lucide:bitcoin" class="w-12 h-12 text-surface-600 mx-auto mb-4" />
      <p class="text-surface-400">{{ t('crypto.empty') }}</p>
    </div>

    <div v-else class="space-y-2">
      <VaultItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
        @toggle-favorite="toggleFavorite(item)"
        @delete="handleDelete(item.id)"
        @decrypt="handleDecrypt(item)"
      />
    </div>

    <VaultAddModal
      v-if="showAddModal"
      default-type="crypto"
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
const showAddModal = ref(false)
const decryptTarget = ref<any>(null)

const filteredItems = computed(() => items.value.filter(i => i.type === 'crypto'))

function handleDecrypt(item: any) { decryptTarget.value = item }
async function handleDelete(id: string) {
  if (confirm(t('crypto.confirmDelete'))) await deleteItem(id)
}

onMounted(() => {
  fetchItems({ type: 'crypto' })
})
</script>
