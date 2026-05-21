<template>
  <div class="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Crypto</h1>
        <p class="text-surface-400 text-sm mt-1">Vos seed phrases et clés privées</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary flex items-center gap-2">
        <Icon name="lucide:plus" class="w-4 h-4" />
        Ajouter
      </button>
    </div>

    <!-- Limit warning -->
    <div v-if="stats?.limits && !stats.isPremium" class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400 flex items-center gap-2">
      <Icon name="lucide:alert-triangle" class="w-4 h-4 flex-shrink-0" />
      <span>Plan Free : {{ stats.counts.crypto }}/{{ stats.limits.crypto }} éléments crypto utilisés.</span>
    </div>

    <!-- Security notice -->
    <div class="p-3 rounded-lg bg-accent-500/10 border border-accent-500/20 text-sm text-accent-300 flex items-center gap-2">
      <Icon name="lucide:shield-check" class="w-4 h-4 flex-shrink-0" />
      <span>Nous recommandons fortement d'activer le chiffrement pour vos clés crypto.</span>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="w-6 h-6 text-accent-400 animate-spin" />
    </div>

    <div v-else-if="filteredItems.length === 0" class="text-center py-16">
      <Icon name="lucide:bitcoin" class="w-12 h-12 text-surface-600 mx-auto mb-4" />
      <p class="text-surface-400">Aucune clé crypto sauvegardée.</p>
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

const { items, stats, loading, fetchItems, fetchStats, toggleFavorite, deleteItem } = useVault()
const showAddModal = ref(false)
const decryptTarget = ref<any>(null)

const filteredItems = computed(() => items.value.filter(i => i.type === 'crypto'))

function handleDecrypt(item: any) { decryptTarget.value = item }
async function handleDelete(id: string) {
  if (confirm('Supprimer cet élément crypto ?')) await deleteItem(id)
}

onMounted(() => {
  fetchItems({ type: 'crypto' })
  fetchStats()
})
</script>
