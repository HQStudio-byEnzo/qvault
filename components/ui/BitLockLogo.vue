<template>
  <div class="inline-flex items-center gap-3">
    <div
      class="rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/30 border border-white/10"
      :class="variant === 'mono'
        ? 'bg-white/10'
        : 'bg-gradient-to-br from-emerald-500 to-accent-600'"
      :style="{ width: `${size}px`, height: `${size}px` }"
      aria-hidden="true"
    >
      <Icon
        name="lucide:shield"
        :class="variant === 'mono' ? 'text-white' : 'text-white'"
        :style="{ width: `${Math.max(14, Math.round(size * 0.55))}px`, height: `${Math.max(14, Math.round(size * 0.55))}px` }"
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
