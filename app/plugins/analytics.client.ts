/**
 * Vercel Analytics, limited to public pages.
 *
 * It is cookieless and stores no personal data, but a password manager must not
 * run a third-party script while the vault is decrypted. The script is only
 * loaded when the first page is public, and every event coming from a private
 * route is dropped, including client-side navigations that happen later.
 */
import { isPrivateAnalyticsPath } from '~/utils/analytics'

export default defineNuxtPlugin({
  name: 'vercel-analytics',
  enforce: 'post',
  async setup() {
    if (!import.meta.client) return
    if (process.env.NODE_ENV !== 'production') return

    const router = useRouter()
    if (isPrivateAnalyticsPath(router.currentRoute.value.path)) return

    // Lazy import keeps the library out of the development bundle.
    const { injectAnalytics } = await import('@vercel/analytics/nuxt/runtime')
    injectAnalytics({
      beforeSend(event) {
        try {
          return isPrivateAnalyticsPath(new URL(event.url, window.location.origin).pathname) ? null : event
        } catch {
          return isPrivateAnalyticsPath(window.location.pathname) ? null : event
        }
      },
    })
  },
})
