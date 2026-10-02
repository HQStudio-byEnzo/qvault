<template>
  <div>
    <UiPublicNav />

    <main v-if="feature" class="mx-auto w-full max-w-[76rem] px-6 py-14 md:px-10 md:py-20">
      <NuxtLink to="/features" class="btn-secondary">
        <Icon name="hugeicons:arrow-left-01" class="h-4 w-4" />
        {{ t('featuresIndex.back') }}
      </NuxtLink>

      <div class="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <section>
          <span class="grid h-11 w-11 place-items-center rounded-lg bg-accent-500/10 text-accent-text">
            <Icon :name="feature.icon" class="h-5 w-5" />
          </span>
          <h1 class="mt-4 font-display text-4xl font-semibold tracking-tight text-surface-50 md:text-5xl">{{ feature.title }}</h1>
          <p class="mt-4 max-w-2xl text-lg leading-relaxed text-surface-500">{{ feature.summary }}</p>

          <ul class="mt-8 space-y-4">
            <li v-for="point in feature.points" :key="point" class="flex items-start gap-3 text-surface-300">
              <Icon name="hugeicons:check" class="mt-1 h-4 w-4 flex-none text-accent-text" />
              <span>{{ point }}</span>
            </li>
          </ul>
        </section>

        <aside class="card h-fit p-5 md:p-6">
          <h2 class="font-display text-lg font-semibold text-surface-50">{{ t('featuresIndex.relatedActions') }}</h2>
          <p class="mt-2 text-sm text-surface-500">{{ t('featuresIndex.whatYouGet') }}</p>
          <div class="mt-5 space-y-3">
            <NuxtLink v-if="feature.slug === 'recovery'" to="/dashboard/recovery-codes" class="btn-primary w-full">{{ t('featuresIndex.openRecoveryCodes') }}</NuxtLink>
            <NuxtLink v-else to="/auth/register" class="btn-primary w-full">{{ t('featuresIndex.createVault') }}</NuxtLink>
            <NuxtLink v-if="feature.slug === 'passwords'" to="/generateur-mot-de-passe" class="btn-secondary w-full">{{ t('featuresIndex.useGenerator') }}</NuxtLink>
            <NuxtLink v-if="featureGuide" :to="featureGuide.to" class="btn-secondary w-full">{{ featureGuide.label }}</NuxtLink>
          </div>

          <div v-if="crossLinks.length" class="mt-6 space-y-3 border-t border-surface-800 pt-5">
            <h2 class="font-display text-sm font-semibold text-surface-50">{{ t('featuresIndex.nextTitle') }}</h2>
            <NuxtLink v-for="link in crossLinks" :key="link.to" :to="link.to" class="cross">
              <strong>{{ link.title }}</strong>
              <span>{{ link.desc }}</span>
            </NuxtLink>
          </div>
        </aside>
      </div>
    </main>

    <main v-else class="mx-auto w-full max-w-[64rem] px-6 py-20 md:px-10">
      <NuxtLink to="/features" class="btn-secondary">
        <Icon name="hugeicons:arrow-left-01" class="h-4 w-4" />
        {{ t('featuresIndex.back') }}
      </NuxtLink>
      <section class="card mt-6 p-6">
        <h1 class="font-display text-2xl font-semibold text-surface-50">{{ t('featuresIndex.notFound') }}</h1>
        <p class="mt-2 text-surface-500">{{ t('featuresIndex.notFoundDesc') }}</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'

definePageMeta({ layout: 'default' })

const { t, locale } = useLang()
const route = useRoute()
const { getFeature } = useFeatureCatalog()
const feature = computed(() => getFeature(String(route.params.slug)))

/**
 * Cross-promotion between feature pages. Each target is linked from at least
 * two other feature pages, so no feature page stays an orphan.
 */
const FEATURE_LINKS: Record<string, { to: string; title: string; desc: string }[]> = {
  links: [
    { to: '/features/favorites', title: 'featuresIndex.crossFavoritesTitle', desc: 'featuresIndex.crossFavoritesDesc' },
    { to: '/features/passwords', title: 'featuresIndex.crossPasswordsTitle', desc: 'featuresIndex.crossPasswordsDesc' },
    { to: '/features/crypto', title: 'featuresIndex.crossCryptoTitle', desc: 'featuresIndex.crossCryptoDesc' },
  ],
  passwords: [
    { to: '/features/recovery', title: 'featuresIndex.crossRecoveryTitle', desc: 'featuresIndex.crossRecoveryDesc' },
    { to: '/features/encryption', title: 'featuresIndex.crossEncryptionTitle', desc: 'featuresIndex.crossEncryptionDesc' },
    { to: '/features/crypto', title: 'featuresIndex.crossCryptoTitle', desc: 'featuresIndex.crossCryptoDesc' },
  ],
  crypto: [
    { to: '/features/encryption', title: 'featuresIndex.crossEncryptionTitle', desc: 'featuresIndex.crossEncryptionDesc' },
    { to: '/features/recovery', title: 'featuresIndex.crossRecoveryTitle', desc: 'featuresIndex.crossRecoveryDesc' },
    { to: '/features/passwords', title: 'featuresIndex.crossPasswordsTitle', desc: 'featuresIndex.crossPasswordsDesc' },
  ],
  encryption: [
    { to: '/features/passwords', title: 'featuresIndex.crossPasswordsTitle', desc: 'featuresIndex.crossPasswordsDesc' },
    { to: '/features/crypto', title: 'featuresIndex.crossCryptoTitle', desc: 'featuresIndex.crossCryptoDesc' },
  ],
  favorites: [
    { to: '/features/links', title: 'featuresIndex.crossLinksTitle', desc: 'featuresIndex.crossLinksDesc' },
    { to: '/features/passwords', title: 'featuresIndex.crossPasswordsTitle', desc: 'featuresIndex.crossPasswordsDesc' },
    { to: '/features/crypto', title: 'featuresIndex.crossCryptoTitle', desc: 'featuresIndex.crossCryptoDesc' },
  ],
  recovery: [
    { to: '/features/passwords', title: 'featuresIndex.crossPasswordsTitle', desc: 'featuresIndex.crossPasswordsDesc' },
    { to: '/features/crypto', title: 'featuresIndex.crossCryptoTitle', desc: 'featuresIndex.crossCryptoDesc' },
  ],
}

const crossLinks = computed(() =>
  (FEATURE_LINKS[String(route.params.slug)] ?? []).map(link => ({
    to: link.to,
    title: t(link.title),
    desc: t(link.desc),
  })),
)

const guides: Record<string, { to: string; labelFr: string; labelEn: string }> = {
  seed: { to: '/guides/stocker-seed-phrase', labelFr: 'Où stocker une seed phrase', labelEn: 'Where to store a seed phrase' },
  passwords: { to: '/guides/gerer-ses-mots-de-passe', labelFr: 'Gérer ses mots de passe', labelEn: 'Managing your passwords' },
  compare: { to: '/guides/comparatif-coffre-fort-mots-de-passe', labelFr: 'Comparatif des coffres-forts', labelEn: 'Password vault comparison' },
}

const featureGuide = computed(() => {
  const found = guides[feature.value?.slug ?? '']
  if (!found) return null
  return { to: found.to, label: locale.value === 'en' ? found.labelEn : found.labelFr }
})

useSeoMeta({
  title: feature.value ? feature.value.seoTitle : t('featuresIndex.seoTitle'),
  description: feature.value?.summary || t('featuresIndex.seoDesc'),
})
</script>

<style scoped>
.cross {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-3);
  text-decoration: none;
}

.cross strong {
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 600;
}

.cross span {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  line-height: 1.5;
}

@media (hover: hover) and (pointer: fine) {
  .cross:hover { border-color: var(--color-accent-rule); }
}
</style>
