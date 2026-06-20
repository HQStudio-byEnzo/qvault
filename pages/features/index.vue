<template>
  <div class="min-h-screen bg-surface-950 text-white">
    <main class="max-w-6xl mx-auto px-6 py-16 space-y-10">
      <header class="max-w-3xl space-y-4">
        <p class="text-sm uppercase tracking-[0.24em] text-accent-300">{{ t('nav.features') }}</p>
        <h1 class="text-4xl md:text-5xl font-semibold tracking-tight">{{ t('featuresIndex.title') }}</h1>
        <p class="text-surface-400 text-lg leading-relaxed">{{ t('featuresIndex.subtitle') }}</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink
          v-for="feature in features"
          :key="feature.slug"
          :to="`/features/${feature.slug}`"
          class="card-hover block"
        >
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="feature.badgeClass">
              <Icon :name="feature.icon" class="w-5 h-5" :class="feature.iconClass" />
            </div>
            <div class="space-y-2">
              <h2 class="text-xl font-semibold">{{ feature.title }}</h2>
              <p class="text-surface-400">{{ feature.summary }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useLang()
useSeoMeta({
  title: t('featuresIndex.seoTitle'),
  description: t('featuresIndex.seoDesc'),
})

const { features } = useFeatureCatalog()
</script>
