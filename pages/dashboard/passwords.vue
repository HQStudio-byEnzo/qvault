<template>
  <div class="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Mots de passe</h1>
        <p class="text-surface-400 text-sm mt-1">Vos identifiants protégés</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary flex items-center gap-2">
        <Icon name="lucide:plus" class="w-4 h-4" />
        Ajouter
      </button>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="w-6 h-6 text-accent-400 animate-spin" />
    </div>

    <div v-else-if="filteredItems.length === 0" class="text-center py-16">
      <Icon name="lucide:key-round" class="w-12 h-12 text-surface-600 mx-auto mb-4" />
      <p class="text-surface-400">Aucun mot de passe sauvegardé.</p>
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
      default-type="password"
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

const { items, loading, fetchItems, toggleFavorite, deleteItem } = useVault()
const showAddModal = ref(false)
const decryptTarget = ref<any>(null)

const filteredItems = computed(() => items.value.filter(i => i.type === 'password'))

function handleDecrypt(item: any) { decryptTarget.value = item }
async function handleDelete(id: string) {
  if (confirm('Supprimer ce mot de passe ?')) await deleteItem(id)
}

onMounted(() => {
  fetchItems({ type: 'password' })
})
</script>
