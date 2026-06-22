<template>
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="shrink-0 drop-shadow-[0_10px_30px_rgba(124,58,237,0.35)]"
    :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true"
  >
    <path
      d="M32 6L14 12v18c0 13.4 8.4 25.4 18 30 9.6-4.6 18-16.6 18-30V12L32 6Z"
      fill="#6d28d9"
      stroke="#c084fc"
      stroke-width="1.75"
      stroke-linejoin="round"
    />
    <path
      d="M32 11.2 18.2 15.8v14.2c0 10.5 6 19.5 13.8 23.4 7.8-3.9 13.8-12.9 13.8-23.4V15.8L32 11.2Z"
      fill="#4c1d95"
      opacity="0.65"
    />
    <path
      d="M22 27.2 32 17.2l10 10"
      stroke="#f5f3ff"
      stroke-width="2.3"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.98"
    />
    <path
      d="M26 28.2 32 34.2l6-6"
      stroke="#ede9fe"
      stroke-width="2.3"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.9"
    />
    <circle cx="32" cy="27" r="1.9" fill="#f5f3ff" opacity="0.92" />
    <path
      d="M20.5 16.6 32 12.7l11.5 3.9"
      stroke="#e9d5ff"
      stroke-width="1.4"
      stroke-linecap="round"
      opacity="0.75"
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
