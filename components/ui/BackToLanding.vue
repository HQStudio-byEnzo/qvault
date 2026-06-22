<template>
  <NuxtLink
    v-if="showButton"
    to="/"
    class="fixed left-4 top-4 z-[100] inline-flex items-center gap-3 rounded-full border border-violet-400/30 bg-surface-950/96 px-4 py-2.5 text-sm font-semibold text-surface-100 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-violet-300/60 hover:text-white hover:shadow-violet-950/20"
  >
    <BitLockLogo :size="26" />
    <span class="whitespace-nowrap">{{ t('nav.backHome') }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'

const route = useRoute()
const { t } = useLang()

const showButton = computed(() => route.path !== '/')
</script>
