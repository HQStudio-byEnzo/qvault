<template>
  <div class="px-6 py-12 lg:px-8">
    <div class="mx-auto max-w-4xl space-y-8">
      <header class="space-y-3">
        <p class="text-xs uppercase tracking-[0.2em] text-accent-400">Legal</p>
        <h1 class="text-3xl font-semibold text-white">Privacy Policy</h1>
        <p class="text-sm text-surface-500">Last updated: June 2, 2026</p>
      </header>

      <section class="card space-y-4 leading-relaxed text-surface-300">
        <p>Protecting your personal data and respecting your privacy are central to BitLock.</p>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">1. Data controller</h2>
          <p>Enzo Izinga acts on behalf of the RootLayer collective. Contact: enzoizinga23@gmail.com.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">2. Zero-knowledge</h2>
          <p>All secrets stored in your vault are encrypted in your browser before being sent to the server. The decryption key remains only on your device.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">3. Data collected</h2>
          <p>We collect the minimum data needed to run the service: name, email, hashed password, technical logs, and analytics data when enabled.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">4. Legal basis</h2>
          <p>Processing is based on contract performance, consent for analytics, and legitimate interest for security and maintenance.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">5. Hosting and processors</h2>
          <p>The website is hosted by Vercel and encrypted vault data is stored with Turso. We do not sell or rent your personal data.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">6. Retention</h2>
          <p>Account data is kept as long as the account is active. Technical logs and analytics data are kept only for limited periods.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">7. Your rights</h2>
          <p>You have the right to access, correct, erase, and withdraw consent. Write to enzoizinga23@gmail.com to exercise those rights.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'BitLock - Privacy Policy' })
</script>
