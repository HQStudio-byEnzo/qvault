<template>
  <div class="px-6 py-12 lg:px-8">
    <div class="mx-auto max-w-4xl space-y-8">
      <header class="space-y-3">
        <p class="text-xs uppercase tracking-[0.2em] text-accent-400">Legal</p>
        <h1 class="text-3xl font-bold text-white">Mentions legales</h1>
      </header>

      <section class="card space-y-4 leading-relaxed text-surface-300">
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">1. Editeur du site</h2>
          <p>Le site BitLock est edite par Enzo Izinga pour le compte du collectif RootLayer. Contact: enzoizinga23@gmail.com.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">2. Hebergeur du site</h2>
          <p>Le front-end est heberge par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, Etats-Unis.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">3. Hebergeur de la base de donnees</h2>
          <p>Les donnees chiffrees et les comptes utilisateurs sont stockes chez Turso (ChikiLabs Inc.).</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: "BitLock - Mentions legales" })
</script>
