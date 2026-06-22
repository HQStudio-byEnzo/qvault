<template>
  <span class="inline-flex items-center justify-center shrink-0" :aria-label="alt">
    <img
      :src="logoSrc"
      :width="resolvedSize"
      :height="resolvedSize"
      :alt="alt"
      class="block object-contain drop-shadow-[0_12px_28px_rgba(91,33,182,0.28)]"
      loading="eager"
      decoding="async"
    />
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  size?: number
  alt?: string
}>()

const resolvedSize = computed(() => props.size ?? 56)
const logoSrc = '/bitlock-logo.png'
const alt = computed(() => props.alt ?? 'BitLock')
</script>
