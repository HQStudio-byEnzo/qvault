<template>
  <div class="px-6 py-12 lg:px-8">
    <div class="mx-auto max-w-4xl space-y-8">
      <header class="space-y-3">
        <p class="text-xs uppercase tracking-[0.2em] text-accent-400">Legal</p>
        <h1 class="text-3xl font-bold text-white">Politique de confidentialite</h1>
        <p class="text-sm text-surface-500">Derniere mise a jour : 2 juin 2026</p>
      </header>

      <section class="card space-y-4 leading-relaxed text-surface-300">
        <p>La protection de vos donnees personnelles et le respect de votre vie privee sont au coeur de Kipit.</p>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">1. Responsable du traitement</h2>
          <p>Enzo Izinga agit pour le compte du collectif RootLayer. Contact: enzoizinga23@gmail.com.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">2. Zero-knowledge</h2>
          <p>Tous les secrets stockes dans votre coffre sont chiffres dans votre navigateur avant d'etre envoyes au serveur. La cle de dechiffrement reste uniquement sur votre appareil.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">3. Donnees collecte es</h2>
          <p>Nous collectons un minimum de donnees pour faire fonctionner le service: nom, email, mot de passe hache, logs techniques et mesures d'audience si activees.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">4. Bases legales</h2>
          <p>Le traitement repose sur l'execution du contrat, le consentement pour l'analytics et l'interet legitime pour la securite et la maintenance.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">5. Hebergement et sous-traitants</h2>
          <p>Le site est heberge par Vercel et les donnees de coffre chiffre sont stockees chez Turso. Nous ne vendons ni ne louons vos donnees personnelles.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">6. Duree de conservation</h2>
          <p>Les donnees du compte sont conservees tant que le compte est actif. Les logs techniques et les donnees d'analytics sont conserves selon des durees limitees.</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-white">7. Vos droits</h2>
          <p>Vous disposez des droits d'acces, de rectification, d'effacement et de retrait du consentement. Ecrivez a enzoizinga23@gmail.com pour les exercer.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: "Kipit - Politique de confidentialite" })
</script>
