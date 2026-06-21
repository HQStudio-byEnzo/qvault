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
    // App URL
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    // Public
    public: {
      appName: 'BitLock',
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
      title: 'BitLock - Votre coffre-fort numérique',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'BitLock - Stockez vos mots de passe, liens et clés crypto en toute sécurité avec un chiffrement zero-knowledge.' },
        { name: 'msvalidate.01', content: '842C8AAF4BA073BCBCECB73484564C3F' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/bitlock-logo.png' },
        { rel: 'shortcut icon', href: '/bitlock-logo.png' },
        { rel: 'apple-touch-icon', href: '/bitlock-logo.png' },
        { rel: 'preload', as: 'image', href: '/bitlock-logo.png' },
      ],
      script: [
        { src: 'https://www.googletagmanager.com/gtag/js?id=G-0NFS7ZKX4Y', async: true },
        { innerHTML: "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-0NFS7ZKX4Y');" },
      ],
    },
  },
})
