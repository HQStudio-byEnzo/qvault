// Crée le schéma dans la base de test locale utilisée par les tests d'API
// (CI ou poste de dev). Sans cela, le nettoyage du test échoue sur une base
// SQLite vide, car le serveur ne crée le schéma qu'au premier appel API.
import { readFileSync } from 'node:fs'
import { createClient } from '@libsql/client'

const url = process.env.TURSO_DB_URL || 'file:./qvault-ci.db'
const schema = readFileSync(new URL('../server/database/schema.sql', import.meta.url), 'utf8')

// Le client SQLite local n'exécute que la première instruction d'un script :
// on découpe donc le schéma instruction par instruction.
const statements = schema.split(/;\s*(?:\r?\n|$)/).map(s => s.trim()).filter(Boolean)

const db = createClient({ url })
try {
  for (const statement of statements) await db.execute({ sql: statement })
} finally {
  db.close()
}

console.log(JSON.stringify({ ok: true, schema: 'server/database/schema.sql', statements: statements.length }))
