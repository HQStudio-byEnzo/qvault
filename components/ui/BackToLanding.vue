<template>
  <NuxtLink
    v-if="showButton"
    to="/"
    class="fixed left-4 top-4 z-[100] inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-transparent text-surface-100 transition-all hover:-translate-y-0.5 md:left-6 md:top-6"
    aria-label="Return to landing page"
  >
    <UiBitLockLogo :size="44" />
  </NuxtLink>
</template>

<script setup lang="ts">
const route = useRoute()

const showButton = computed(() => route.path !== '/')
</script>
