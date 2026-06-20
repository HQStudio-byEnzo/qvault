<template>
  <div class="min-h-screen bg-surface-950 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-12">
        <NuxtLink to="/" class="inline-flex items-center gap-2 mb-6 text-accent-400 hover:text-accent-300">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          <span>{{ t('common.back') }}</span>
        </NuxtLink>
        <h1 class="text-4xl font-semibold text-white mb-2">{{ t('legal.notices.title') }}</h1>
      </div>

      <div class="prose prose-invert max-w-none space-y-8 text-surface-300">
        <section>
          <h2 class="text-2xl font-semibold text-white mb-4">1. Website publisher</h2>
          <p>BitLock is published by Enzo Izinga, acting as an individual on behalf of the RootLayer collective.</p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li><strong>Contact:</strong> <a href="mailto:enzoizinga23@gmail.com" class="text-accent-400 hover:text-accent-300">enzoizinga23@gmail.com</a></li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-white mb-4">2. Website hosting</h2>
          <p>The front-end website is hosted by:</p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li><strong>Host:</strong> Vercel Inc.</li>
            <li><strong>Address:</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, United States</li>
            <li><strong>Website:</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" class="text-accent-400 hover:text-accent-300">https://vercel.com</a></li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-white mb-4">3. Database hosting</h2>
          <p>Encrypted data and user accounts are stored by:</p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li><strong>Host:</strong> Turso (ChikiLabs Inc.)</li>
            <li><strong>Website:</strong> <a href="https://turso.tech" target="_blank" rel="noopener noreferrer" class="text-accent-400 hover:text-accent-300">https://turso.tech</a></li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useLang()
</script>
