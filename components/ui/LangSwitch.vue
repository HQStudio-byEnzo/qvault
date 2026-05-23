<template>
  <button
    @click="toggle"
    class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-800 border border-surface-700 text-xs font-medium text-surface-300 hover:text-white hover:border-surface-600 transition-all"
  >
    <span>{{ locale === 'fr' ? '🇫🇷' : '🇬🇧' }}</span>
    <span>{{ locale === 'fr' ? 'FR' : 'EN' }}</span>
  </button>
</template>

<script setup lang="ts">
const { locale, setLocale } = useLang()

function toggle() {
  setLocale(locale.value === 'fr' ? 'en' : 'fr')
}
</script>
