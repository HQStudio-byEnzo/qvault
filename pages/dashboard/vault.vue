<template>
  <div class="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">{{ t('vault.title') }}</h1>
        <p class="text-surface-400 text-sm mt-1">{{ t('vault.subtitle') }}</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary flex items-center gap-2">
        <Icon name="lucide:plus" class="w-4 h-4" />
        {{ t('vault.add') }}
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col gap-3">
      <div class="relative flex-1">
        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('vault.search')"
          class="input-field pl-10"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="[
            activeFilter === filter.value
              ? 'bg-accent-600 text-white'
              : 'bg-surface-800 text-surface-400 hover:text-surface-200'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="chip in searchChips"
          :key="chip.query"
          @click="searchQuery = chip.query"
          class="px-2.5 py-1 rounded-md text-xs bg-surface-800 text-surface-400 hover:text-surface-200 hover:bg-surface-700 transition-colors"
        >
          {{ chip.label }}
        </button>
      </div>
    </div>

    <!-- Items list -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="w-6 h-6 text-accent-400 animate-spin" />
    </div>

    <div v-else-if="visibleItems.length === 0" class="text-center py-16">
      <Icon name="lucide:vault" class="w-12 h-12 text-surface-600 mx-auto mb-4" />
      <p class="text-surface-400">{{ items.length === 0 ? t('vault.empty') : t('vault.noResult') }}</p>
      <p class="text-sm text-surface-500 mt-1">{{ items.length === 0 ? t('vault.emptyHint') : t('vault.noResultHint') }}</p>
    </div>

    <div v-else class="space-y-2">
      <VaultItemCard
        v-for="item in visibleItems"
        :key="item.id"
        :item="item"
        @toggle-favorite="toggleFavorite(item)"
        @delete="handleDelete(item.id)"
        @decrypt="handleDecrypt(item)"
      />
    </div>

    <!-- Add Modal -->
    <VaultAddModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @added="onItemAdded"
    />

    <!-- Decrypt Modal -->
    <VaultDecryptModal
      v-if="decryptTarget"
      :item="decryptTarget"
      @close="decryptTarget = null"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { t } = useLang()
const { items, loading, fetchItems, toggleFavorite, deleteItem } = useVault()

const showAddModal = ref(false)
const decryptTarget = ref<any>(null)
const searchQuery = ref('')
const activeFilter = ref('')

const filters = computed(() => [
  { label: t('vault.filterAll'), value: '' },
  { label: t('vault.filterLinks'), value: 'link' },
  { label: t('vault.filterPasswords'), value: 'password' },
  { label: t('vault.filterCrypto'), value: 'crypto' },
])

const searchChips = computed(() => [
  { label: t('vault.chipFavorites'), query: 'favorite' },
  { label: t('vault.chipWithUrl'), query: 'has:url' },
  { label: t('vault.chipWithoutUrl'), query: 'missing:url' },
  { label: t('vault.chipPasswords'), query: 'type:password' },
  { label: t('vault.chipCrypto'), query: 'type:crypto' },
])

const visibleItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const byType = activeFilter.value
    ? items.value.filter(item => item.type === activeFilter.value)
    : items.value

  if (!query) return byType

  return byType.filter(item => {
    const haystack = [
      item.label,
      item.url,
      item.type,
      item.favorite ? 'favorite favori favoris' : '',
      item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : '',
    ].filter(Boolean).join(' ').toLowerCase()

    if (query === 'favorite' || query === 'favori' || query === 'favoris') return !!item.favorite
    if (query === 'has:url' || query === 'url') return !!item.url
    if (query === 'missing:url' || query === 'sans:url') return !item.url
    if (query.startsWith('type:')) return item.type === query.replace('type:', '')
    if (query.startsWith('site:')) return (item.url || '').toLowerCase().includes(query.replace('site:', ''))

    return query.split(/\s+/).every(term => haystack.includes(term))
  })
})

watch(activeFilter, () => {
  fetchItems()
})

function onItemAdded() {
  showAddModal.value = false
}

function handleDecrypt(item: any) {
  decryptTarget.value = item
}

async function handleDelete(id: string) {
  if (confirm(t('vault.confirmDelete'))) {
    await deleteItem(id)
  }
}

onMounted(() => {
  fetchItems()
})
</script>
