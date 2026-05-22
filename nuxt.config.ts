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
    // Resend (email)
    resendApiKey: process.env.RESEND_API_KEY || '',
    // NOWPayments (crypto)
    nowpaymentsApiKey: process.env.NOWPAYMENTS_API_KEY || '',
    nowpaymentsIpnSecret: process.env.NOWPAYMENTS_IPN_SECRET || '',
    // App URL (pour les callbacks)
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    // Public
    public: {
      appName: 'Kipit',
      premiumPrice: 2.99,
      freeLimits: {
        passwords: 15,
        crypto: 15,
      },
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
