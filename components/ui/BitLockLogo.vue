<template>
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="shrink-0 drop-shadow-[0_10px_30px_rgba(124,58,237,0.38)]"
    :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true"
  >
    <path
      d="M32 6 14 12.2v17.4c0 13.2 8.2 24.9 18 29.4 9.8-4.5 18-16.2 18-29.4V12.2L32 6Z"
      fill="#5b21b6"
      stroke="#d8b4fe"
      stroke-width="1.8"
      stroke-linejoin="round"
    />
    <path
      d="M32 10.8 18.8 15v13.2c0 10 5.6 18.7 13.2 22.5 7.6-3.8 13.2-12.5 13.2-22.5V15L32 10.8Z"
      fill="#3b0764"
      opacity="0.72"
    />
    <path
      d="M22.2 27.4 32 17.6l9.8 9.8"
      stroke="#faf5ff"
      stroke-width="2.35"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.98"
    />
    <path
      d="M25.8 28.2 32 34.4l6.2-6.2"
      stroke="#f5f3ff"
      stroke-width="2.35"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.9"
    />
    <circle cx="32" cy="27" r="2" fill="#faf5ff" opacity="0.95" />
    <path
      d="M19.8 16.2 32 12.1l12.2 4.1"
      stroke="#e9d5ff"
      stroke-width="1.45"
      stroke-linecap="round"
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
