// Restaure une sauvegarde QVault dans une base cible.
//
//   bun scripts/restore-backup.mjs ~/qvault-backups/qvault-....json.gz --reset
//
// La cible vient de QVAULT_RESTORE_URL (défaut : TURSO_DB_URL). Une cible
// distante (libsql:// ou https://) exige en plus --yes-remote, parce que
// l'opération remplace les données existantes.
import { createClient } from '@libsql/client'
import { countRows, loadBackupKey, loadEnvFile, readBackup, restoreDatabase } from './backup-lib.mjs'

const args = process.argv.slice(2)
const path = args.find(arg => !arg.startsWith('--'))
const reset = args.includes('--reset')
const yesRemote = args.includes('--yes-remote')

if (!path) {
  console.error('Usage : bun scripts/restore-backup.mjs <fichier.json.gz> [--reset] [--yes-remote]')
  process.exit(1)
}

loadEnvFile()

const url = String(process.env.QVAULT_RESTORE_URL || process.env.TURSO_DB_URL || '').trim()
if (!url) {
  console.error('QVAULT_RESTORE_URL ou TURSO_DB_URL manquant.')
  process.exit(1)
}
const remote = /^(libsql|https?):\/\//i.test(url)
if (remote && !yesRemote) {
  console.error('Cible distante détectée : ajoutez --yes-remote après avoir vérifié la cible.')
  process.exit(1)
}
if (remote && !reset) {
  console.error('Une restauration distante doit être explicite : ajoutez --reset.')
  process.exit(1)
}

const authToken = String(process.env.TURSO_DB_TOKEN || '').trim()
const db = createClient(authToken ? { url, authToken } : { url })
try {
  const dump = readBackup(path, { key: loadBackupKey() })
  const counts = await restoreDatabase(db, dump, { reset })
  const rows = Object.values(counts).reduce((total, value) => total + value, 0)
  console.log(JSON.stringify({ ok: true, source: dump.createdAt, tables: Object.keys(counts).length, rows, counts }))
} finally {
  db.close()
}
