// Sauvegarde et restauration logiques d'une base QVault (Turso ou SQLite local).
//
// Le format est un JSON gzippé :
//   { format, createdAt, tables: [{ name, sql, columns, rows }] }
// Il contient les données telles quelles. Le coffre reste chiffré côté client,
// mais les noms d'utilisateur, e-mails, libellés et URL sont en clair : le
// fichier doit rester lisible par son propriétaire uniquement (chmod 600).
import { createHash } from 'node:crypto'
import { mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { gzipSync, gunzipSync } from 'node:zlib'

export const BACKUP_FORMAT = 'qvault-backup/1'

const IGNORED_TABLES = new Set(['sqlite_sequence', 'sqlite_stat1'])

function quoteIdentifier(name) {
  return `"${String(name).replaceAll('"', '""')}"`
}

/** Lit toutes les tables et leurs lignes, dans un ordre stable. */
export async function dumpDatabase(db) {
  const catalog = await db.execute({
    sql: "SELECT type, name, sql FROM sqlite_master WHERE type IN ('table', 'index') AND sql IS NOT NULL ORDER BY type DESC, name ASC",
  })

  const tables = []
  for (const row of catalog.rows) {
    if (String(row.type) !== 'table') continue
    const name = String(row.name)
    if (IGNORED_TABLES.has(name)) continue

    const result = await db.execute({ sql: `SELECT * FROM ${quoteIdentifier(name)}` })
    const columns = result.columns.map(String)
    const rows = result.rows.map(record => columns.map(column => normalizeValue(record[column])))
    tables.push({ name, sql: String(row.sql), columns, rows })
  }

  const indexes = catalog.rows
    .filter(row => String(row.type) === 'index')
    .map(row => ({ name: String(row.name), sql: String(row.sql) }))

  return {
    format: BACKUP_FORMAT,
    createdAt: new Date().toISOString(),
    tables,
    indexes,
  }
}

function normalizeValue(value) {
  if (value === null || value === undefined) return null
  if (typeof value === 'bigint') return Number(value)
  if (value instanceof Uint8Array) return { __bytes: Buffer.from(value).toString('base64') }
  return value
}

function reviveValue(value) {
  if (value && typeof value === 'object' && typeof value.__bytes === 'string') {
    return new Uint8Array(Buffer.from(value.__bytes, 'base64'))
  }
  return value
}

/** Écrit la sauvegarde gzippée et renvoie son chemin, sa taille et son empreinte. */
export function writeBackup(dump, directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 })
  const stamp = dump.createdAt.replaceAll(':', '-').replace(/\.\d+Z$/, 'Z')
  const path = join(directory, `qvault-${stamp}.json.gz`)
  const payload = gzipSync(Buffer.from(JSON.stringify(dump)))
  writeFileSync(path, payload, { mode: 0o600 })
  return {
    path,
    bytes: payload.length,
    sha256: createHash('sha256').update(payload).digest('hex'),
    tables: dump.tables.length,
    rows: dump.tables.reduce((total, table) => total + table.rows.length, 0),
  }
}

export function readBackup(path) {
  const dump = JSON.parse(gunzipSync(readFileSync(path)).toString('utf8'))
  if (dump.format !== BACKUP_FORMAT) throw new Error(`Format de sauvegarde inconnu : ${dump.format}`)
  return dump
}

/**
 * Restaure une sauvegarde. `reset` supprime les tables existantes : à réserver
 * à une base vide ou à une restauration volontaire.
 */
export async function restoreDatabase(db, dump, { reset = false } = {}) {
  if (dump.format !== BACKUP_FORMAT) throw new Error(`Format de sauvegarde inconnu : ${dump.format}`)

  const existing = await db.execute({
    sql: "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
  })
  if (existing.rows.length > 0) {
    if (!reset) throw new Error('La base cible contient déjà des tables. Utilisez --reset pour la remplacer.')
    for (const row of existing.rows) {
      await db.execute({ sql: `DROP TABLE IF EXISTS ${quoteIdentifier(row.name)}` })
    }
  }

  await db.execute('PRAGMA foreign_keys = OFF')
  for (const table of dump.tables) {
    await db.execute({ sql: table.sql })
    if (table.rows.length === 0) continue
    const placeholders = table.columns.map(() => '?').join(', ')
    const sql = `INSERT INTO ${quoteIdentifier(table.name)} (${table.columns.map(quoteIdentifier).join(', ')}) VALUES (${placeholders})`
    for (const row of table.rows) {
      await db.execute({ sql, args: row.map(reviveValue) })
    }
  }
  for (const index of dump.indexes ?? []) {
    await db.execute({ sql: index.sql }).catch(() => {})
  }
  await db.execute('PRAGMA foreign_keys = ON')

  return countRows(db)
}

export async function countRows(db) {
  const tables = await db.execute({
    sql: "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  })
  const counts = {}
  for (const row of tables.rows) {
    const name = String(row.name)
    const result = await db.execute({ sql: `SELECT COUNT(*) AS total FROM ${quoteIdentifier(name)}` })
    counts[name] = Number(result.rows[0]?.total ?? 0)
  }
  return counts
}

/** Supprime les sauvegardes plus anciennes que `days`. */
export function pruneBackups(directory, days) {
  if (!Number.isFinite(days) || days <= 0) return []
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  const removed = []
  let entries = []
  try {
    entries = readdirSync(directory)
  } catch {
    return removed
  }
  for (const entry of entries) {
    if (!/^qvault-.*\.json\.gz$/.test(entry)) continue
    const path = join(directory, entry)
    if (statSync(path).mtimeMs >= cutoff) continue
    unlinkSync(path)
    removed.push(path)
  }
  return removed
}

/**
 * Charge un fichier d'environnement simple (KEY=VALUE) sans écraser les
 * variables déjà définies. Les secrets restent hors du dépôt.
 */
export function loadEnvFile(path = process.env.QVAULT_ENV_FILE || join(homedir(), '.config', 'qvault', 'backup-credentials.txt')) {
  let content
  try {
    content = readFileSync(path, 'utf8')
  } catch {
    return { path, loaded: false }
  }
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator < 1) continue
    const key = trimmed.slice(0, separator).trim()
    let value = trimmed.slice(separator + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
  return { path, loaded: true }
}

export function resolveDirectory(value) {
  if (value) return value
  return join(process.env.HOME || '.', 'qvault-backups')
}

export function ensureParent(path) {
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 })
}
