<template>
  <div>
    <UiPublicNav />

    <main class="mx-auto w-full max-w-[76rem] px-6 py-14 md:px-10 md:py-20">
      <header class="max-w-3xl">
        <p class="eyebrow">{{ t('nav.features') }}</p>
        <h1 class="mt-4 font-display text-4xl font-semibold tracking-tight text-surface-50 md:text-5xl">{{ t('featuresIndex.title') }}</h1>
        <p class="mt-4 text-lg leading-relaxed text-surface-500">{{ t('featuresIndex.subtitle') }}</p>
      </header>

      <section class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" :aria-label="t('features.title')">
        <NuxtLink
          v-for="feature in features"
          :key="feature.slug"
          :to="`/features/${feature.slug}`"
          class="card flex flex-col gap-3 p-5 transition-colors hover:border-accent-500/40"
        >
          <span class="grid h-10 w-10 place-items-center rounded-lg bg-accent-500/10 text-accent-text">
            <Icon :name="feature.icon" class="h-5 w-5" />
          </span>
          <h2 class="font-display text-lg font-semibold text-surface-50">{{ feature.title }}</h2>
          <p class="flex-1 text-sm leading-relaxed text-surface-500">{{ feature.summary }}</p>
          <span class="inline-flex items-center gap-1 text-sm font-semibold text-accent-text">
            {{ t('landing.readMore') }}
            <Icon name="hugeicons:arrow-right-01" class="h-4 w-4" />
          </span>
        </NuxtLink>
      </section>

      <section class="mt-12" :aria-label="t('featuresIndex.crossLabel')">
        <h2 class="font-display text-2xl font-semibold tracking-tight text-surface-50">{{ t('featuresIndex.crossTitle') }}</h2>
        <p class="mt-2 max-w-2xl text-sm leading-relaxed text-surface-500">{{ t('featuresIndex.crossDesc') }}</p>
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <NuxtLink to="/features/encryption" class="card cross">
            <strong>{{ t('featuresIndex.crossEncryptionTitle') }}</strong>
            <span>{{ t('featuresIndex.crossEncryptionDesc') }}</span>
          </NuxtLink>
          <NuxtLink to="/features/passwords" class="card cross">
            <strong>{{ t('featuresIndex.crossPasswordsTitle') }}</strong>
            <span>{{ t('featuresIndex.crossPasswordsDesc') }}</span>
          </NuxtLink>
          <NuxtLink to="/features/recovery" class="card cross">
            <strong>{{ t('featuresIndex.crossRecoveryTitle') }}</strong>
            <span>{{ t('featuresIndex.crossRecoveryDesc') }}</span>
          </NuxtLink>
          <NuxtLink to="/features/crypto" class="card cross">
            <strong>{{ t('featuresIndex.crossCryptoTitle') }}</strong>
            <span>{{ t('featuresIndex.crossCryptoDesc') }}</span>
          </NuxtLink>
          <NuxtLink to="/guides/comparatif-coffre-fort-mots-de-passe" class="card cross">
            <strong>{{ t('featuresIndex.crossCompareTitle') }}</strong>
            <span>{{ t('featuresIndex.crossCompareDesc') }}</span>
          </NuxtLink>
          <NuxtLink to="/guides/alternative-bitwarden" class="card cross">
            <strong>{{ t('featuresIndex.crossBitwardenTitle') }}</strong>
            <span>{{ t('featuresIndex.crossBitwardenDesc') }}</span>
          </NuxtLink>
          <NuxtLink to="/features/links" class="card cross">
            <strong>{{ t('featuresIndex.crossLinksTitle') }}</strong>
            <span>{{ t('featuresIndex.crossLinksDesc') }}</span>
          </NuxtLink>
          <NuxtLink to="/features/favorites" class="card cross">
            <strong>{{ t('featuresIndex.crossFavoritesTitle') }}</strong>
            <span>{{ t('featuresIndex.crossFavoritesDesc') }}</span>
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
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

<style scoped>
.cross {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4);
  text-decoration: none;
}
</style>
