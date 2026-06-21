<template>
  <NuxtLink
    v-if="showButton"
    to="/"
    class="fixed bottom-4 right-4 z-[70] inline-flex items-center gap-2 rounded-full border border-surface-700 bg-surface-900/95 px-4 py-2 text-sm font-medium text-surface-200 shadow-2xl backdrop-blur-xl transition-all hover:border-surface-600 hover:text-white hover:-translate-y-0.5"
  >
    <Icon name="lucide:arrow-left" class="h-4 w-4" />
    {{ t('nav.backHome') }}
  </NuxtLink>
</template>

<script setup lang="ts">
const route = useRoute()
const { t } = useLang()

const showButton = computed(() => route.path !== '/')
</script>
