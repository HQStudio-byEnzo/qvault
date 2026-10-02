/**
 * Vercel Analytics
 * Cookieless, no personal data, no cross-site tracking. It reports aggregate
 * page views and referrers in the Vercel dashboard.
 *
 * It is intentionally skipped outside production, so local development and
 * preview builds never pollute the real metrics.
 */
export default defineNuxtPlugin({
  name: 'vercel-analytics',
  enforce: 'post',
  async setup() {
    if (!import.meta.client) return
    if (process.env.NODE_ENV !== 'production') return

    // Lazy import keeps the library out of the development bundle.
    const { injectAnalytics } = await import('@vercel/analytics/nuxt/runtime')
    injectAnalytics()
  },
})
