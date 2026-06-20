<template>
  <div class="px-6 py-12 lg:px-8">
    <div class="mx-auto max-w-4xl space-y-8">
      <header class="space-y-3">
        <p class="text-xs uppercase tracking-[0.2em] text-accent-400">{{ t('legal.cgu.badge') }}</p>
        <h1 class="text-3xl font-semibold text-white">{{ t('legal.cgu.titlePage') }}</h1>
        <p class="text-sm text-surface-500">{{ t('legal.cgu.updated') }}</p>
      </header>

      <section class="card space-y-4 leading-relaxed text-surface-300">
        <p>{{ t('legal.cgu.intro') }}</p>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.cgu.serviceTitle') }}</h2>
          <p>{{ t('legal.cgu.serviceDesc') }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.cgu.zeroTitle') }}</h2>
          <p>{{ t('legal.cgu.zeroDesc') }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.cgu.accountTitle') }}</h2>
          <p>{{ t('legal.cgu.accountDesc') }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.cgu.ipTitle') }}</h2>
          <p>{{ t('legal.cgu.ipDesc') }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.cgu.warrantyTitle') }}</h2>
          <p>{{ t('legal.cgu.warrantyDesc') }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.cgu.useTitle') }}</h2>
          <p>{{ t('legal.cgu.useDesc') }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.cgu.lawTitle') }}</h2>
          <p>{{ t('legal.cgu.lawDesc') }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useLang()
useSeoMeta({ title: `BitLock - ${t('legal.cgu.titlePage')}` })
</script>
