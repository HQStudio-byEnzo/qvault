<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="h-16 flex items-center justify-between px-6 border-b border-surface-800">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">
          <Icon name="lucide:shield" class="w-5 h-5 text-white" />
        </div>
        <span class="text-lg font-semibold text-white">Kipit</span>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/auth/login" class="btn-secondary text-sm">
          Se connecter
        </NuxtLink>
        <NuxtLink to="/auth/register" class="btn-primary text-sm">
          Commencer gratuitement
        </NuxtLink>
      </div>
    </header>

    <!-- Hero -->
    <main class="flex-1 flex items-center justify-center px-6">
      <div class="max-w-3xl text-center space-y-8 animate-fade-in">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-surface-700 bg-surface-900 text-xs font-medium text-surface-300">
          <Icon name="lucide:lock" class="w-3 h-3 text-accent-400" />
          Chiffrement Zero-Knowledge
        </div>

        <!-- Title -->
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
          Votre coffre-fort<br>
          <span class="text-accent-400">numérique sécurisé</span>
        </h1>

        <!-- Subtitle -->
        <p class="text-lg md:text-xl text-surface-400 max-w-xl mx-auto leading-relaxed">
          Stockez vos liens, mots de passe et clés crypto en toute sécurité. 
          Chiffrement AES-256 côté client — même nous ne pouvons pas lire vos données.
        </p>

        <!-- CTA -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/auth/register" class="btn-primary text-base px-6 py-3">
            Créer un compte gratuit
          </NuxtLink>
          <NuxtLink to="/auth/login" class="btn-secondary text-base px-6 py-3">
            J'ai déjà un compte
          </NuxtLink>
        </div>

        <!-- Features -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12">
          <div class="card text-left">
            <Icon name="lucide:link" class="w-8 h-8 text-accent-400 mb-3" />
            <h3 class="font-semibold text-white mb-1">Liens</h3>
            <p class="text-sm text-surface-400">Sauvegardez vos liens importants de manière organisée et sécurisée.</p>
          </div>
          <div class="card text-left">
            <Icon name="lucide:key-round" class="w-8 h-8 text-accent-400 mb-3" />
            <h3 class="font-semibold text-white mb-1">Mots de passe</h3>
            <p class="text-sm text-surface-400">Gérez tous vos mots de passe avec un chiffrement de niveau militaire.</p>
          </div>
          <div class="card text-left">
            <Icon name="lucide:bitcoin" class="w-8 h-8 text-accent-400 mb-3" />
            <h3 class="font-semibold text-white mb-1">Crypto</h3>
            <p class="text-sm text-surface-400">Protégez vos seed phrases et clés privées en toute confidentialité.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-6 text-center text-sm text-surface-500 border-t border-surface-800">
      <p>&copy; {{ new Date().getFullYear() }} Kipit. Conçu avec sécurité en RDC.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
