<template>
  <button
    @click="toggle"
    class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-800 border border-surface-700 text-xs font-medium text-surface-300 hover:text-white hover:border-surface-600 transition-all"
  >
    <svg v-if="locale === 'fr'" class="w-4 h-3 rounded-sm" viewBox="0 0 640 480">
      <rect width="213" height="480" fill="#002395"/>
      <rect x="213" width="214" height="480" fill="#fff"/>
      <rect x="427" width="213" height="480" fill="#ed2939"/>
    </svg>
    <svg v-else class="w-4 h-3 rounded-sm" viewBox="0 0 640 480">
      <rect width="640" height="480" fill="#012169"/>
      <path d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z" fill="#fff"/>
      <path d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" fill="#C8102E"/>
      <path d="M241 0v480h160V0H241zM0 160v160h640V160H0z" fill="#fff"/>
      <path d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" fill="#C8102E"/>
    </svg>
    <span>{{ locale === 'fr' ? 'FR' : 'EN' }}</span>
  </button>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'

const { locale, setLocale } = useLang()

function toggle() {
  setLocale(locale.value === 'fr' ? 'en' : 'fr')
}
</script>
