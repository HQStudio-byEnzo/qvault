import { inject } from '@vercel/analytics'

/**
 * Plugin client pour Vercel Analytics
 * S'active automatiquement en production sur Vercel
 */
export default defineNuxtPlugin(() => {
  inject()
})
