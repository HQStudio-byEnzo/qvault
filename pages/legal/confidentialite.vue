<template>
  <div class="px-6 py-12 lg:px-8">
    <div class="mx-auto max-w-4xl space-y-8">
      <header class="space-y-3">
        <p class="text-xs uppercase tracking-[0.2em] text-accent-400">{{ t('legal.privacy.badge') }}</p>
        <h1 class="text-3xl font-semibold text-white">{{ t('legal.privacy.titlePage') }}</h1>
        <p class="text-sm text-surface-500">{{ t('legal.privacy.updated') }}</p>
      </header>

      <section class="card space-y-4 leading-relaxed text-surface-300">
        <p>{{ t('legal.privacy.intro') }}</p>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.privacy.controllerTitle') }}</h2>
          <p>{{ t('legal.privacy.controllerDesc') }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.privacy.zeroTitle') }}</h2>
          <p>{{ t('legal.privacy.zeroDesc') }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.privacy.dataTitle') }}</h2>
          <p>{{ t('legal.privacy.dataDesc') }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.privacy.basisTitle') }}</h2>
          <p>{{ t('legal.privacy.basisDesc') }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.privacy.hostingTitle') }}</h2>
          <p>{{ t('legal.privacy.hostingDesc') }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.privacy.retentionTitle') }}</h2>
          <p>{{ t('legal.privacy.retentionDesc') }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.privacy.rightsTitle') }}</h2>
          <p>{{ t('legal.privacy.rightsDesc') }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useLang()
useSeoMeta({ title: `BitLock - ${t('legal.privacy.titlePage')}` })
</script>
