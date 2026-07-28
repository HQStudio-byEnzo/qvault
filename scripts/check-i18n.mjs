import { readFileSync, readdirSync } from 'node:fs'
import { extname, join } from 'node:path'

const source = readFileSync('composables/useI18n.ts', 'utf8').replaceAll('\r\n', '\n')
const frStart = source.indexOf('  fr: {')
const enStart = source.indexOf('  en: {')
const end = source.lastIndexOf('\n  },\n}')
if (frStart < 0 || enStart < 0 || end < 0) throw new Error('Translation dictionaries could not be located')

function keysIn(value) {
  return [...value.matchAll(/^\s*'([^']+)'\s*:/gm)].map(match => match[1])
}

const frKeys = keysIn(source.slice(frStart, enStart))
const enKeys = keysIn(source.slice(enStart, end))
const fr = new Set(frKeys)
const en = new Set(enKeys)
const duplicateFr = frKeys.filter((key, index) => frKeys.indexOf(key) !== index)
const duplicateEn = enKeys.filter((key, index) => enKeys.indexOf(key) !== index)
const onlyFr = [...fr].filter(key => !en.has(key))
const onlyEn = [...en].filter(key => !fr.has(key))

const files = []
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) walk(path)
    else if (['.vue', '.ts'].includes(extname(entry.name)) && path.replaceAll('\\', '/') !== 'composables/useI18n.ts') files.push(path)
  }
}
for (const directory of ['components', 'composables', 'layouts', 'pages']) walk(directory)

const used = new Set()
for (const file of files) {
  const value = readFileSync(file, 'utf8')
  for (const match of value.matchAll(/\bt\(\s*['"]([^'"]+)['"]\s*\)/g)) used.add(match[1])
}
const missing = [...used].filter(key => !fr.has(key) || !en.has(key))

if (duplicateFr.length || duplicateEn.length || onlyFr.length || onlyEn.length || missing.length) {
  console.error(JSON.stringify({ duplicateFr, duplicateEn, onlyFr, onlyEn, missing }, null, 2))
  process.exit(1)
}
console.log(JSON.stringify({ ok: true, translatedKeys: fr.size, staticallyUsedKeys: used.size }))
