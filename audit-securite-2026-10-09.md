# Audit de sécurité QVault

Date : 9 octobre 2026.
Cible : dépôt `HQStudio-byEnzo/qvault` (branche `main`, commit `4350a52`), application Nuxt 3.21.11 déployée sur Vercel, base Turso.
Skill appliqué : `security-and-hardening` (modèle de menace STRIDE, frontières de confiance, OWASP Top 10).
Méthode : lecture du code source (37 routes API, 3 couches d'authentification), vérification manuelle de chaque constat sur le code, `bun audit`, puis relecture critique des sévérités.

## Périmètre et modèle de menace

Frontières de confiance identifiées :

1. Requête HTTP non authentifiée → API publique (inscription, connexion, vérification d'e-mail, appairage d'extension).
2. Session cookie (`nuxt-session`, `HttpOnly`, `Secure`, `SameSite=Lax`) → API authentifiée par session.
3. Jeton porteur `blx_…` → API d'extension (pas de cookie).
4. Fichier `.qvault` importé → désérialisation et réécriture en base.
5. Sortie HTML (SSR + client) → écho des libellés, URL et secrets déchiffrés.

Actifs : contenu chiffré des coffres, mot de passe maître, jetons d'extension, identifiants de compte, adresses e-mail.

## Verdict

2 constats HIGH, 7 MEDIUM, 6 LOW/INFO. Aucune injection SQL, aucun XSS, aucun IDOR confirmé. Le point le plus sérieux est un contournement du contrôle d'activation par e-mail, côté serveur.

---

## HIGH

### F1. Le contrôle d'activation par e-mail n'est pas appliqué côté serveur

`server/api/auth/login.post.ts:36-45`

```ts
const needsEmail = isPlaceholderEmail(user.email)
if (!needsEmail && Number(user.email_verified) !== 1) {
  throw createError({ statusCode: 403, message: 'Confirmez votre adresse e-mail…' })
}
await setUserSession(event, { user: { …, needsEmail } })
```

Un compte dont l’adresse est le placeholder interne (`@qvault.invalid`, `@bitlock.invalid`) obtient une session **sans passer par le 403**. Or `requireAuth` (`server/utils/auth.ts:22-43`) ne lit jamais `needsEmail` ni `email_verified` : il vérifie seulement l'existence de l'utilisateur et `session_version`. La seule chose qui confine ces comptes est `middleware/auth.ts:19-21`, un `navigateTo` exécuté **côté client**.

Attaque concrète : se connecter avec un compte migré, ignorer la redirection, appeler directement `GET /api/vault` avec le cookie de session. La réponse contient tout le coffre chiffré.

Impact : la règle « activation après vérification » que tu as choisie n'est pas applie au niveau de l'API pour les comptes migrés. Les comptes créés depuis l'ajout de l'e-mail, eux, sont bien bloqués par le 403.

Correction : déplacer le contrôle dans `requireAuth`, ou refuser côté serveur les sessions `needsEmail` sur toute route autre que l'étape e-mail.

### F2. `@vue/server-renderer` avant 3.5.42 : XSS dans le rendu serveur

`bun audit` remonte `GHSA-g2v6-rqmx-r4w6` : « XSS via missing CR in attribute-name blacklist ». C'est la seule vulnérabilité du rapport qui soit sur le chemin d'une requête en production : le paquet rend chaque page SSR.

Correction : monter `vue` à 3.5.42 ou plus.

---

## MEDIUM

### F3. La suppression de compte laisse l'adresse e-mail en base

`server/api/auth/delete-account.post.ts:31-42` supprime dix tables, mais pas `email_verification_tokens`. Cette table stocke l'adresse **en clair** (`schema.sql:148-158`).

Le schéma déclare `ON DELETE CASCADE`, mais l'endpoint supprime manuellement toutes les autres tables précisément parce que l'application des clés étrangères n'est pas garantie par l'hébergeur (`PRAGMA foreign_keys` est tenté avec `.catch(() => {})` dans `server/utils/db.ts:38`). Dans ce cas, l'e-mail survit à la suppression.

Correction : ajouter la ligne `DELETE FROM email_verification_tokens WHERE user_id = ?` au batch.

### F4. Le format chiffré obsolète est encore accepté à l'écriture

`server/utils/validation.ts:103-107`

```ts
const legacyParts = parts.length === 2 ? parts : null
const payloadParts = legacyParts || currentParts
```

Un `PUT /api/vault/<id>` avec `payload` au format 2 parties passe la validation, alors que `useCrypto.ts:28` fait déchiffrer ce format à **100 000 itérations** au lieu de 600 000 (six fois moins coûteux à forcer hors ligne), avec un sel choisi par l'attaquant.

Je relativise la portée : forcer un élément ne donne pas la clé sans le mot de passe maître, et les écritures légitimes régénèrent toujours le format `v2:600000`. Le vrai risque est la régression silencieuse et la perte de cohérence cryptographique si un client plus ancien réécrit dans ce format.

Correction : refuser `legacyParts` à l'écriture, tolérer seulement en lecture pour les lignes existantes.

### F5. Le blob de déverrouillage par passkey survit à la déconnexion

`composables/usePasskeyUnlock.ts:9,70` stocke `encryptedMaster` dans `localStorage` (clé `qvault.security.passkeyUnlock:<userId>`). `signOut()` (`useAuthClient.ts`) appelle `clearMasterPassword()` mais **pas** `disable()`.

Sur une machine partagée, après déconnexion, la personne suivante peut rouvrir le coffre par cérémonie passkey, donc sans connaître le mot de passe de compte — il lui suffit de disposer du même biométrique.

Correction : appeler `disable()` à la déconnexion, ou du moins invalider l'entrée quand la session expire.

### F6. La politique du mot de passe maître n'est pas appliquée côté serveur

`utils/security-policy.ts` définit `MIN_MASTER_PASSWORD_LENGTH = 12`, mais ce plancher n'est vérifié que dans `useMasterPassword.ts` et `useVault.ts`, donc contournable en appelant l'API directement. Le mot de passe maître est ce qui protège le coffre face au vérificateur (voir F9), donc un plancher serveur est le minimum.

Correction : valider une longueur minimale serveur sur tout écrit de contenu chiffré, ou accepter explicitement le risque et le documenter.

### F7. `Sec-Fetch-Site: same-site` accepté sans en-tête `Origin`

`server/middleware/security.ts:63`

```ts
if (fetchSite === 'same-origin' || fetchSite === 'same-site') return
```

`same-site` couvre tous les sous-domaines du domaine enregistré. Si `qvault.hqmerchant.xyz` héberge un jour un sous-domaine non maîtrisé, celui-ci peut émettre des écritures acceptées. La fenêtre est étroite (les navigateurs envoient `Origin` sur les écritures cross-origin), mais la défense est gratuite à resserrer.

Correction : ne garder que `same-origin`.

### F8. Absence de limite de débit sur plusieurs routes

Sans `enforceRateLimit` : `vault/[id]/restore.post.ts` (écriture), `vault/[id]/history.get.ts`, `security/master-verifier.get.ts`, `security/extension-token.delete.ts`, et les lectures `vault/index.get.ts`, `organization/index.get.ts`, `auth/me.get.ts`, `auth/session.get.ts`.

Correction : ajouter des limites, en particulier sur le vérificateur qui est le matériau d'une attaque hors ligne.

---

## LOW / INFO

| # | Constat | Emplacement |
|---|---|---|
| F9 | Le vérificateur maître est un oracle à texte clair connu (`MASTER_VERIFIER_TEXT` constant) : inhérent au modèle zero-knowledge, le client doit le recevoir pour vérifier le mot de passe. Sans escalade de privilège, mais ça justifie de soigner la politique de mot de passe (F6) et la limite de débit (F8). | `utils/brand.ts:34`, `security/master-verifier.get.ts` |
| F10 | Le cookie de session est apatride, au sens où il n’existe pas de registre serveur : `logout.post.ts` n’incrémente pas `session_version`, donc la copie volée d’un cookie reste valable jusqu’à expiration. Seul le changement de mot de passe invalide les sessions. | `server/api/auth/logout.post.ts` |
| F11 | `DELETE FROM vault_item_tags WHERE item_id = ?` sans `user_id`, gated par un contrôle de propriété préalable. Non exploitable aujourd'hui, fragile si le contrôle est un jour déplacé. | `vault/[id].delete.ts:27`, `organization/assign.post.ts:22` |
| F12 | CSP posée uniquement sur les réponses HTML, pas sur les ressources ; pas de `report-to`. | `server/plugins/security-headers.ts:41` |
| F13 | Le nonce CSP est injecté par regex sur une liste fixe d'emplacements HTML. Un script hors de ces emplacements n'a pas de nonce (défaillance fonctionnelle, pas de contournement). | `server/plugins/security-headers.ts:3,20` |
| F14 | `/api/extension/pair` est la seule route d'écriture non authentifiée : troque un code à 6 chiffres contre un jeton de 30 jours. La limite est de 15 tentatives par IP et par 15 minutes, le code vit 5 minutes, l'espace est 10⁶. Risque acceptable, à surveiller si l'IP n'est pas fiable. | `server/api/extension/pair.post.ts` |

---

## Vérifié sain

Points contrôlés et jugés corrects :

- **IDOR** : les 37 routes relues. Toute lecture ou écriture ciblée par identifiant est bornée par `user_id`, depuis `session.user.id` ou depuis le `userId` retourné par `requireExtensionAuth`. Aucune route n'accepte un identifiant d'utilisateur depuis le corps de requête.
- **Injection SQL** : toutes les valeurs passent par des paramètres liés. Les seules interpolations sont des noms de colonnes codés en dur et un `LIMIT` numérique.
- **XSS** : aucun `v-html`, `innerHTML` (hors JSON-LD statique), `eval`, `new Function`. Les libellés, URL et valeurs déchiffrées sont rendus par interpolation.
- **Injection d'attribut** : les URL d'élément sont validées côté client (`safeUrl`) **et** côté serveur (`optionalHttpUrl` n'accepte que `http:`/`https:``).
- **Exécution de commande et accès fichier** : aucun `child_process`, `exec`, `fs`, `path.join` sur entrée utilisateur, ni `import`/`require` dynamique.
- **Désérialisation `.qvault`** : validation stricte puis construction d'objets par liste blanche. Aucune fusion, donc pas de pollution de prototype et pas de clés arbitraires.
- **Redirection ouverte** : `?next=` est borné par `startsWith('/')` et rejette `//`.
- **Crypto** : AES-256-GCM, IV de 12 octets et sel de 16 octets tirés de `crypto.getRandomValues`, PBKDF2-SHA-256 à 600 000 itérations. Aucun IV ni sel codé en dur.
- **Mots de passe de compte** : bcrypt coût 12, comparaison à temps constant, et hash factice vérifié pour un identifiant inconnu (pas d'énumération par le temps de réponse).
- **Jetons d'extension** : 256 bits d'entropie, seul le SHA-256 est stocké, expiration de 30 jours, lié à `session_version` donc invalidé au changement de mot de passe.
- **Jetons de vérification d'e-mail** : 256 bits, hachés, expiration 24 h, usage unique, invalidation des précédents à chaque émission.
- **CSRF** : l'en-tête `Host` n'est jamais utilisé comme origine de confiance en production.
- **Secrets** : `.env` non suivi, aucune clé dans l'arbre, aucun secret par défaut dans `nuxt.config.ts`.
- **En-têtes** : CSP stricte pour les scripts (nonce par requête, pas de `unsafe-inline`, pas de `unsafe-eval`), HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`.

---

## Dépendances

`bun audit` : **14 vulnérabilités, dont 3 critiques, 9 hautes, 2 modérées.** L'audit du 21 septembre n'en trouvait aucune ; de nouveaux avis sont parus depuis.

Tri par accessibilité, conformément au skill :

| Paquet | Sévérité | Accessible en production ? | Action |
|---|---|---|---|
| `@vue/server-renderer` < 3.5.42 | haute | oui, rendu SSR | corriger (F2) |
| `node-forge` <= 1.4.0 | haute | non, CLI et build | mise à jour de routine |
| `seroval` <= 1.6.2 | haute | non, build | mise à jour de routine |
| `source-map-js` 1.0.0 à 1.2.1 | haute | non, compilation | mise à jour de routine |
| `braces`, `brace-expansion` | haute | non, globbing | corriger via les `overrides` existants |
| `postcss-selector-parser` < 7.1.6 | modérée | non, build | mise à jour de routine |
| `shell-quote` >= 1.8.4 < 1.11.0 | **critique** | dev seulement (`@nuxt/devtools` › `launch-editor`) | corriger, non bloquant |
| `simple-git`, `@simple-git/argv-parser` | **critique** | dev seulement (`@nuxt/devtools`) | corriger, non bloquant |

Les trois critiques passent toutes par Nuxt DevTools, désactivé en production (`nuxt.config.ts:9` : `devtools: { enabled: process.env.NODE_ENV !== 'production' }`). Elles ne sont donc pas exploitables sur le déploiement, mais elles doivent être corrigées car elles le sont en développement.

À noter : le dépôt pratique déjà une hygiène d'approvisionnement correcte avec sept `overrides` de version minimale. Deux sont insuffisantes face aux avis actuels : `brace-expansion: 5.0.9` (l'advisoire vise `< 5.0.11`) et `shell-quote: >=1.8.5` (l'advisoire vise `< 1.11.0`).

---

## Corrections appliquées le 9 octobre 2026

F1, F2 et F3 sont traités. Après correctif : `bun run test` au vert, `bun run build` au vert, test fumée au vert avec une régression ajoutée pour F1.

### F1 — correction

Le contrôle d'activation est remonté dans `requireAuth`, la seule brique que traversent toutes les routes protégées. Il relit `email` et `email_verified` en base à chaque appel, donc il ne dépend plus du drapeau `needsEmail` de la session ni du middleware de route.

`server/utils/auth.ts` est scindé en deux gardes :

- `requireSession` : session valide, rien de plus.
- `requireAuth` : appelle `requireSession`, puis refuse en 403 si `needsEmailCompletion(email, email_verified)`.

Quatre routes gardent `requireSession` parce qu'elles doivent rester accessibles avant l'activation : lecture de session, `claim-email`, `refresh-email-state`, et `delete-account` (le droit à l'effacement ne doit pas dépendre de l'état de l'e-mail). `logout` n'utilisait aucune garde.

Régression ajoutée au test fumée : un compte incomplet reçoit bien 403 sur `/api/vault` et `/api/organization`, et redevient autorisé après confirmation du lien.

### F2 — correction, avec un piège à connaître

`bun add vue@3.5.43` n'a pas suffi. Le dépôt portait **trois copies** de Vue : la racine passée en 3.5.43, mais `node_modules/nuxt/node_modules/vue` et `node_modules/@nuxt/nitro-server/node_modules/vue` restaient en 3.5.41, chacune avec son propre `@vue/server-renderer`. Le serveur de développement affichait encore `Vue 3.5.41` et `bun audit` signalait toujours la faille.

Construction du correctif :

1. `overrides.vue = 3.5.43` dans `package.json`, plus `brace-expansion` porté à 5.0.11.
2. Suppression manuelle des deux arbres imbriqués, puis `bun install` : Bun considère alors la racine 3.5.43 comme satisfaisant la contrainte `^3.5.40` de Nuxt et ne recrée pas de doublon.

Résultat vérifié : une seule copie de `vue`, en 3.5.43, `@vue/server-renderer` hors du rapport d'audit, et la bannière du serveur affiche `Vue 3.5.43`. Le total d'avis passe de **14 à 11**.

À retenir : `bun audit` lit tout l'arbre, copies imbriquées incluses. Monter la dépendance directe ne prouve rien tant que les copies imbriquées et la bannière du serveur ne sont pas vérifiées.

### F3 — correction, et précision sur la portée

Deux tables manquaient dans le batch de suppression, pas une : `extension_pair_codes` et `email_verification_tokens`. Les deux portent un `user_id` et stockent une donnée identifiable (code d'appairage, adresse e-mail en clair).

Portée réelle, mesurée sur la base de développement : avec `PRAGMA foreign_keys = ON` (valeur constatée en local), la cascade suffit et aucune ligne orpheline n'apparaît. Avec les contraintes désactivées, un compte de test créé puis supprimé laissait ses **deux** lignes intactes. L'endpoint supprime manuellement toutes les autres tables précisément parce que l'application des contraintes n'est pas garantie chez l'hébergeur : l'omission est donc un défaut réel, mais son exploitabilité dépend de cette configuration. Les deux `DELETE` ont été ajoutés au batch.

## Ordre de traitement du reste

1. **F4**, **F5**, **F7** — trois correctifs courts et indépendants.
2. **F6**, **F8** — à arbitrer : ils réduisent la surface d'attaque hors ligne sans corriger une faille.
3. Dépendances — les 11 avis restants sont tous en build ou en développement. Les trois critiques (`shell-quote`, `simple-git`, `@simple-git/argv-parser`) passent par Nuxt DevTools, désactivé en production. `seroval` et `node-forge` méritent une montée de version groupée.

## Non vérifié

- Comportement en production réelle des en-têtes et cookies après redéploiement.
- Attaque réelle du formulaire de connexion (pas d'essai d'énumération en production).
- `bun audit` ne dit rien d'un paquet nouvellement malveillant : seules les publications d'avis connus sont couvertes.
- Le rendu connecté (tableau de bord, modales) n'a pas été inspecté au navigateur dans cette session.

## Corrections appliquées le 21 octobre 2026

Vérifiées par `bun run test` et par `scripts/security-api-test.mjs` (`bun run test:security-api`,
contre un serveur lancé, comme `test:smoke`).

- **F4** : `assertEncryptedPayload` refuse l'ancien format `<sel>:<chiffré>` à l'écriture. Il reste
  accepté pour décrire une valeur déjà en base (`previousPayload` de la rotation, modification d'un
  élément sans toucher à sa charge). `scripts/smoke-api.mjs` écrit désormais au format `v2`.
- **F5** : `signOut()` oublie le déverrouillage par passkey du compte sur l'appareil
  (`forgetPasskeyUnlock`). Il faut le réactiver après une déconnexion.
- **F7** : sans en-tête `Origin`, seul `Sec-Fetch-Site: same-origin` est accepté.
- **F10** : registre serveur des sessions (`user_sessions`, `server/utils/session-registry.ts`).
  Chaque connexion reçoit un identifiant aléatoire gardé dans `session.secure` (jamais renvoyé au
  navigateur, `/api/auth/session` le retire), dont seul le SHA-256 est stocké, valable 30 jours.
  `/api/auth/logout` le supprime : un cookie copié ne sert plus. Les autres appareils restent
  connectés. `signOut()` appelait la route intégrée `DELETE /api/_auth/session`, qui n'efface que
  le cookie : il appelle désormais `/api/auth/logout` d'abord.
  **Effet du déploiement** : les sessions ouvertes avant n'ont pas d'identifiant, chacun devra se
  reconnecter une fois.
- **F14** : le code d'appairage passe de 6 chiffres (10⁶) à 10 caractères sur 30 (~49 bits),
  saisie tolérante (`ABCDE-FGHJK`, minuscules). La limite par IP reste ; pas de plafond global, qui
  permettrait de bloquer l'appairage de tout le monde. **L'extension doit être mise à jour en même
  temps** (version 3.2.0) : l'ancienne n'accepte que 6 chiffres.
- **Dépendances** : `bun audit fix` (sans changement de version majeure) : 24 → 8 avis. Restent
  `simple-git` et `node-forge` (Nuxt DevTools, `listhen`), `braces`, `brace-expansion`,
  `postcss-selector-parser` : outils de développement et de build, absents du serveur déployé.

Toujours ouverts : F6 (plancher serveur du mot de passe maître, impossible à vérifier côté serveur
sans connaître le mot de passe : à documenter), F8 (limites de débit manquantes), F11 à F13.
