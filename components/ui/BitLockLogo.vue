<template>
  <div class="inline-flex items-center gap-3">
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      :aria-label="label"
      class="shrink-0"
    >
      <defs>
        <linearGradient :id="gradientId" x1="10" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#34D399" />
          <stop offset="0.55" stop-color="#3B82F6" />
          <stop offset="1" stop-color="#8B5CF6" />
        </linearGradient>
        <linearGradient :id="fillId" x1="16" y1="14" x2="48" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" :stop-color="fillStart" />
          <stop offset="1" :stop-color="fillEnd" />
        </linearGradient>
      </defs>

      <path
        d="M32 6.5L49.5 14.5V31.8C49.5 42.8 42.3 52.6 32 57.5C21.7 52.6 14.5 42.8 14.5 31.8V14.5L32 6.5Z"
        :fill="`url(#${gradientId})`"
        fill-opacity="0.18"
        :stroke="`url(#${gradientId})`"
        stroke-width="2.2"
      />

      <path
        d="M25.5 27.6V23.5C25.5 19.9 28.4 17 32 17C35.6 17 38.5 19.9 38.5 23.5V27.6"
        :stroke="`url(#${fillId})`"
        stroke-width="2.4"
        stroke-linecap="round"
      />
      <rect
        x="20.8"
        y="27.5"
        width="22.4"
        height="18.2"
        rx="5.2"
        :fill="`url(#${fillId})`"
        :stroke="`url(#${gradientId})`"
        stroke-width="1.8"
      />
      <circle cx="32" cy="36.6" r="2.6" :fill="dotFill" opacity="0.9" />
      <path
        d="M32 39.2V42.2"
        :stroke="dotFill"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M26.2 14.7L18.8 18.2V31.7C18.8 40.3 24.1 47.9 32 51.6C39.9 47.9 45.2 40.3 45.2 31.7V18.2L37.8 14.7"
        :stroke="outlineStroke"
        stroke-width="1.2"
        stroke-linecap="round"
      />
    </svg>

    <div v-if="showWordmark" class="leading-tight">
      <p class="text-base font-semibold tracking-tight text-white">BitLock</p>
      <p class="text-[11px] text-surface-500">{{ tagline }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
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

const uid = typeof useId === 'function' ? useId() : Math.random().toString(36).slice(2, 8)
const gradientId = `bitlock-gradient-${uid}`
const fillId = `bitlock-fill-${uid}`
const fillStart = computed(() => props.variant === 'mono' ? '#FFFFFF' : 'rgba(255,255,255,0.95)')
const fillEnd = computed(() => props.variant === 'mono' ? '#E5E7EB' : 'rgba(255,255,255,0.82)')
const dotFill = computed(() => props.variant === 'mono' ? '#111827' : '#0F172A')
const outlineStroke = computed(() => props.variant === 'mono' ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.42)')
</script>
