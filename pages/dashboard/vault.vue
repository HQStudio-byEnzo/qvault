<template>
  <div class="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Coffre-fort</h1>
        <p class="text-surface-400 text-sm mt-1">Tous vos éléments sécurisés</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary flex items-center gap-2">
        <Icon name="lucide:plus" class="w-4 h-4" />
        Ajouter
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher..."
          class="input-field pl-10"
          @input="debouncedSearch"
        />
      </div>
      <div class="flex gap-2">
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
    </div>

    <!-- Items list -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="w-6 h-6 text-accent-400 animate-spin" />
    </div>

    <div v-else-if="items.length === 0" class="text-center py-16">
      <Icon name="lucide:vault" class="w-12 h-12 text-surface-600 mx-auto mb-4" />
      <p class="text-surface-400">Votre coffre-fort est vide.</p>
      <p class="text-sm text-surface-500 mt-1">Commencez par ajouter un élément.</p>
    </div>

    <div v-else class="space-y-2">
      <VaultItemCard
        v-for="item in items"
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

const { items, loading, fetchItems, toggleFavorite, deleteItem } = useVault()

const showAddModal = ref(false)
const decryptTarget = ref<any>(null)
const searchQuery = ref('')
const activeFilter = ref('')

const filters = [
  { label: 'Tout', value: '' },
  { label: 'Liens', value: 'link' },
  { label: 'Mots de passe', value: 'password' },
  { label: 'Crypto', value: 'crypto' },
]

// Debounce search
let searchTimeout: ReturnType<typeof setTimeout>
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchItems({ type: activeFilter.value || undefined, search: searchQuery.value || undefined })
  }, 300)
}

watch(activeFilter, () => {
  fetchItems({ type: activeFilter.value || undefined, search: searchQuery.value || undefined })
})

function onItemAdded() {
  showAddModal.value = false
}

function handleDecrypt(item: any) {
  decryptTarget.value = item
}

async function handleDelete(id: string) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
    await deleteItem(id)
  }
}

onMounted(() => {
  fetchItems()
})
</script>
