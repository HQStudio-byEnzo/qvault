// Test de la sauvegarde : dump, écriture gzippée, relecture et restauration
// dans une base neuve, puis purge des anciens fichiers.
import { mkdtempSync, readdirSync, rmSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createClient } from '@libsql/client'
import { countRows, dumpDatabase, loadEnvFile, pruneBackups, readBackup, restoreDatabase, writeBackup } from './backup-lib.mjs'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const schema = [
  'CREATE TABLE users (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, email TEXT NOT NULL, password TEXT NOT NULL, created_at TEXT)',
  'CREATE TABLE vaults (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id))',
  'CREATE TABLE vault_items (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, label TEXT NOT NULL, payload TEXT NOT NULL, iv TEXT, FOREIGN KEY (user_id) REFERENCES users(id))',
  'CREATE INDEX idx_vault_items_user ON vault_items(user_id)',
]

const directory = mkdtempSync(join(tmpdir(), 'qvault-backup-'))
const sourcePath = join(directory, 'source.db')
const targetPath = join(directory, 'target.db')

try {
  const source = createClient({ url: `file:${sourcePath}` })
  for (const statement of schema) await source.execute(statement)
  await source.execute({
    sql: 'INSERT INTO users (id, username, email, password, created_at) VALUES (?, ?, ?, ?, ?)',
    args: ['u1', 'enzo', 'enzo@example.com', 'hash', '2026-01-02 03:04:05'],
  })
  await source.execute({ sql: 'INSERT INTO vaults (id, user_id, name) VALUES (?, ?, ?)', args: ['v1', 'u1', 'Banque'] })
  await source.execute({
    sql: 'INSERT INTO vault_items (id, user_id, label, payload, iv) VALUES (?, ?, ?, ?, ?)',
    args: ['i1', 'u1', 'Compte courant — épargne', 'v2:600000:c2FsdA==:Y2lwaGVy', null],
  })

  const dump = await dumpDatabase(source)
  source.close()

  assert(dump.tables.length === 3, `Tables sauvegardées : ${dump.tables.length}`)
  assert(dump.indexes.length === 1, `Index sauvegardés : ${dump.indexes.length}`)

  const backup = writeBackup(dump, join(directory, 'backups'))
  assert(backup.bytes > 0, 'Sauvegarde vide')
  assert(/^[0-9a-f]{64}$/.test(backup.sha256), 'Empreinte SHA-256 invalide')

  const reloaded = readBackup(backup.path)
  const target = createClient({ url: `file:${targetPath}` })
  const counts = await restoreDatabase(target, reloaded, { reset: true })

  assert(counts.users === 1 && counts.vaults === 1 && counts.vault_items === 1, `Comptes restaurés : ${JSON.stringify(counts)}`)

  const item = await target.execute({ sql: 'SELECT label, payload, iv FROM vault_items WHERE id = ?', args: ['i1'] })
  assert(item.rows[0]?.label === 'Compte courant — épargne', 'Libellé altéré par la sauvegarde')
  assert(item.rows[0]?.payload === 'v2:600000:c2FsdA==:Y2lwaGVy', 'Contenu chiffré altéré')
  assert(item.rows[0]?.iv === null, 'Valeur NULL altérée')

  const user = await target.execute({ sql: 'SELECT created_at FROM users WHERE id = ?', args: ['u1'] })
  assert(user.rows[0]?.created_at === '2026-01-02 03:04:05', 'Date altérée')

  const index = await target.execute({ sql: "SELECT name FROM sqlite_master WHERE type = 'index' AND name = 'idx_vault_items_user'" })
  assert(index.rows.length === 1, 'Index non restauré')

  // Une seconde restauration sans --reset doit refuser d'écraser la base.
  let refused = false
  try {
    await restoreDatabase(target, reloaded)
  } catch {
    refused = true
  }
  assert(refused, 'La restauration a écrasé une base non vide sans --reset')

  const before = Object.values(await countRows(target)).reduce((total, value) => total + value, 0)
  assert(before === 3, `Lignes après refus : ${before}`)
  target.close()

  // Purge : un fichier ancien doit partir, un récent rester.
  const oldPath = join(directory, 'backups', 'qvault-old.json.gz')
  writeFileSync(oldPath, 'old')
  const oldDate = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)
  utimesSync(oldPath, oldDate, oldDate)
  const removed = pruneBackups(join(directory, 'backups'), 14)
  assert(removed.includes(oldPath), 'Ancienne sauvegarde non purgée')
  assert(readdirSync(join(directory, 'backups')).includes(backup.path.split('/').pop()), 'Sauvegarde récente purgée à tort')

  // Fichier d'identifiants : chargé, sans écraser une variable déjà définie.
  const envPath = join(directory, 'backup.env')
  writeFileSync(envPath, '# commentaire\nTURSO_DB_URL=file:/tmp/exemple.db\nTURSO_DB_TOKEN="jeton"\n')
  delete process.env.TURSO_DB_TOKEN
  process.env.TURSO_DB_URL = 'deja-defini'
  const env = loadEnvFile(envPath)
  assert(env.loaded, 'Fichier d’identifiants non chargé')
  assert(process.env.TURSO_DB_URL === 'deja-defini', 'Une variable existante a été écrasée')
  assert(process.env.TURSO_DB_TOKEN === 'jeton', 'Jeton non chargé')
  delete process.env.TURSO_DB_URL
  delete process.env.TURSO_DB_TOKEN

  console.log(JSON.stringify({
    ok: true,
    tables: dump.tables.length,
    rows: backup.rows,
    checksum: true,
    gzipRoundTrip: true,
    unicodeLabelPreserved: true,
    nullPreserved: true,
    indexRestored: true,
    overwriteRefused: true,
    retention: true,
    envFile: true,
  }))
} finally {
  rmSync(directory, { recursive: true, force: true })
}
