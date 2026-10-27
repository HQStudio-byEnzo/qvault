// Sauvegarde la base QVault vers un fichier JSON gzippé puis chiffré en AES-256-GCM.
//
//   TURSO_DB_URL=libsql://... TURSO_DB_TOKEN=... bun run backup
//
// Variables optionnelles :
//   QVAULT_BACKUP_DIR             dossier de sortie (défaut ~/qvault-backups)
//   QVAULT_BACKUP_RETENTION_DAYS  purge au-delà de N jours (défaut 14, 0 = jamais)
//   QVAULT_BACKUP_KEY_FILE        clé de chiffrement (défaut ~/.config/qvault/backup-key.txt)
//   QVAULT_R2_*                   copie hors site (voir scripts/r2-lib.mjs)
//
// La clé est générée aléatoirement au premier lancement si elle manque. Sans
// elle, les sauvegardes sont illisibles : elle doit être copiée hors du VPS.
import { createClient } from '@libsql/client'
import { r2Config, uploadBackup, verifyRemote } from './r2-lib.mjs'
import {
  dumpDatabase,
  keyPath,
  loadBackupKey,
  loadEnvFile,
  pruneBackups,
  resolveDirectory,
  writeBackup,
} from './backup-lib.mjs'

loadEnvFile()

const url = String(process.env.TURSO_DB_URL || '').trim()
const authToken = String(process.env.TURSO_DB_TOKEN || '').trim()
if (!url) {
  console.error('TURSO_DB_URL manquant.')
  process.exit(1)
}

const db = createClient(authToken ? { url, authToken } : { url })
try {
  const key = loadBackupKey({ create: true })
  const dump = await dumpDatabase(db)
  const directory = resolveDirectory(process.env.QVAULT_BACKUP_DIR)
  const result = writeBackup(dump, directory, { key })
  const retention = process.env.QVAULT_BACKUP_RETENTION_DAYS === undefined
    ? 14
    : Number(process.env.QVAULT_BACKUP_RETENTION_DAYS)
  const removed = pruneBackups(directory, retention)

  // Copie hors site : si R2 est configuré, un échec d'envoi fait échouer la
  // sauvegarde (code 1) pour que la routine le signale.
  const offsite = r2Config()
  let remote = 'disabled'
  if (offsite.configured) {
    const uploaded = await uploadBackup(result.path, offsite)
    const checked = await verifyRemote(result.path, offsite)
    remote = { bucket: offsite.bucket, key: uploaded.key, bytes: checked.bytes, verified: true }
  }

  console.log(JSON.stringify({ ok: true, ...result, keyFile: keyPath(), pruned: removed.length, offsite: remote }))
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error.message }))
  process.exitCode = 1
} finally {
  db.close()
}
