/**
 * Plugin client qui charge la langue sauvegardée depuis localStorage
 * S'exécute uniquement côté client, après l'hydratation
 */
export default defineNuxtPlugin(() => {
  const locale = useState<string>('locale')
  const saved = localStorage.getItem('kipit-lang')
  if (saved && (saved === 'fr' || saved === 'en')) {
    locale.value = saved
  }
})
