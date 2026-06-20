<template>
  <div class="section-shell max-w-7xl py-10 md:py-16 space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">{{ t('recovery.title') }}</h1>
        <p class="text-surface-400 text-sm mt-1">{{ t('recovery.desc') }}</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary flex items-center gap-2"><Icon name="lucide:plus" class="w-4 h-4" />{{ t('recovery.addImport') }}</button>
    </div>
    <div class="card border-accent-500/20 bg-accent-500/5 text-sm text-surface-300">{{ t('recovery.txtNotice') }}</div>
    <div v-if="loading" class="flex items-center justify-center py-12"><Icon name="lucide:loader-2" class="w-6 h-6 text-accent-400 animate-spin" /></div>
    <div v-else-if="filteredItems.length === 0" class="text-center py-16"><Icon name="lucide:ticket-check" class="w-12 h-12 text-surface-600 mx-auto mb-4" /><p class="text-surface-400">{{ t('recovery.empty') }}</p></div>
    <div v-else class="space-y-2"><VaultItemCard v-for="item in filteredItems" :key="item.id" :item="item" @toggle-favorite="toggleFavorite(item)" @delete="handleDelete(item)" @decrypt="decryptTarget = item" /></div>
    <VaultAddModal v-if="showAddModal" default-type="recovery" @close="showAddModal = false" @added="showAddModal = false" />
    <VaultDecryptModal v-if="decryptTarget" :item="decryptTarget" @close="decryptTarget = null" />
  </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { items, loading, fetchItems, toggleFavorite, deleteItem } = useVault()
const { masterPassword, setMasterPassword } = useMasterPassword()
const { t } = useLang()
const showAddModal = ref(false)
const decryptTarget = ref<any>(null)
const filteredItems = computed(() => items.value.filter(i => i.type === 'recovery'))
async function handleDelete(item: any) { if (!confirm(t('recovery.deleteConfirm'))) return; let secret = masterPassword.value || ''; if (item.is_encrypted) { secret = window.prompt(t('recovery.masterPwdRequired'))?.trim() || ''; if (!secret) return; setMasterPassword(secret) } await deleteItem(item, secret) }
onMounted(() => fetchItems({ type: 'recovery' }))
</script>
