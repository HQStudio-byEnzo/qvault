<template>
  <div class="inline-flex items-center leading-none" :class="gapClass">
    <img
      src="https://i.imgur.com/IlXP7UX.png"
      alt="BitLock logo"
      class="shrink-0 object-contain drop-shadow-[0_10px_30px_rgba(124,58,237,0.2)]"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
    <div v-if="showWordmark" class="flex flex-col">
      <p class="tracking-tight text-white font-bold" :class="titleClass">
        BitLock
      </p>
      <p v-if="tagline" class="mt-1 text-surface-500" :class="subtitleClass">{{ tagline }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  showWordmark?: boolean
  tagline?: string
  gapClass?: string
  titleClass?: string
  subtitleClass?: string
}>(), {
  size: 40,
  showWordmark: true,
  tagline: '',
  gapClass: 'gap-3',
  titleClass: 'text-lg',
  subtitleClass: 'text-[11px]',
})
</script>
