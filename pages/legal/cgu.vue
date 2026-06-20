<template>
  <div class="px-6 py-12 lg:px-8">
    <div class="mx-auto max-w-4xl space-y-8">
      <header class="space-y-3">
        <p class="text-xs uppercase tracking-[0.2em] text-accent-400">Legal</p>
        <h1 class="text-3xl font-semibold text-white">Terms of Use</h1>
        <p class="text-sm text-surface-500">Last updated: June 2, 2026</p>
      </header>

      <section class="card space-y-4 leading-relaxed text-surface-300">
        <p>Welcome to BitLock. By accessing this website and using the service, you agree to these Terms of Use.</p>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">1. Service overview</h2>
          <p>BitLock is a digital vault application developed by Enzo Izinga for the RootLayer collective. The service lets you store end-to-end encrypted data.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">2. Zero-knowledge and responsibility</h2>
          <p>Your data is encrypted locally in your browser with AES-256-GCM before anything is sent. BitLock never stores your main password or decryption keys in plain text. If you lose that password, the data cannot be recovered.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">3. Account and deletion</h2>
          <p>You must provide accurate information when creating an account. You may delete your account and all associated data at any time from the settings screen.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">4. Intellectual property</h2>
          <p>The source code is distributed under the MIT license. The BitLock brand, logo, interface, and domain name remain the property of their respective creators.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">5. Warranty and liability</h2>
          <p>The service is provided as is, without any guarantee of continuous availability. BitLock cannot be held responsible for data loss caused by a forgotten master password or improper local use of the device.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">6. Acceptable use</h2>
          <p>You agree not to use BitLock for unlawful, fraudulent, or harmful purposes.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">7. Governing law</h2>
          <p>These Terms of Use are governed by French law. Any dispute will be submitted to the competent courts of Paris.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'BitLock - Terms of Use' })
</script>
