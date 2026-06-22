<template>
  <NuxtLink
    v-if="showButton"
    to="/"
    class="fixed top-4 left-1/2 z-[90] inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-accent-500/30 bg-surface-950/96 px-5 py-2.5 text-sm font-semibold text-surface-100 shadow-2xl shadow-black/35 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-accent-400/50 hover:text-white"
  >
    <Icon name="lucide:arrow-left" class="h-4 w-4 text-accent-300" />
    {{ t('nav.backHome') }}
  </NuxtLink>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'

const route = useRoute()
const { t } = useLang()

const showButton = computed(() => route.path !== '/')
</script>
