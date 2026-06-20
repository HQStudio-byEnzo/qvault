<template>
  <div class="inline-flex items-center gap-3 select-none">
    <div
      class="rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/35 border border-white/10 bg-gradient-to-br from-emerald-500 via-emerald-400 to-accent-600"
      :style="{ width: `${size}px`, height: `${size}px` }"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="block"
        :style="{ width: `${Math.max(14, Math.round(size * 0.56))}px`, height: `${Math.max(14, Math.round(size * 0.56))}px` }"
      >
        <path
          d="M12 2.5L19.5 5.3V11.2C19.5 16.2 16.1 20.7 12 21.5C7.9 20.7 4.5 16.2 4.5 11.2V5.3L12 2.5Z"
          fill="white"
          fill-opacity="0.15"
        />
        <path
          d="M12 5L17 6.9V11.1C17 14.9 14.7 18.3 12 19C9.3 18.3 7 14.9 7 11.1V6.9L12 5Z"
          fill="white"
        />
        <path
          d="M12 8.1C10.5 8.1 9.3 9.3 9.3 10.8V12.1H8.5V16H15.5V12.1H14.7V10.8C14.7 9.3 13.5 8.1 12 8.1ZM12 9.4C12.7 9.4 13.3 10 13.3 10.8V12.1H10.7V10.8C10.7 10 11.3 9.4 12 9.4Z"
          fill="#0f172a"
        />
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
}>(), {
  size: 40,
  showWordmark: false,
  label: 'BitLock logo',
  tagline: 'Security vault',
})
</script>
