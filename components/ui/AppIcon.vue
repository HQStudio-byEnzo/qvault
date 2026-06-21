<template>
  <svg
    v-if="variant === 'shield'"
    :width="pixelSize"
    :height="pixelSize"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 6v10" class="opacity-60" />
    <path d="M9 11h6" class="opacity-60" />
    <circle cx="12" cy="11" r="1.5" class="fill-current opacity-80" />
  </svg>

  <svg
    v-else-if="variant === 'key'"
    :width="pixelSize"
    :height="pixelSize"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
  >
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="M11.5 11.5l7-7M15.5 4.5l2.5 2.5M18.5 7.5l1.5-1.5" />
    <circle cx="7.5" cy="15.5" r="1.5" class="fill-current opacity-70" />
    <path d="M6 14a2 2 0 0 1 3 0" class="opacity-50" />
  </svg>

  <svg
    v-else-if="variant === 'link'"
    :width="pixelSize"
    :height="pixelSize"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
  >
    <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2" />
    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" class="opacity-90" />
    <circle cx="12" cy="12" r="2" class="fill-surface-950 stroke-current" />
  </svg>

  <svg
    v-else-if="variant === 'bitcoin'"
    :width="pixelSize"
    :height="pixelSize"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6v12M10 8h3a2.5 2.5 0 0 1 0 5H10M10 11h4a2.5 2.5 0 0 1 0 5h-4" />
    <path d="M8 8h2M8 16h2" class="opacity-70" />
  </svg>

  <svg
    v-else-if="variant === 'lock'"
    :width="pixelSize"
    :height="pixelSize"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
  >
    <rect x="4" y="10" width="16" height="11" rx="2" ry="2" />
    <path d="M7 10V7a5 5 0 0 1 10 0v3" />
    <circle cx="12" cy="15" r="1.5" class="fill-current" />
  </svg>

  <svg
    v-else-if="variant === 'unlock'"
    :width="pixelSize"
    :height="pixelSize"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
  >
    <rect x="4" y="10" width="16" height="11" rx="2" ry="2" />
    <path d="M7 10V7a5 5 0 0 1 9.9-1" class="opacity-90" />
    <circle cx="12" cy="15" r="1.5" class="fill-current" />
  </svg>

  <svg
    v-else-if="variant === 'wand'"
    :width="pixelSize"
    :height="pixelSize"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
  >
    <path d="M19 2L5 16l3 3L22 5z" />
    <path d="M11.5 6.5l2 2" class="opacity-70" />
    <path d="M2 2h2M6 2v2M2 6h2" class="opacity-80" />
    <circle cx="4" cy="4" r="0.5" class="fill-current" />
  </svg>

  <svg
    v-else-if="variant === 'recovery'"
    :width="pixelSize"
    :height="pixelSize"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 10h18M3 14h18" class="opacity-40" />
    <path d="M7 7h10" />
    <path d="M10 17h4" />
    <circle cx="5" cy="12" r="1" class="fill-current" />
    <circle cx="19" cy="12" r="1" class="fill-current" />
  </svg>

  <svg
    v-else-if="variant === 'audit'"
    :width="pixelSize"
    :height="pixelSize"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>

  <AppIcon
    v-else
    :name="name"
    :class="className"
    :style="iconStyle"
  />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string
  size?: string | number
  class?: string | string[] | Record<string, boolean>
}>(), {
  size: 20,
  class: '',
})

const variant = computed(() => {
  const value = props.name

  if (['lucide:shield', 'lucide:shield-check'].includes(value)) return 'shield'
  if (value === 'lucide:key-round') return 'key'
  if (value === 'lucide:link') return 'link'
  if (value === 'lucide:bitcoin') return 'bitcoin'
  if (['lucide:lock', 'lucide:vault'].includes(value)) return 'lock'
  if (value === 'lucide:unlock') return 'unlock'
  if (value === 'lucide:wand-sparkles') return 'wand'
  if (['lucide:ticket-check', 'lucide:hash'].includes(value)) return 'recovery'
  if (['lucide:shield-alert', 'lucide:file-text'].includes(value)) return 'audit'

  return 'fallback'
})

const pixelSize = computed(() => {
  if (typeof props.size === 'number') return props.size
  const asNumber = Number.parseFloat(props.size)
  return Number.isFinite(asNumber) ? asNumber : 20
})

const className = computed(() => props.class)
const iconStyle = computed(() => ({ width: `${pixelSize.value}px`, height: `${pixelSize.value}px` }))
</script>
