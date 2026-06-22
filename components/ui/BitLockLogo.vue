<template>
  <span
    class="inline-flex items-center font-extrabold tracking-tight text-white drop-shadow-[0_8px_24px_rgba(124,58,237,0.18)]"
    :style="{ fontSize: `${size * 0.45}px`, lineHeight: 1 }"
    aria-label="BitLock"
  >
    BitLock
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
}>(), {
  size: 40,
})
</script>
