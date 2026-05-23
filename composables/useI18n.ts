/**
 * Composable i18n simple pour Kipit
 * Supporte Français (fr) et Anglais (en)
 */

const translations: Record<string, Record<string, string>> = {
  fr: {
    'hero.badge': '100% Gratuit · Chiffrement Zero-Knowledge',
    'hero.title1': 'Gardez vos secrets',
    'hero.title2': 'en sécurité absolue',
    'hero.subtitle': 'Liens, mots de passe, seed phrases crypto — tout est chiffré côté client avec AES-256. Même nous ne pouvons pas lire vos données.',
    'hero.cta': 'Créer mon coffre-fort',
    'hero.login': "J'ai déjà un compte",
    'nav.login': 'Se connecter',
    'nav.start': 'Commencer',
    'how.title': 'Comment ça marche',
    'how.subtitle': 'Trois étapes simples pour sécuriser vos données les plus sensibles.',
    'how.step1.title': 'Créez votre compte',
    'how.step1.desc': 'Inscription gratuite en 10 secondes. Pas de carte bancaire, pas de piège.',
    'how.step2.title': 'Ajoutez vos éléments',
    'how.step2.desc': 'Liens, mots de passe, clés crypto. Choisissez de chiffrer ou non chaque élément.',
    'how.step3.title': 'Accédez partout',
    'how.step3.desc': 'Vos données vous suivent sur tous vos appareils, toujours chiffrées.',
    'features.title': "Tout ce qu'il vous faut",
    'features.subtitle': 'Un coffre-fort numérique complet, sans compromis sur la sécurité.',
    'features.links.title': 'Liens',
    'features.links.desc': 'Sauvegardez vos URLs importantes. Bookmarks, outils, ressources — tout au même endroit.',
    'features.passwords.title': 'Mots de passe',
    'features.passwords.desc': 'Stockez vos identifiants avec un chiffrement militaire. Fini les post-its et les fichiers texte.',
    'features.crypto.title': 'Crypto',
    'features.crypto.desc': 'Seed phrases, clés privées. Protégés par un chiffrement que même nous ne pouvons pas casser.',
    'features.encryption.title': 'Chiffrement côté client',
    'features.encryption.desc': "Vos données sont chiffrées dans votre navigateur AVANT d'être envoyées. Le serveur ne voit que du charabia.",
    'features.favorites.title': 'Favoris & Recherche',
    'features.favorites.desc': 'Retrouvez vos éléments en un clic. Organisez par favoris, filtrez par type.',
    'features.unlimited.title': 'Illimité & Gratuit',
    'features.unlimited.desc': 'Pas de limite. Pas de plan payant. Kipit est 100% gratuit, pour toujours.',
    'security.badge': 'Sécurité maximale',
    'security.title': 'Zero-Knowledge par design',
    'security.desc': 'Kipit ne peut physiquement pas accéder à vos données chiffrées. Le mot de passe maître ne quitte jamais votre navigateur. Même en cas de piratage du serveur, vos données restent illisibles.',
    'security.aes': 'AES-256-GCM (standard militaire)',
    'security.pbkdf2': 'PBKDF2 — 100 000 itérations',
    'security.client': 'Chiffrement côté client uniquement',
    'security.open': 'Open-source & auditable',
    'cta.title': 'Prêt à sécuriser vos données ?',
    'cta.subtitle': 'Créez votre coffre-fort en 10 secondes. Gratuit, sans engagement.',
    'cta.btn': 'Commencer maintenant',
    'footer.by': 'par la',
    'settings.language': 'Langue',
    'settings.title': 'Paramètres',
    'settings.subtitle': 'Gérez votre compte',
  },
  en: {
    'hero.badge': '100% Free · Zero-Knowledge Encryption',
    'hero.title1': 'Keep your secrets',
    'hero.title2': 'absolutely secure',
    'hero.subtitle': 'Links, passwords, crypto seed phrases — everything is encrypted client-side with AES-256. Even we cannot read your data.',
    'hero.cta': 'Create my vault',
    'hero.login': 'I already have an account',
    'nav.login': 'Sign in',
    'nav.start': 'Get started',
    'how.title': 'How it works',
    'how.subtitle': 'Three simple steps to secure your most sensitive data.',
    'how.step1.title': 'Create your account',
    'how.step1.desc': 'Free sign up in 10 seconds. No credit card, no catch.',
    'how.step2.title': 'Add your items',
    'how.step2.desc': 'Links, passwords, crypto keys. Choose whether to encrypt each item.',
    'how.step3.title': 'Access anywhere',
    'how.step3.desc': 'Your data follows you on all your devices, always encrypted.',
    'features.title': 'Everything you need',
    'features.subtitle': 'A complete digital vault, with no compromise on security.',
    'features.links.title': 'Links',
    'features.links.desc': 'Save your important URLs. Bookmarks, tools, resources — all in one place.',
    'features.passwords.title': 'Passwords',
    'features.passwords.desc': 'Store your credentials with military-grade encryption. No more sticky notes.',
    'features.crypto.title': 'Crypto',
    'features.crypto.desc': 'Seed phrases, private keys. Protected by encryption even we cannot break.',
    'features.encryption.title': 'Client-side encryption',
    'features.encryption.desc': 'Your data is encrypted in your browser BEFORE being sent. The server only sees gibberish.',
    'features.favorites.title': 'Favorites & Search',
    'features.favorites.desc': 'Find your items in one click. Organize by favorites, filter by type.',
    'features.unlimited.title': 'Unlimited & Free',
    'features.unlimited.desc': 'No limits. No paid plans. Kipit is 100% free, forever.',
    'security.badge': 'Maximum security',
    'security.title': 'Zero-Knowledge by design',
    'security.desc': 'Kipit physically cannot access your encrypted data. Your master password never leaves your browser. Even if the server is hacked, your data remains unreadable.',
    'security.aes': 'AES-256-GCM (military standard)',
    'security.pbkdf2': 'PBKDF2 — 100,000 iterations',
    'security.client': 'Client-side encryption only',
    'security.open': 'Open-source & auditable',
    'cta.title': 'Ready to secure your data?',
    'cta.subtitle': 'Create your vault in 10 seconds. Free, no commitment.',
    'cta.btn': 'Get started now',
    'footer.by': 'by',
    'settings.language': 'Language',
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your account',
  },
}

export function useI18n() {
  const locale = useState<string>('locale', () => 'fr')

  function t(key: string): string {
    return translations[locale.value]?.[key] || translations.fr[key] || key
  }

  function setLocale(lang: string) {
    locale.value = lang
    if (import.meta.client) {
      localStorage.setItem('kipit-lang', lang)
    }
  }

  if (import.meta.client) {
    const saved = localStorage.getItem('kipit-lang')
    if (saved && (saved === 'fr' || saved === 'en')) {
      locale.value = saved
    }
  }

  return { t, locale, setLocale }
}
