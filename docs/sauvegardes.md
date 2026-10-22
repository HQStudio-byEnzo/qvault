# Sauvegardes de la base QVault

La base Turso contient les comptes et les coffres chiffrés. Sans sauvegarde,
une base perdue ou corrompue rend tous les coffres inaccessibles.

## Sauvegarder

```bash
TURSO_DB_URL=libsql://... TURSO_DB_TOKEN=... bun run backup
```

Le fichier est écrit dans `~/qvault-backups/qvault-<date>.json.gz`, en
`chmod 600`, avec un SHA-256 affiché en sortie.

| Variable | Rôle | Défaut |
|---|---|---|
| `TURSO_DB_URL` | base à sauvegarder | requis |
| `TURSO_DB_TOKEN` | jeton Turso | requis pour une base distante |
| `QVAULT_BACKUP_DIR` | dossier de sortie | `~/qvault-backups` |
| `QVAULT_BACKUP_RETENTION_DAYS` | purge au-delà de N jours (`0` = jamais) | `14` |
| `QVAULT_ENV_FILE` | fichier d'identifiants à charger | `~/.config/qvault/backup-credentials.txt` |

Les variables sont lues dans l'environnement, puis dans le fichier
`~/.config/qvault/backup-credentials.txt` s'il existe (sans écraser une variable déjà
définie). Ce fichier doit être en `chmod 600`.

## Restaurer

```bash
# Base locale ou de test
QVAULT_RESTORE_URL=file:./restauree.db bun run backup:restore fichier.json.gz --reset

# Base distante : les deux options sont obligatoires
QVAULT_RESTORE_URL=libsql://... TURSO_DB_TOKEN=... \
  bun run backup:restore fichier.json.gz --reset --yes-remote
```

Sans `--reset`, la restauration refuse d'écraser une base non vide.

## Vérifier une sauvegarde

```bash
bun run test:backup
```

Le test crée une base, sauvegarde, restaure dans une base neuve, compare les
lignes (libellé accentué, contenu chiffré, `NULL`, index, date), vérifie le
refus d'écrasement et la purge. Il tourne aussi dans la CI via `bun run test`.

## Sécurité du fichier

Le coffre reste chiffré côté client, mais la sauvegarde contient en clair les
noms d'utilisateur, e-mails, libellés, URL et l'historique. Elle doit rester
sur un disque de confiance, en `chmod 600`, et ne jamais être poussée dans le
dépôt public. Le dossier créé est en `700`.

## Automatisation

Une routine OpenBot quotidienne peut lancer la commande de sauvegarde une fois
que `TURSO_DB_URL` et `TURSO_DB_TOKEN` sont disponibles sur le VPS, par exemple
dans `~/.config/qvault/backup-credentials.txt` (lisible par le seul propriétaire). Aucun
secret ne doit être stocké dans le dépôt.
