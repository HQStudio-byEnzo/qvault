<template>
  <div class="min-h-screen text-white">
    <main class="legal-shell">
      <NuxtLink to="/" class="text-accent-300 text-sm">{{ t('changelog.back') }}</NuxtLink>
      <h1 class="text-4xl font-bold mt-6 mb-3">{{ t('changelog.title') }}</h1>
      <p class="text-surface-400 mb-10">{{ t('changelog.subtitle') }}</p>
      <div class="space-y-6">
        <article v-for="entry in entries" :key="entry.version" class="card">
          <div class="flex items-center justify-between gap-4 mb-3">
            <h2 class="text-xl font-semibold">{{ entry.version }}</h2>
            <time class="text-sm text-surface-500">{{ entry.date }}</time>
          </div>
          <ul class="space-y-2 text-surface-300">
            <li v-for="item in entry.items" :key="item">• {{ item }}</li>
          </ul>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useLang()
useSeoMeta({
  title: t('changelog.seoTitle'),
  description: t('changelog.seoDesc'),
})

const entries = computed(() => [
  {
    version: t('changelog.entryVersion'),
    date: t('changelog.entryDate'),
    items: [
      t('changelog.item1'),
      t('changelog.item2'),
      t('changelog.item3'),
      t('changelog.item4'),
    ],
  },
])
</script>
