<template>
  <main class="page-shell content-stack pt-24 md:pt-28">
    <header class="max-w-3xl space-y-4">
      <p class="workbench-section__index">01 / {{ t('nav.features') }}</p>
      <h1 class="text-4xl font-bold tracking-tight md:text-6xl">{{ t('featuresIndex.title') }}</h1>
      <p class="max-w-2xl text-lg leading-relaxed text-surface-300">{{ t('featuresIndex.subtitle') }}</p>
    </header>

    <section class="feature-catalog" aria-label="Feature catalog">
      <NuxtLink
        v-for="feature in features"
        :key="feature.slug"
        :to="`/features/${feature.slug}`"
        class="feature-catalog__row"
      >
        <span class="feature-mark"><Icon :name="feature.icon" class="h-5 w-5" /></span>
        <span>
          <strong>{{ feature.title }}</strong>
          <p>{{ feature.summary }}</p>
        </span>
        <span class="feature-catalog__arrow" aria-hidden="true">↗</span>
      </NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'

definePageMeta({ layout: 'default' })
const { t } = useLang()
useSeoMeta({
  title: t('featuresIndex.seoTitle'),
  description: t('featuresIndex.seoDesc'),
})

const { features } = useFeatureCatalog()
</script>
