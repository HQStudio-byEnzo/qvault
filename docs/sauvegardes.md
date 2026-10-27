# Sauvegardes de la base QVault

La base Turso contient les comptes et les coffres chiffrés. Sans sauvegarde,
une base perdue ou corrompue rend tous les coffres inaccessibles.

## Sauvegarder

```bash
TURSO_DB_URL=libsql://... TURSO_DB_TOKEN=... bun run backup
```

Le fichier est écrit dans `~/qvault-backups/qvault-<date>.json.gz.enc`, en
`chmod 600`, chiffré en AES-256-GCM, avec un SHA-256 affiché en sortie.

| Variable | Rôle | Défaut |
|---|---|---|
| `TURSO_DB_URL` | base à sauvegarder | requis |
| `TURSO_DB_TOKEN` | jeton Turso | requis pour une base distante |
| `QVAULT_BACKUP_DIR` | dossier de sortie | `~/qvault-backups` |
| `QVAULT_BACKUP_RETENTION_DAYS` | purge au-delà de N jours (`0` = jamais) | `14` |
| `QVAULT_BACKUP_KEY_FILE` | clé de chiffrement | `~/.config/qvault/backup-key.txt` |
| `QVAULT_ENV_FILE` | fichier d'identifiants à charger | `~/.config/qvault/backup-credentials.txt` |

Les variables sont lues dans l'environnement, puis dans le fichier
`~/.config/qvault/backup-credentials.txt` s'il existe (sans écraser une variable déjà
définie). Ce fichier doit être en `chmod 600`.

## Clé de chiffrement

Le fichier `.json.gz.enc` ne contient plus rien de lisible : ni libellé, ni URL,
ni e-mail. La clé est une suite de 32 octets aléatoires en base64, créée au
premier lancement si elle manque :

```
~/.config/qvault/backup-key.txt   (chmod 600, hors du dépôt)
```

**Sans cette clé, les sauvegardes sont définitivement illisibles.** Copie-la
dans un gestionnaire de mots de passe ou sur un support hors du VPS. Tu peux
aussi ajouter `QVAULT_BACKUP_KEY=<base64>` dans
`~/.config/qvault/backup-credentials.txt` : cette variable a priorité sur le
fichier si `QVAULT_BACKUP_KEY_FILE` n'est pas défini.

Une clé perdue ne compromet pas les données du coffre : elles restent chiffrées
côté client par le mot de passe maître. Seule la sauvegarde devient
inutilisable.

## Restaurer

```bash
# Base locale ou de test
QVAULT_RESTORE_URL=file:./restauree.db bun run backup:restore fichier.json.gz.enc --reset

# Base distante : les deux options sont obligatoires
QVAULT_RESTORE_URL=libsql://... TURSO_DB_TOKEN=... \
  bun run backup:restore fichier.json.gz.enc --reset --yes-remote
```

Sans `--reset`, la restauration refuse d'écraser une base non vide. Les anciens
fichiers non chiffrés (`.json.gz`) restent restaurables.

## Vérifier une sauvegarde

```bash
# Vérifie la dernière sauvegarde : fraîcheur, déchiffrement, restauration réelle
bun run backup:verify

# Fichier précis, ou seuil de fraîcheur différent
bun run backup:verify -- ~/qvault-backups/qvault-....json.gz.enc
bun run backup:verify -- --max-age-hours=48
```

La commande restaure la sauvegarde dans une base SQLite temporaire, compare le
nombre de lignes table par table, puis supprime la copie. Elle sort en code 1
avec `ok:false` et l'erreur exacte si le fichier manque, s'il est trop ancien,
si la clé ne correspond pas ou si une table ne se restaure pas. Elle ne touche
jamais la base QVault.

```bash
bun run test:backup
```

Le test unitaire crée une base, sauvegarde, vérifie que le fichier ne contient
aucune donnée en clair, refuse une mauvaise clé, restaure dans une base neuve,
compare les lignes (libellé accentué, contenu chiffré, `NULL`, index, date),
vérifie le refus d'écrasement et la purge. Il tourne aussi dans la CI.

## Sécurité du fichier

Le coffre reste chiffré côté client. Le fichier de sauvegarde est chiffré côté
serveur, mais il ne remplace pas la clé de chiffrement : conserve
`backup-key.txt` séparément du dossier de sauvegardes. Le dossier créé est en
`700`.

## Copie hors site

Le dossier de sauvegardes vit sur le même disque que la production : une perte
du VPS perd aussi les sauvegardes. Copie les `.json.gz.enc` vers un stockage
externe (S3/R2/B2 ou autre serveur) une fois par jour. Le fichier étant chiffré,
il peut transiter par un stockage tiers sans exposer les données.

## Automatisation

Une routine OpenBot quotidienne lance la sauvegarde à 03:00 (Kinshasa) puis
`bun run backup:verify`. Elle ne signale que les échecs. Aucun secret ne doit
être stocké dans le dépôt.
