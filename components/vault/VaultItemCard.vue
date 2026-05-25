<template>
  <div class="card-hover flex items-center gap-4 p-4">
    <!-- Type icon -->
    <div
      class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
      :class="typeStyles.bg"
    >
      <Icon :name="typeStyles.icon" class="w-5 h-5" :class="typeStyles.text" />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <p class="text-sm font-medium text-surface-200 truncate">
          {{ item.label || 'Sans titre' }}
        </p>
        <span v-if="item.is_encrypted" class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent-500/10 text-accent-400 border border-accent-500/20">
          <Icon name="lucide:lock" class="w-2.5 h-2.5" />
          Chiffré
        </span>
      </div>
      <p class="text-xs text-surface-500 mt-0.5">
        {{ typeLabels[item.type] }} · {{ formatDate(item.created_at) }}
      </p>
      <a
        v-if="item.url"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-accent-400 hover:text-accent-300 truncate block mt-0.5"
      >
        {{ item.url }}
      </a>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1">
      <!-- Show/Decrypt button -->
      <button
        v-if="item.is_encrypted"
        @click="$emit('decrypt', item)"
        class="p-2 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-accent-400 transition-colors"
        title="Déchiffrer"
      >
        <Icon name="lucide:eye" class="w-4 h-4" />
      </button>
      
      <!-- Copy button (non-encrypted) -->
      <button
        v-else
        @click="copyPayload"
        class="p-2 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-green-400 transition-colors"
        :title="copied ? 'Copié !' : 'Copier'"
      >
        <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
      </button>

      <!-- Favorite -->
      <button
        @click="$emit('toggle-favorite')"
        class="p-2 rounded-lg hover:bg-surface-700 transition-colors"
        :class="item.favorite ? 'text-yellow-400' : 'text-surface-400 hover:text-yellow-400'"
      >
        <Icon :name="item.favorite ? 'lucide:star' : 'lucide:star'" class="w-4 h-4" :class="item.favorite ? 'fill-current' : ''" />
      </button>

      <!-- Delete -->
      <button
        @click="$emit('delete')"
        class="p-2 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-red-400 transition-colors"
      >
        <Icon name="lucide:trash-2" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VaultItem } from '~/composables/useVault'

const props = defineProps<{
  item: VaultItem
}>()

defineEmits<{
  'toggle-favorite': []
  'delete': []
  'decrypt': [item: VaultItem]
}>()

const copied = ref(false)

const typeLabels: Record<string, string> = {
  link: 'Lien',
  password: 'Mot de passe',
  crypto: 'Crypto',
}

const typeStyles = computed(() => {
  switch (props.item.type) {
    case 'link':
      return { bg: 'bg-blue-500/10', icon: 'lucide:link', text: 'text-blue-400' }
    case 'password':
      return { bg: 'bg-amber-500/10', icon: 'lucide:key-round', text: 'text-amber-400' }
    case 'crypto':
      return { bg: 'bg-orange-500/10', icon: 'lucide:bitcoin', text: 'text-orange-400' }
    default:
      return { bg: 'bg-surface-700', icon: 'lucide:file', text: 'text-surface-400' }
  }
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

async function copyPayload() {
  try {
    await navigator.clipboard.writeText(props.item.payload)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback
  }
}
</script>
