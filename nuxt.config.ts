// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-12-01',
  devtools: { enabled: true },

  ssr: true,

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    'nuxt-auth-utils',
  ],

  // Vercel deployment
  nitro: {
    preset: 'vercel',
  },

  // Variables d'environnement runtime
  runtimeConfig: {
    // Session (nuxt-auth-utils utilise NUXT_SESSION_PASSWORD)
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || '',
    },
    // Base de données Turso
    tursoDbUrl: process.env.TURSO_DB_URL || '',
    tursoDbToken: process.env.TURSO_DB_TOKEN || '',
    // Public
    public: {
      appName: 'Kipit',
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

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
