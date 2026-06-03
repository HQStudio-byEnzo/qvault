import { readFile } from 'node:fs/promises'
import { createClient } from '@libsql/client'

const filePath = process.argv[2]

if (!filePath) {
  console.error('Usage: node scripts/run-turso-sql.mjs <sql-file>')
  process.exit(1)
}

const url = process.env.TURSO_DB_URL
const authToken = process.env.TURSO_DB_TOKEN

if (!url || !authToken) {
  console.error('Missing TURSO_DB_URL or TURSO_DB_TOKEN')
  process.exit(1)
}

const sql = await readFile(filePath, 'utf8')
const db = createClient({ url, authToken })

await db.execute({ sql })
console.log(`Applied ${filePath}`)
