<!-- Hallmark · component: logo · genre: atmospheric technical · theme: Midnight · P5 H5 E5 S5 R5 V5 -->
<template>
  <span class="inline-flex shrink-0 items-center justify-center text-accent-400" :aria-label="alt" role="img">
    <svg
      :width="resolvedSize"
      :height="resolvedSize"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 5H46L59 18V46L46 59H18L5 46V18L18 5Z"
        stroke="currentColor"
        stroke-width="3"
        stroke-linejoin="round"
      />
      <path
        d="M21 17V47M21 18H34C40 18 44 21 44 26C44 30 41 32 36 32H21M36 32C42 32 46 35 46 40C46 45 42 47 35 47H21"
        stroke="currentColor"
        stroke-width="3.5"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
      <rect x="29.5" y="29.5" width="5" height="5" rx="1" fill="currentColor" />
    </svg>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  size?: number
  alt?: string
}>()

const resolvedSize = computed(() => props.size ?? 64)
const alt = computed(() => props.alt ?? 'BitLock')
</script>
