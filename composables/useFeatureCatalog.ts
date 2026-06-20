export type FeatureSlug = 'links' | 'passwords' | 'crypto' | 'encryption' | 'favorites' | 'recovery'

export interface FeatureEntry {
  slug: FeatureSlug
  title: string
  summary: string
  icon: string
  accent: string
  badgeClass: string
  iconClass: string
  points: string[]
}

const FEATURES: FeatureEntry[] = [
  {
    slug: 'links',
    title: 'Links',
    summary: 'Save important websites, references, and bookmarks in one encrypted place.',
    icon: 'lucide:link',
    accent: 'blue',
    badgeClass: 'bg-blue-500/10',
    iconClass: 'text-blue-400',
    points: [
      'Keep product dashboards, docs, and favorite tools in the vault.',
      'Optionally attach a website URL for faster organization and search.',
      'Use the same security model as the rest of the vault.',
    ],
  },
  {
    slug: 'passwords',
    title: 'Passwords',
    summary: 'Store login credentials with client-side encryption and easy search.',
    icon: 'lucide:key-round',
    accent: 'amber',
    badgeClass: 'bg-amber-500/10',
    iconClass: 'text-amber-400',
    points: [
      'Store usernames, passwords, and notes without exposing plaintext to the server.',
      'Open a dedicated password section for focused management.',
      'Add, copy, favorite, and audit credentials from the dashboard.',
    ],
  },
  {
    slug: 'crypto',
    title: 'Crypto',
    summary: 'Protect seed phrases and private keys with the strongest vault settings.',
    icon: 'lucide:bitcoin',
    accent: 'orange',
    badgeClass: 'bg-orange-500/10',
    iconClass: 'text-orange-400',
    points: [
      'Keep seed phrases, wallet backups, and private keys encrypted end to end.',
      'Get a safety hint that reminds you to encrypt crypto secrets.',
      'Use the recovery flow if you rotate your master password.',
    ],
  },
  {
    slug: 'encryption',
    title: 'Client-side encryption',
    summary: 'Your data is encrypted in the browser before it ever reaches the server.',
    icon: 'lucide:lock',
    accent: 'emerald',
    badgeClass: 'bg-emerald-500/10',
    iconClass: 'text-emerald-400',
    points: [
      'AES-256-GCM protects the stored payloads.',
      'PBKDF2 derives keys from your master password in the browser.',
      'BitLock never receives your plain text secrets.',
    ],
  },
  {
    slug: 'favorites',
    title: 'Favorites and search',
    summary: 'Organize items quickly and find what you need without friction.',
    icon: 'lucide:star',
    accent: 'purple',
    badgeClass: 'bg-purple-500/10',
    iconClass: 'text-purple-400',
    points: [
      'Mark the items you use the most as favorites.',
      'Filter by type, with or without URLs, and by search terms.',
      'Use the audit screen to spot duplicates and stale records.',
    ],
  },
  {
    slug: 'recovery',
    title: 'Recovery codes',
    summary: 'Store backup codes and imported .txt files in a dedicated recovery view.',
    icon: 'lucide:ticket-check',
    accent: 'rose',
    badgeClass: 'bg-rose-500/10',
    iconClass: 'text-rose-400',
    points: [
      'Import GitHub, Google, and cloud recovery codes from text files.',
      'Track how many recovery codes you have from the dashboard.',
      'Keep them encrypted and available alongside the rest of your vault.',
    ],
  },
]

export function useFeatureCatalog() {
  function getFeature(slug: string) {
    return FEATURES.find(feature => feature.slug === slug)
  }

  return {
    features: FEATURES,
    getFeature,
  }
}
