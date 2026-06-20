<template>
  <div class="inline-flex items-center gap-3">
    <div
      v-if="showBadge"
      class="w-10 h-10 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/20"
      aria-hidden="true"
    >
      <span class="text-sm font-bold text-white">B</span>
    </div>

    <div class="leading-tight">
      <p
        class="tracking-tight text-white"
        :class="showWordmark ? 'text-base font-semibold' : 'text-lg font-bold'"
      >
        BitLock
      </p>
      <p v-if="showWordmark" class="text-[11px] text-surface-500">{{ tagline }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  showWordmark?: boolean
  tagline?: string
  showBadge?: boolean
  variant?: 'default' | 'mono'
}>(), {
  size: 40,
  showWordmark: false,
  tagline: 'Security vault',
  showBadge: false,
  variant: 'default',
})
</script>
