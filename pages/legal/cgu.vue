<template>
  <div class="px-6 py-12 lg:px-8">
    <div class="mx-auto max-w-4xl space-y-8">
      <header class="space-y-3">
        <p class="text-xs uppercase tracking-[0.2em] text-accent-400">Legal</p>
        <h1 class="text-3xl font-bold text-white">Conditions Generales d'Utilisation</h1>
        <p class="text-sm text-surface-500">Derniere mise a jour : 2 juin 2026</p>
      </header>

      <section class="card space-y-4 leading-relaxed text-surface-300">
        <p>Bienvenue sur Kipit. En accedant a ce site et en utilisant le service, vous acceptez les presentes CGU.</p>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">1. Presentation du service</h2>
          <p>Kipit est une application de coffre-fort numerique developpee par Enzo Izinga pour le compte du collectif RootLayer. Le service permet de stocker des donnees chiffrees de bout en bout.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">2. Zero-knowledge et responsabilite</h2>
          <p>Vos donnees sont chiffrees localement dans votre navigateur via AES-256-GCM avant tout envoi. Kipit ne stocke jamais votre mot de passe principal ni vos cles de dechiffrement en clair. Si vous perdez ce mot de passe, les donnees restent irrecuperables.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">3. Compte et suppression</h2>
          <p>Vous devez fournir des informations exactes lors de la creation du compte. Vous pouvez supprimer votre compte et toutes les donnees associees a tout moment depuis les parametres.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">4. Propriete intellectuelle</h2>
          <p>Le code source est distribue sous licence MIT. La marque Kipit, le logo, l'interface et le nom de domaine restent la propriete de leurs createurs.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">5. Garantie et responsabilite</h2>
          <p>Le service est fourni en l'etat, sans garantie de disponibilite continue. Kipit ne peut etre tenu responsable d'une perte de donnees causée par un oubli du mot de passe principal ou une mauvaise utilisation locale de l'appareil.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">6. Usage acceptable</h2>
          <p>Vous vous engagez a ne pas utiliser Kipit a des fins illegales, frauduleuses ou pour nuire a son infrastructure.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">7. Droit applicable</h2>
          <p>Les presentes CGU sont regies par le droit francais. Tout litige sera soumis aux tribunaux competents de Paris.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: "Kipit - CGU" })
</script>
