# Kipit - Coffre-fort Numérique Zero-Knowledge

Kipit est une application de coffre-fort numérique sécurisée et 100% gratuite qui permet de stocker des liens, mots de passe et clés crypto avec un chiffrement zero-knowledge côté client.

## Architecture de Sécurité

- **Chiffrement AES-256-GCM** côté client exclusivement (Web Crypto API)
- **Dérivation de clé PBKDF2** avec 100 000 itérations SHA-256
- Le serveur ne stocke que des données chiffrées illisibles
- Le mot de passe maître n'est **jamais** transmis au serveur

## Stack Technique

- **Framework** : Nuxt 3 (SSR activé)
- **Base de données** : Cloudflare D1 (SQLite)
- **Authentification** : BetterAuth
- **UI** : TailwindCSS avec un design minimaliste inspiré Linear/Vercel
- **Déploiement** : Cloudflare Pages

## Fonctionnalités

- Liens illimités
- Mots de passe illimités
- Clés crypto illimitées
- Chiffrement optionnel par élément (zero-knowledge)
- Favoris et recherche
- Interface responsive (mobile + desktop)

## Installation

```bash
# Installer les dépendances
npm install

# Copier la config
cp .env.example .env

# Lancer en dev
npm run dev

# Build pour Cloudflare
npm run build
```

## Structure du Projet

```
├── app.vue                    # Point d'entrée
├── nuxt.config.ts             # Configuration Nuxt
├── wrangler.toml              # Configuration Cloudflare
├── composables/
│   ├── useAuthClient.ts       # Authentification client
│   ├── useCrypto.ts           # Chiffrement AES-256-GCM
│   └── useVault.ts            # Gestion du coffre-fort
├── components/vault/
│   ├── VaultItemCard.vue      # Carte d'élément
│   ├── VaultAddModal.vue      # Modal d'ajout
│   └── VaultDecryptModal.vue  # Modal de déchiffrement
├── layouts/
│   ├── default.vue            # Layout par défaut
│   └── dashboard.vue          # Layout dashboard avec sidebar
├── middleware/
│   ├── auth.ts                # Protection des routes
│   └── guest.ts               # Redirection si connecté
├── pages/
│   ├── index.vue              # Landing page
│   ├── auth/login.vue         # Connexion
│   ├── auth/register.vue      # Inscription
│   └── dashboard/             # Pages du dashboard
├── server/
│   ├── api/auth/[...all].ts   # Routes BetterAuth
│   ├── api/vault/             # CRUD coffre-fort
│   ├── database/schema.sql    # Schéma D1
│   └── utils/                 # Utilitaires serveur
└── public/
    └── favicon.svg            # Favicon
```

## Déploiement sur Cloudflare

1. Créer une base D1 : `wrangler d1 create kipit-db`
2. Mettre à jour l'ID dans `wrangler.toml`
3. Appliquer le schéma : `wrangler d1 execute kipit-db --file=server/database/schema.sql`
4. Déployer : `wrangler pages deploy .output/public`

## Sécurité

- Le chiffrement est optionnel par élément (flag `is_encrypted`)
- Les données chiffrées utilisent le format : `salt:ciphertext` avec un IV séparé
- **Important** : La perte du mot de passe maître rend les données chiffrées irrécupérables

## Licence

Propriétaire - Tous droits réservés.
