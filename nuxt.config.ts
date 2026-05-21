// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-12-01',
  devtools: { enabled: true },

  // SSR activé
  ssr: true,

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
  ],

  // Configuration Nitro pour Cloudflare D1
  nitro: {
    preset: 'cloudflare-pages',
    experimental: {
      database: true,
    },
  },

  // Variables d'environnement runtime
  runtimeConfig: {
    // Clés privées (serveur uniquement)
    betterAuthSecret: process.env.BETTER_AUTH_SECRET || 'kipit-dev-secret-change-in-production',
    betterAuthUrl: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    // Clés publiques (client + serveur)
    public: {
      appName: 'Kipit',
    },
  },

  // Configuration Tailwind
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  // Auto-imports
  imports: {
    dirs: ['composables/**'],
  },

  app: {
    head: {
      title: 'Kipit - Votre coffre-fort numérique',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Kipit - Stockez vos mots de passe, liens et clés crypto en toute sécurité avec un chiffrement zero-knowledge.' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
})
