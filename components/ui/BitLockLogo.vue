<template>
  <div class="inline-flex flex-col leading-none">
    <p class="tracking-tight text-white text-lg font-bold">
      BitLock
    </p>
    <p v-if="showWordmark" class="text-[11px] text-surface-500 mt-1">{{ tagline }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  showWordmark?: boolean
  tagline?: string
}>(), {
  size: 40,
  showWordmark: false,
  tagline: 'Security vault',
})
</script>
