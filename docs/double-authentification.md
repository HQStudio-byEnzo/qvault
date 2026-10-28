# Double authentification (TOTP)

Le compte peut être protégé par un code temporaire à 6 chiffres (RFC 6238,
HMAC-SHA1, période de 30 secondes, fenêtre de ±1 pas).

## Parcours

1. **Paramètres → Sécurité → Double authentification** : un QR code et une clé
   manuelle sont affichés.
2. L'utilisateur saisit un premier code pour confirmer. Tant qu'il ne l'a pas
   fait, le secret reste en attente et ne protège rien.
3. Dix **codes de secours** sont affichés une seule fois. Chacun ne fonctionne
   qu'une fois et remplace le code temporaire si le téléphone est perdu.
4. À la connexion suivante, le mot de passe seul n'ouvre plus de session : le
   serveur renvoie `{ "twoFactorRequired": true }` et un défi de 5 minutes
   (cookie `qvault_2fa`, `HttpOnly`). Le second facteur ouvre la session.

La désactivation exige le mot de passe **et** un code valide. Elle ferme les
autres sessions, comme l'activation.

## Stockage

| Donnée | Emplacement | Protection |
|---|---|---|
| Secret TOTP | `user_totp.secret` | AES-256-GCM (`t1:<iv>:<tag>:<chiffré>`) |
| Codes de secours | `user_recovery_codes.code_hash` | SHA-256, usage unique |
| Défi de connexion | `login_challenges` | SHA-256 de l'identifiant, TTL 5 min, 5 essais |

La clé de chiffrement vient de `NUXT_TOTP_KEY` (32 octets ou plus, base64 ou
brut) si elle est définie ; sinon elle est dérivée de `NUXT_SESSION_PASSWORD`
par HKDF (`qvault-totp` / `qvault-totp-secret-v1`).

**Conséquence opérationnelle :** changer `NUXT_SESSION_PASSWORD` (ou
`NUXT_TOTP_KEY`) sans conserver l'ancienne valeur rend les secrets TOTP
illisibles. Les comptes concernés reçoivent alors une erreur explicite
`503 — clé serveur a changé` au lieu d'un contournement silencieux. Pour faire
tourner la clé proprement : désactiver puis réactiver la 2FA sur les comptes
concernés, ou définir `NUXT_TOTP_KEY` avant la première activation.

## Anti-rejeu

`user_totp.last_step` mémorise le dernier pas de temps consommé. Un code déjà
utilisé est refusé (`Ce code vient d'être utilisé. Attendez le code suivant.`),
y compris sur un nouveau défi. Le code d'enrôlement est consommé de la même
façon : après activation, il faut attendre le code suivant pour se connecter.

## Tests

```bash
bun run test:totp          # vecteurs RFC 6238, base32, fenêtre, anti-rejeu
bun run test:security-api  # parcours complet contre un serveur lancé
```

Le parcours navigateur (activation, connexion en deux étapes, connexion par
code de secours, rejeu refusé) a été vérifié avec Chromium.
