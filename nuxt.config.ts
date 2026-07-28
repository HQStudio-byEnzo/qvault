// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-19',
  future: {
    compatibilityVersion: 3,
  },
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  experimental: {
    appManifest: false,
  },

  ssr: true,

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    'nuxt-auth-utils',
  ],

  // Vercel deployment
  nitro: {
    preset: 'vercel',
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-Permitted-Cross-Domain-Policies': 'none',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'Content-Security-Policy': "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data:; connect-src 'self'; upgrade-insecure-requests",
        },
      },
    },
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
    supportCatalogJson: process.env.SUPPORT_CATALOG_JSON || '[]',
    // Public
    public: {
      appName: 'BitLock',
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  postcss: {
    plugins: {
      cssnano: { preset: 'default' },
    },
  },

  imports: {
    dirs: ['composables/**'],
  },

  app: {
    head: {
      title: 'BitLock - Votre coffre-fort numérique',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'BitLock - Stockez vos mots de passe, liens et clés crypto en toute sécurité avec un chiffrement zero-knowledge.' },
        { property: 'og:site_name', content: 'BitLock' },
        { property: 'og:title', content: 'BitLock - Votre coffre-fort numérique' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/bitlock-logo.svg' },
        { rel: 'shortcut icon', type: 'image/svg+xml', href: '/bitlock-logo.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-v2.png' },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'BitLock',
            url: process.env.APP_URL || 'http://localhost:3000',
          }),
        },
      ],
    },
  },
})
