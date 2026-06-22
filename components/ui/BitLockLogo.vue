<template>
  <span
    class="inline-flex items-center justify-center shrink-0"
    aria-label="BitLock"
  >
    <svg
      :width="resolvedSize"
      :height="resolvedSize"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="drop-shadow-[0_12px_28px_rgba(91,33,182,0.35)]"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bitlock-shield-fill" x1="14" y1="8" x2="52" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#A78BFA" />
          <stop offset="0.42" stop-color="#7C3AED" />
          <stop offset="1" stop-color="#4C1D95" />
        </linearGradient>
        <linearGradient id="bitlock-shield-stroke" x1="12" y1="6" x2="54" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#DDD6FE" />
          <stop offset="1" stop-color="#6D28D9" />
        </linearGradient>
      </defs>

      <path
        d="M32 4L51.5 11.4V28.1C51.5 41.7 43.9 53.8 32 60C20.1 53.8 12.5 41.7 12.5 28.1V11.4L32 4Z"
        fill="url(#bitlock-shield-fill)"
      />
      <path
        d="M32 7.8L48.2 13.8V27.8C48.2 39.4 41.9 49.8 32 55.4C22.1 49.8 15.8 39.4 15.8 27.8V13.8L32 7.8Z"
        stroke="url(#bitlock-shield-stroke)"
        stroke-width="2.5"
        stroke-linejoin="round"
        opacity="0.9"
      />
      <path
        d="M32 17.5C27.6 17.5 24 21.1 24 25.5C24 28.3 25.5 30.7 27.8 32.1V37.1C27.8 39.4 29.7 41.3 32 41.3C34.3 41.3 36.2 39.4 36.2 37.1V32.1C38.5 30.7 40 28.3 40 25.5C40 21.1 36.4 17.5 32 17.5Z"
        fill="#2E1065"
        opacity="0.35"
      />
      <path
        d="M32 19.5C28.7 19.5 26 22.2 26 25.5C26 27.8 27.3 29.7 29.2 30.7V37C29.2 38.5 30.5 39.8 32 39.8C33.5 39.8 34.8 38.5 34.8 37V30.7C36.7 29.7 38 27.8 38 25.5C38 22.2 35.3 19.5 32 19.5Z"
        fill="#F5F3FF"
      />
      <circle cx="32" cy="25.5" r="2.8" fill="#7C3AED" />
      <path
        d="M24.5 15.8C28.6 13.1 34.1 12.1 39.7 13.6"
        stroke="#E9D5FF"
        stroke-width="1.8"
        stroke-linecap="round"
        opacity="0.45"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  size?: number
}>()

const resolvedSize = computed(() => props.size ?? 44)
</script>
