import type { createClient } from '@libsql/client'

const DESIRED_COLUMNS = [
  'id',
  'user_id',
  'type',
  'label',
  'is_encrypted',
  'payload',
  'iv',
  'url',
  'favorite',
  'created_at',
  'updated_at',
] as const

let migrationPromise: Promise<void> | null = null

function isVaultSchemaReady(sql: string | null | undefined) {
  return !!sql && sql.includes("'recovery'") && sql.includes('url TEXT')
}

async function runVaultSchemaMigration(db: ReturnType<typeof createClient>) {
  const userTableInfo = await db.execute({ sql: "PRAGMA table_info('users')" })
  const userColumns = new Set(userTableInfo.rows.map(row => String((row as any).name || '')))
  if (userTableInfo.rows.length > 0 && !userColumns.has('session_version')) {
    try {
      await db.execute({ sql: 'ALTER TABLE users ADD COLUMN session_version INTEGER NOT NULL DEFAULT 0' })
    } catch (error) {
      if (!String((error as any)?.message || error).toLowerCase().includes('duplicate column')) throw error
    }
  }

  const tableInfo = await db.execute({
    sql: "PRAGMA table_info('vault_items')",
  })

  // No existing table: the current schema will create the correct one elsewhere.
  if (tableInfo.rows.length === 0) return

  const columns = new Set(
    tableInfo.rows
      .map(row => String((row as any).name || '').trim())
      .filter(Boolean),
  )

  const master = await db.execute({
    sql: "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'vault_items'",
  })
  const currentSql = String((master.rows[0] as any)?.sql || '')

  if (columns.has('url') && isVaultSchemaReady(currentSql)) {
    return
  }

  const selectColumns = DESIRED_COLUMNS.map((column) => {
    if (columns.has(column)) return column
    if (column === 'url') return 'NULL AS url'
    if (column === 'favorite') return '0 AS favorite'
    if (column === 'created_at' || column === 'updated_at') return "datetime('now') AS " + column
    return column
  })

  await db.execute({ sql: 'BEGIN IMMEDIATE' })

  try {
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS vault_items_migrated (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('link', 'password', 'crypto', 'recovery')),
          label TEXT NOT NULL DEFAULT '',
          is_encrypted INTEGER NOT NULL DEFAULT 0,
          payload TEXT NOT NULL,
          iv TEXT,
          url TEXT,
          favorite INTEGER NOT NULL DEFAULT 0,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `,
    })

    await db.execute({
      sql: `
        INSERT INTO vault_items_migrated (${DESIRED_COLUMNS.join(', ')})
        SELECT ${selectColumns.join(', ')}
        FROM vault_items
      `,
    })

    await db.execute({ sql: 'DROP TABLE vault_items' })
    await db.execute({ sql: 'ALTER TABLE vault_items_migrated RENAME TO vault_items' })
    await db.execute({ sql: 'CREATE INDEX IF NOT EXISTS idx_vault_items_user_id ON vault_items(user_id)' })
    await db.execute({ sql: 'CREATE INDEX IF NOT EXISTS idx_vault_items_user_type ON vault_items(user_id, type)' })
    await db.execute({ sql: 'CREATE INDEX IF NOT EXISTS idx_vault_items_favorite ON vault_items(user_id, favorite)' })

    await db.execute({ sql: 'COMMIT' })
  } catch (error) {
    await db.execute({ sql: 'ROLLBACK' }).catch(() => {})
    throw error
  }
}

export function ensureVaultSchema(db: ReturnType<typeof createClient>) {
  if (!migrationPromise) {
    migrationPromise = runVaultSchemaMigration(db).finally(() => {
      migrationPromise = null
    })
  }

  return migrationPromise
}
