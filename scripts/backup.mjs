// Sauvegarde la base QVault vers un fichier JSON gzippé.
//
//   TURSO_DB_URL=libsql://... TURSO_DB_TOKEN=... bun run backup
//
// Variables optionnelles :
//   QVAULT_BACKUP_DIR             dossier de sortie (défaut ~/qvault-backups)
//   QVAULT_BACKUP_RETENTION_DAYS  purge au-delà de N jours (défaut 14, 0 = jamais)
import { createClient } from '@libsql/client'
import { dumpDatabase, loadEnvFile, pruneBackups, resolveDirectory, writeBackup } from './backup-lib.mjs'

loadEnvFile()

const url = String(process.env.TURSO_DB_URL || '').trim()
const authToken = String(process.env.TURSO_DB_TOKEN || '').trim()
if (!url) {
  console.error('TURSO_DB_URL manquant.')
  process.exit(1)
}

const db = createClient(authToken ? { url, authToken } : { url })
try {
  const dump = await dumpDatabase(db)
  const directory = resolveDirectory(process.env.QVAULT_BACKUP_DIR)
  const result = writeBackup(dump, directory)
  const retention = process.env.QVAULT_BACKUP_RETENTION_DAYS === undefined
    ? 14
    : Number(process.env.QVAULT_BACKUP_RETENTION_DAYS)
  const removed = pruneBackups(directory, retention)
  console.log(JSON.stringify({ ok: true, ...result, pruned: removed.length }))
} finally {
  db.close()
}
