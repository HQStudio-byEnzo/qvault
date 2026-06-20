<template>
  <div class="px-6 py-12 lg:px-8">
    <div class="mx-auto max-w-4xl space-y-8">
      <header class="space-y-3">
        <p class="text-xs uppercase tracking-[0.2em] text-accent-400">{{ t('legal.mentions.badge') }}</p>
        <h1 class="text-3xl font-semibold text-white">{{ t('legal.mentions.title') }}</h1>
      </header>

      <section class="card space-y-4 leading-relaxed text-surface-300">
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.mentions.publisherTitle') }}</h2>
          <p>{{ t('legal.mentions.publisherDesc') }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.mentions.hostingTitle') }}</h2>
          <p>{{ t('legal.mentions.hostingDesc') }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">{{ t('legal.mentions.dbTitle') }}</h2>
          <p>{{ t('legal.mentions.dbDesc') }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useLang()
useSeoMeta({ title: `BitLock - ${t('legal.mentions.title')}` })
</script>
