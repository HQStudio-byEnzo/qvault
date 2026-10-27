// Vérifie qu'une sauvegarde QVault est fraîche et réellement restaurable.
//
//   bun run backup:verify                     # dernière sauvegarde du dossier
//   bun run backup:verify -- --max-age-hours=26
//   bun run backup:verify -- ~/qvault-backups/qvault-....json.gz.enc
//
// La vérification restaure la sauvegarde dans une base SQLite temporaire, hors
// de tout serveur, et compare le nombre de lignes table par table. Rien n'est
// écrit dans la base QVault : la cible est supprimée à la fin.
import { mkdtempSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createClient } from '@libsql/client'
import {
  countRows,
  latestBackup,
  loadBackupKey,
  loadEnvFile,
  readBackup,
  resolveDirectory,
  restoreDatabase,
} from './backup-lib.mjs'

function fail(message) {
  console.log(JSON.stringify({ ok: false, error: message }))
  process.exit(1)
}

const args = process.argv.slice(2)
const maxAgeArg = args.find(arg => arg.startsWith('--max-age-hours='))
const maxAgeHours = maxAgeArg ? Number(maxAgeArg.split('=')[1]) : 26
const explicitPath = args.find(arg => !arg.startsWith('--'))

loadEnvFile()

const directory = resolveDirectory(process.env.QVAULT_BACKUP_DIR)
const path = explicitPath || latestBackup(directory) || latestBackup(directory, '.json.gz')
if (!path) fail(`Aucune sauvegarde chiffrée dans ${directory}`)

let stats
try {
  stats = statSync(path)
} catch (error) {
  fail(`Sauvegarde illisible : ${path} (${error.code ?? error.message})`)
}
if (stats.size === 0) fail(`Sauvegarde vide : ${path}`)

const ageHours = (Date.now() - stats.mtimeMs) / (60 * 60 * 1000)
if (!Number.isFinite(maxAgeHours)) fail('--max-age-hours attend un nombre')
if (ageHours > maxAgeHours) {
  fail(`Sauvegarde trop ancienne : ${path} (${ageHours.toFixed(1)} h > ${maxAgeHours} h)`)
}

let dump
try {
  dump = readBackup(path, { key: loadBackupKey() })
} catch (error) {
  fail(`Déchiffrement impossible : ${error.message}`)
}

const expected = Object.fromEntries(dump.tables.map(table => [table.name, table.rows.length]))
const workspace = mkdtempSync(join(tmpdir(), 'qvault-verify-'))
const target = createClient({ url: `file:${join(workspace, 'restore.db')}` })
let summary
try {
  const counts = await restoreDatabase(target, dump, { reset: true })
  for (const [table, rows] of Object.entries(expected)) {
    if (counts[table] !== rows) {
      throw new Error(`Table ${table} : ${counts[table] ?? 0} lignes restaurées au lieu de ${rows}`)
    }
  }
  summary = {
    ok: true,
    path,
    bytes: stats.size,
    createdAt: dump.createdAt,
    ageHours: Number(ageHours.toFixed(2)),
    tables: Object.keys(counts).length,
    rows: Object.values(counts).reduce((total, value) => total + value, 0),
    restored: true,
  }
} catch (error) {
  target.close()
  rmSync(workspace, { recursive: true, force: true })
  fail(`Restauration impossible : ${error.message}`)
}
target.close()
rmSync(workspace, { recursive: true, force: true })
console.log(JSON.stringify(summary))
