<template>
  <div class="inline-flex items-center gap-3 select-none align-middle">
    <div
      class="relative overflow-hidden rounded-[1.15rem] flex items-center justify-center shrink-0 border border-white/12 bg-gradient-to-br from-emerald-400 via-emerald-500 to-accent-600 shadow-[0_18px_55px_-22px_rgba(16,185,129,0.55)]"
      :style="{ width: `${size}px`, height: `${size}px` }"
      aria-hidden="true"
    >
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_48%)]"></div>
      <div class="absolute inset-[10%] rounded-[0.85rem] border border-white/10 bg-white/5"></div>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="relative block drop-shadow-[0_2px_4px_rgba(15,23,42,0.22)]"
        :style="{ width: `${Math.max(14, Math.round(size * 0.6))}px`, height: `${Math.max(14, Math.round(size * 0.6))}px` }"
      >
        <defs>
          <linearGradient :id="gradientId" x1="5" y1="3" x2="19" y2="21" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ffffff" />
            <stop offset="1" stop-color="#d1fae5" />
          </linearGradient>
        </defs>
        <path
          d="M12 2.45L19.55 5.35V11.25C19.55 16.28 16.17 20.72 12 21.55C7.83 20.72 4.45 16.28 4.45 11.25V5.35L12 2.45Z"
          :fill="`url(#${gradientId})`"
          fill-opacity="0.22"
        />
        <path
          d="M12 4.95L17.1 6.98V11.07C17.1 14.82 14.81 18.08 12 18.84C9.19 18.08 6.9 14.82 6.9 11.07V6.98L12 4.95Z"
          fill="#ffffff"
        />
        <path
          d="M12 7.95C10.51 7.95 9.3 9.16 9.3 10.65V11.92H8.52C8.16 11.92 7.87 12.21 7.87 12.57V15.98C7.87 16.34 8.16 16.63 8.52 16.63H15.48C15.84 16.63 16.13 16.34 16.13 15.98V12.57C16.13 12.21 15.84 11.92 15.48 11.92H14.7V10.65C14.7 9.16 13.49 7.95 12 7.95ZM12 9.25C12.77 9.25 13.4 9.88 13.4 10.65V11.92H10.6V10.65C10.6 9.88 11.23 9.25 12 9.25ZM12 12.9C12.4 12.9 12.72 13.22 12.72 13.62C12.72 13.93 12.53 14.19 12.27 14.29V14.98C12.27 15.12 12.16 15.23 12.02 15.23H11.98C11.84 15.23 11.73 15.12 11.73 14.98V14.29C11.47 14.19 11.28 13.93 11.28 13.62C11.28 13.22 11.6 12.9 12 12.9Z"
          fill="#0f172a"
        />
        <path
          d="M16.8 5.2C17.67 5.2 18.37 5.9 18.37 6.77C18.37 7.64 17.67 8.34 16.8 8.34C15.93 8.34 15.23 7.64 15.23 6.77C15.23 5.9 15.93 5.2 16.8 5.2Z"
          fill="#ffffff"
          fill-opacity="0.82"
        />
      </svg>
    </div>

    <div v-if="showWordmark" class="leading-tight min-w-0">
      <p class="text-[clamp(1.05rem,1.3vw,1.2rem)] font-semibold tracking-[-0.03em] text-white leading-none">BitLock</p>
      <p class="text-[11px] text-surface-400 mt-1 truncate">{{ tagline }}</p>
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

const gradientId = useId().replace(/:/g, '-')
</script>
