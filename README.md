# BitLock - Zero-Knowledge Digital Vault

BitLock is a free, open-source digital vault that stores your links, passwords, and crypto keys with client-side zero-knowledge encryption.

**Live:** [bitlock-two.vercel.app](https://bitlock-two.vercel.app)

## Features

- **Links** — Save important URLs and bookmarks
- **Passwords** — Store credentials with military-grade encryption
- **Crypto** — Protect seed phrases and private keys
- **Client-side encryption** — AES-256-GCM, your data is encrypted in the browser before being sent
- **Seed Phrase Generator** — Generate random 12-word seed phrases
- **Password Health Audit** — Check the strength of your stored passwords
- **Export / Import** — Download or upload your vault data as JSON
- **Auto-lock** — Automatic logout after 5 minutes of inactivity
- **Multi-language** — English and French support
- **Chrome Extension** — Access your vault from the browser toolbar

## Security

- **Zero-Knowledge** — The server never sees your plaintext data
- **AES-256-GCM** — Military-standard authenticated encryption
- **PBKDF2** — 100,000 iterations for key derivation
- **bcrypt** — Password hashing with cost factor 12
- **No tracking** — Your master password never leaves your browser

## Tech Stack

- **Framework:** Nuxt 3 (SSR)
- **Database:** Turso (LibSQL)
- **Auth:** nuxt-auth-utils (encrypted cookie sessions)
- **UI:** TailwindCSS + Comfortaa font
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics + Google Analytics

## Getting Started

```bash
# Install dependencies
npm install

# Copy config
cp .env.example .env

# Run dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

```env
NUXT_SESSION_PASSWORD=your-secret-at-least-32-characters-long
TURSO_DB_URL=libsql://your-db.turso.io
TURSO_DB_TOKEN=your-token
```

## Project Structure

```
├── pages/
│   ├── index.vue              # Landing page
│   ├── auth/login.vue         # Login
│   ├── auth/register.vue      # Register
│   └── dashboard/
│       ├── index.vue          # Dashboard home
│       ├── vault.vue          # All vault items
│       ├── links.vue          # Links
│       ├── passwords.vue      # Passwords
│       ├── crypto.vue         # Crypto keys
│       ├── audit.vue          # Password health audit
│       ├── export.vue         # Export/Import
│       └── settings.vue       # Account settings
├── server/api/
│   ├── auth/                  # Auth endpoints
│   └── vault/                 # Vault CRUD
├── composables/
│   ├── useCrypto.ts           # AES-256-GCM encryption
│   ├── useVault.ts            # Vault management
│   ├── useAuthClient.ts       # Auth client
│   ├── useAutoLock.ts         # Auto-lock timer
│   ├── useSeedGenerator.ts    # Seed phrase generator
│   └── useI18n.ts             # Translations (FR/EN)
└── components/vault/          # Vault UI components
```

## Chrome Extension

See [BitLock-extension](https://github.com/wave3k/BitLock-extension) for the browser extension.

## License

MIT — RLT Labs
