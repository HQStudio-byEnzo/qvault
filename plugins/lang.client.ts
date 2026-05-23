/**
 * Plugin client that loads the saved language from localStorage
 * Runs only client-side, after hydration
 */
export default defineNuxtPlugin(() => {
  const locale = useState<string>('locale')
  const saved = localStorage.getItem('kipit-lang')
  if (saved && (saved === 'fr' || saved === 'en')) {
    locale.value = saved
  }
})
