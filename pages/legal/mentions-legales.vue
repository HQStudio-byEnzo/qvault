<template>
  <div class="legal-shell">
      <header class="space-y-3">
        <p class="eyebrow">{{ t('legal.mentions.badge') }}</p>
        <h1 class="text-3xl font-bold text-white">{{ t('legal.mentions.title') }}</h1>
      </header>

      <section class="legal-card">
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
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useLang()
useSeoMeta({ title: `BitLock - ${t('legal.mentions.title')}` })
</script>
