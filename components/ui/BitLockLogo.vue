<template>
  <div class="inline-flex items-center gap-3">
    <div
      class="rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/30 border border-white/10"
      :class="variant === 'mono'
        ? 'bg-white/10'
        : 'bg-gradient-to-br from-emerald-500 via-emerald-400 to-accent-600'"
      :style="{ width: `${size}px`, height: `${size}px` }"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="block"
        role="img"
        :aria-label="label"
        :style="{ width: `${Math.max(14, Math.round(size * 0.56))}px`, height: `${Math.max(14, Math.round(size * 0.56))}px` }"
      >
        <defs>
          <linearGradient id="bitlock-bg" x1="10" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#34D399" />
            <stop offset="0.55" stop-color="#3B82F6" />
            <stop offset="1" stop-color="#8B5CF6" />
          </linearGradient>
          <linearGradient id="bitlock-fg" x1="16" y1="14" x2="48" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#FFFFFF" />
            <stop offset="1" stop-color="#E5E7EB" />
          </linearGradient>
        </defs>

        <path
          d="M32 6.5L49.5 14.5V31.8C49.5 42.8 42.3 52.6 32 57.5C21.7 52.6 14.5 42.8 14.5 31.8V14.5L32 6.5Z"
          :fill="variant === 'mono' ? '#111827' : 'url(#bitlock-bg)'"
          :fill-opacity="variant === 'mono' ? '.9' : '.18'"
          :stroke="variant === 'mono' ? '#F9FAFB' : 'url(#bitlock-bg)'"
          stroke-width="2.2"
        />
        <path
          d="M25.5 27.6V23.5C25.5 19.9 28.4 17 32 17C35.6 17 38.5 19.9 38.5 23.5V27.6"
          :stroke="variant === 'mono' ? '#F9FAFB' : 'url(#bitlock-fg)'"
          stroke-width="2.4"
          stroke-linecap="round"
        />
        <rect
          x="20.8"
          y="27.5"
          width="22.4"
          height="18.2"
          rx="5.2"
          :fill="variant === 'mono' ? '#F9FAFB' : 'url(#bitlock-fg)'"
          :stroke="variant === 'mono' ? '#111827' : 'url(#bitlock-bg)'"
          stroke-width="1.8"
        />
        <circle cx="32" cy="36.6" r="2.6" :fill="variant === 'mono' ? '#111827' : '#0F172A'" />
        <path d="M32 39.2V42.2" :stroke="variant === 'mono' ? '#111827' : '#0F172A'" stroke-width="2" stroke-linecap="round" />
      </svg>
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
