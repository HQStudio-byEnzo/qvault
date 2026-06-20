<template>
  <div class="inline-flex items-center gap-3">
    <div
      class="rounded-2xl overflow-hidden shrink-0 shadow-lg shadow-emerald-950/30 border border-white/10 bg-surface-900"
      :style="{ width: `${size}px`, height: `${size}px` }"
      aria-hidden="true"
    >
      <img
        :src="variant === 'mono' ? '/bitlock-mark-mono.svg' : '/bitlock-mark.svg'"
        alt=""
        class="block w-full h-full object-cover"
      />
    </div>

    <div v-if="showWordmark" class="leading-tight">
      <p class="text-base font-semibold tracking-tight text-white">BitLock</p>
      <p class="text-[11px] text-surface-500">{{ tagline }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  showWordmark?: boolean
  label?: string
  tagline?: string
  variant?: 'default' | 'mono'
}>(), {
  size: 40,
  showWordmark: false,
  label: 'BitLock logo',
  tagline: 'Security vault',
  variant: 'default',
})
</script>
