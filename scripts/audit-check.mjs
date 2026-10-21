// Vérifie les avis de sécurité de `bun audit` en échouant sur tout avis qui
// n'est pas explicitement accepté dans scripts/audit-allowlist.json.
//
// `bun audit` sort en erreur dès qu'un avis existe, ce qui rendrait la CI
// rouge en permanence pour deux dépendances de dev sans version corrigée.
// L'allowlist ne couvre que ces avis précis (par URL GHSA) : un nouvel avis,
// même sur le même paquet, fait échouer le job.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dir, '..')
const allowlist = JSON.parse(readFileSync(join(root, 'scripts/audit-allowlist.json'), 'utf8'))
const allowed = new Set((allowlist.advisories ?? []).map(entry => entry.url))

const result = spawnSync(process.execPath, ['audit', '--json'], { cwd: root, encoding: 'utf8' })
const output = (result.stdout || '').trim()

if (!output) {
  console.error(`bun audit n'a produit aucun JSON (code ${result.status}).\n${result.stderr || ''}`)
  process.exit(1)
}

let advisories
try {
  advisories = JSON.parse(output)
} catch (error) {
  console.error(`JSON de bun audit illisible : ${error.message}`)
  process.exit(1)
}

const findings = []
for (const [pkg, entries] of Object.entries(advisories)) {
  for (const entry of entries) {
    if (allowed.has(entry.url)) continue
    findings.push({ package: pkg, severity: entry.severity, url: entry.url, title: entry.title })
  }
}

if (findings.length > 0) {
  console.error(JSON.stringify({ ok: false, unacceptedAdvisories: findings }, null, 2))
  process.exit(1)
}

const accepted = Object.values(advisories).flat().filter(entry => allowed.has(entry.url))
console.log(JSON.stringify({
  ok: true,
  acceptedAdvisories: accepted.map(entry => entry.url),
}))
