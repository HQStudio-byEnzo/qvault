<template>
  <div class="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Recovery code</h1>
        <p class="text-surface-400 text-sm mt-1">Store recovery codes from GitHub, Google, and other services.</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary flex items-center gap-2"><Icon name="lucide:plus" class="w-4 h-4" />Add / import</button>
    </div>
    <div class="card border-accent-500/20 bg-accent-500/5 text-sm text-surface-300">.txt files are read locally in the browser and encrypted before being stored in the vault.</div>
    <div v-if="loading" class="flex items-center justify-center py-12"><Icon name="lucide:loader-2" class="w-6 h-6 text-accent-400 animate-spin" /></div>
    <div v-else-if="filteredItems.length === 0" class="text-center py-16"><Icon name="lucide:ticket-check" class="w-12 h-12 text-surface-600 mx-auto mb-4" /><p class="text-surface-400">No recovery code saved yet.</p></div>
    <div v-else class="space-y-2"><VaultItemCard v-for="item in filteredItems" :key="item.id" :item="item" @toggle-favorite="toggleFavorite(item)" @delete="handleDelete(item)" @decrypt="decryptTarget = item" /></div>
    <VaultAddModal v-if="showAddModal" default-type="recovery" @close="showAddModal = false" @added="showAddModal = false" />
    <VaultDecryptModal v-if="decryptTarget" :item="decryptTarget" @close="decryptTarget = null" />
  </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { items, loading, fetchItems, toggleFavorite, deleteItem } = useVault()
const { masterPassword, setMasterPassword } = useMasterPassword()
const showAddModal = ref(false)
const decryptTarget = ref<any>(null)
const filteredItems = computed(() => items.value.filter(i => i.type === 'recovery'))
async function handleDelete(item: any) { if (!confirm('Delete these recovery codes?')) return; let secret = masterPassword.value || ''; if (item.is_encrypted) { secret = window.prompt('Master password required.')?.trim() || ''; if (!secret) return; setMasterPassword(secret) } await deleteItem(item, secret) }
onMounted(() => fetchItems({ type: 'recovery' }))
</script>
