<template>
  <div class="min-h-screen bg-surface-950 text-white">
    <main v-if="feature" class="section-shell max-w-7xl py-10 md:py-16 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10">
      <section class="space-y-6">
        <NuxtLink to="/features" class="inline-flex items-center gap-2 text-sm text-accent-300 hover:text-accent-200">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          {{ t('featuresIndex.back') }}
        </NuxtLink>
        <div class="space-y-4">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center" :class="feature.badgeClass">
            <Icon :name="feature.icon" class="w-6 h-6" :class="feature.iconClass" />
          </div>
          <h1 class="text-4xl md:text-5xl font-semibold tracking-tight">{{ feature.title }}</h1>
          <p class="text-lg text-surface-400 leading-relaxed max-w-2xl">{{ feature.summary }}</p>
        </div>

        <div class="grid gap-4">
          <article v-for="point in feature.points" :key="point" class="card">
            <p class="text-surface-300 leading-relaxed">{{ point }}</p>
          </article>
        </div>
      </section>

      <aside class="space-y-4">
        <div class="card space-y-4">
          <h2 class="text-lg font-semibold">{{ t('featuresIndex.whatYouGet') }}</h2>
          <ul class="space-y-3 text-sm text-surface-300">
            <li v-for="item in feature.points" :key="item">• {{ item }}</li>
          </ul>
        </div>
        <div class="card space-y-4">
          <h2 class="text-lg font-semibold">{{ t('featuresIndex.relatedActions') }}</h2>
          <div class="flex flex-col gap-3">
            <NuxtLink v-if="feature.slug === 'recovery'" to="/dashboard/recovery-codes" class="btn-primary text-center w-full">{{ t('featuresIndex.openRecoveryCodes') }}</NuxtLink>
            <NuxtLink v-else to="/auth/register" class="btn-primary text-center w-full">{{ t('featuresIndex.createVault') }}</NuxtLink>
            <NuxtLink v-if="feature.slug === 'passwords'" to="/generateur-mot-de-passe" class="btn-secondary text-center w-full">{{ t('featuresIndex.useGenerator') }}</NuxtLink>
          </div>
        </div>
      </aside>
    </main>

    <main v-else class="section-shell max-w-4xl py-10 md:py-16">
      <NuxtLink to="/features" class="inline-flex items-center gap-2 text-sm text-accent-300 hover:text-accent-200">
        <Icon name="lucide:arrow-left" class="w-4 h-4" />
        {{ t('featuresIndex.back') }}
      </NuxtLink>
      <div class="card mt-6">
        <h1 class="text-2xl font-semibold">{{ t('featuresIndex.notFound') }}</h1>
        <p class="text-surface-400 mt-2">{{ t('featuresIndex.notFoundDesc') }}</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
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
