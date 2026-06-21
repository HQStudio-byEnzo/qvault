<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="shrink-0 drop-shadow-[0_10px_30px_rgba(124,58,237,0.2)]"
    :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bitlock-shield-gradient" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
        <stop stop-color="#c084fc" />
        <stop offset="1" stop-color="#6d28d9" />
      </linearGradient>
    </defs>
    <path
      d="M12 2.5L5 5.2V11c0 4.9 3.2 8.9 7 10.5 3.8-1.6 7-5.6 7-10.5V5.2L12 2.5Z"
      fill="url(#bitlock-shield-gradient)"
      stroke="#8b5cf6"
      stroke-width="1.2"
      stroke-linejoin="round"
    />
    <path
      d="M12 5.2l5.1 2v3.9c0 3.6-2.2 6.6-5.1 8-2.9-1.4-5.1-4.4-5.1-8V7.2l5.1-2Z"
      fill="#4c1d95"
      opacity="0.48"
    />
    <path
      d="M7.8 12.3l4.2-4.2 4.2 4.2"
      stroke="#f5f3ff"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.95"
    />
    <path
      d="M9.6 12.3l2.4 2.4 2.4-2.4"
      stroke="#f5f3ff"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.8"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
}>(), {
  size: 40,
})
</script>
