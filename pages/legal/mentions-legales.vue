<template>
  <div class="px-6 py-12 lg:px-8">
    <div class="mx-auto max-w-4xl space-y-8">
      <header class="space-y-3">
        <p class="text-xs uppercase tracking-[0.2em] text-accent-400">Legal</p>
        <h1 class="text-3xl font-semibold text-white">Legal notice</h1>
      </header>

      <section class="card space-y-4 leading-relaxed text-surface-300">
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">1. Website publisher</h2>
          <p>BitLock is published by Enzo Izinga on behalf of the RootLayer collective. Contact: enzoizinga23@gmail.com.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">2. Website hosting</h2>
          <p>The front-end is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, United States.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">3. Database hosting</h2>
          <p>Encrypted data and user accounts are stored with Turso (ChikiLabs Inc.).</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'BitLock - Legal notice' })
</script>
