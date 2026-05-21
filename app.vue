<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Charger la session au démarrage
const { fetchSession } = useAuthClient()

onMounted(() => {
  fetchSession()
})
</script>
