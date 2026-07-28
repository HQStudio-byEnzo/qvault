<template>
  <main v-if="feature" class="page-shell grid grid-cols-1 gap-10 pt-24 md:pt-28 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
    <section class="space-y-8">
      <NuxtLink to="/features" class="btn-secondary">
        <Icon name="lucide:arrow-left" class="h-4 w-4" />
        {{ t('featuresIndex.back') }}
      </NuxtLink>

      <header class="max-w-3xl space-y-4">
        <span class="feature-mark"><Icon :name="feature.icon" class="h-5 w-5" /></span>
        <p class="workbench-section__index">feature / {{ feature.slug }}</p>
        <h1 class="text-4xl font-bold tracking-tight md:text-6xl">{{ feature.title }}</h1>
        <p class="max-w-2xl text-lg leading-relaxed text-surface-300">{{ feature.summary }}</p>
      </header>

      <ol class="feature-spec-list">
        <li v-for="point in feature.points" :key="point">{{ point }}</li>
      </ol>
    </section>

    <aside class="dashboard-module h-fit">
      <header class="dashboard-module__head">
        <div>
          <h2>{{ t('featuresIndex.relatedActions') }}</h2>
          <p>{{ t('featuresIndex.whatYouGet') }}</p>
        </div>
        <span class="tech-status">online</span>
      </header>
      <div class="space-y-3 p-4">
        <NuxtLink v-if="feature.slug === 'recovery'" to="/dashboard/recovery-codes" class="btn-primary w-full">{{ t('featuresIndex.openRecoveryCodes') }}</NuxtLink>
        <NuxtLink v-else to="/auth/register" class="btn-primary w-full">{{ t('featuresIndex.createVault') }}</NuxtLink>
        <NuxtLink v-if="feature.slug === 'passwords'" to="/generateur-mot-de-passe" class="btn-secondary w-full">{{ t('featuresIndex.useGenerator') }}</NuxtLink>
      </div>
    </aside>
  </main>

  <main v-else class="legal-shell pt-24 md:pt-28">
    <NuxtLink to="/features" class="btn-secondary">
      <Icon name="lucide:arrow-left" class="h-4 w-4" />
      {{ t('featuresIndex.back') }}
    </NuxtLink>
    <section class="dashboard-module p-6">
      <h1 class="text-2xl font-semibold">{{ t('featuresIndex.notFound') }}</h1>
      <p class="mt-2 text-surface-300">{{ t('featuresIndex.notFoundDesc') }}</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'

definePageMeta({ layout: 'default' })

const { t } = useLang()
const route = useRoute()
const { getFeature } = useFeatureCatalog()
const feature = computed(() => getFeature(String(route.params.slug)))

useSeoMeta({
  title: feature.value ? `${feature.value.title} - BitLock` : 'BitLock',
  description: feature.value?.summary || t('featuresIndex.seoDesc'),
})
</script>
