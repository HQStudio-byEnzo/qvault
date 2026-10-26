// Régressions de sécurité de l'API, contre un serveur lancé (comme test:smoke).
// SECURITY_BASE_URL=http://localhost:3000 SECURITY_DB_URL=file:./qvault-dev.db bun scripts/security-api-test.mjs
import { createClient } from '@libsql/client'

const baseURL = process.env.SECURITY_BASE_URL || 'http://localhost:3000'
const dbUrl = process.env.SECURITY_DB_URL || process.env.TURSO_DB_URL || 'file:./qvault-dev.db'
const stamp = Date.now()
const username = `secprobe_${stamp}`
const email = `secprobe-${stamp}@example.com`
const password = 'Security-Probe-2026!'
const results = {}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function call(path, { method = 'GET', body, cookie, origin = true, fetchSite = 'same-origin', headers = {} } = {}) {
  const h = new Headers(headers)
  if (body) h.set('content-type', 'application/json')
  if (cookie) h.set('cookie', cookie)
  if (method !== 'GET') {
    if (origin) h.set('origin', baseURL)
    if (fetchSite) h.set('sec-fetch-site', fetchSite)
  }
  const response = await fetch(`${baseURL}${path}`, { method, headers: h, body: body && JSON.stringify(body) })
  const setCookie = response.headers.get('set-cookie')
  const text = await response.text()
  let data
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  return { status: response.status, data, cookie: setCookie ? setCookie.split(';', 1)[0] : null }
}

const b64 = bytes => Buffer.from(bytes).toString('base64')
const salt = b64(new Uint8Array(16).fill(1))
const ct = b64(new Uint8Array(32).fill(2))
const iv = b64(new Uint8Array(12).fill(3))

async function cleanup() {
  const db = createClient({ url: dbUrl, authToken: process.env.TURSO_DB_TOKEN || undefined })
  try {
    const users = await db.execute({ sql: "SELECT id FROM users WHERE username LIKE 'secprobe_%'" })
    for (const row of users.rows) {
      const id = String(row.id)
      for (const table of ['vault_item_history', 'vault_items', 'tags', 'folders', 'vaults', 'master_verifiers', 'extension_tokens', 'extension_pair_codes', 'email_verification_tokens', 'accepted_terms']) {
        await db.execute({ sql: `DELETE FROM ${table} WHERE user_id = ?`, args: [id] }).catch(() => {})
      }
      await db.execute({ sql: 'DELETE FROM user_sessions WHERE user_id = ?', args: [id] }).catch(() => {})
      await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [id] })
    }
    if (dbUrl.startsWith('file:')) await db.execute('DELETE FROM rate_limits')
  } finally { db.close() }
}

async function login() {
  const result = await call('/api/auth/login', { method: 'POST', body: { username, password } })
  assert(result.status === 200 && result.cookie, `login: ${result.status}`)
  return result.cookie
}

try {
  await cleanup()
  const registration = await call('/api/auth/register', { method: 'POST', body: { username, email, password, acceptedTerms: true } })
  assert(registration.status === 200, `register: ${registration.status}`)
  const token = new URL(registration.data.devVerificationUrl).searchParams.get('token')
  assert((await call('/api/auth/verify-email', { method: 'POST', body: { token } })).status === 200, 'verify-email')
  const cookie = await login()

  // F7 : sans en-tête Origin, seul Sec-Fetch-Site: same-origin est accepté.
  const tag = { kind: 'tag', name: 'probe' }
  assert((await call('/api/organization', { method: 'POST', body: tag, cookie, origin: false, fetchSite: 'same-site' })).status === 403,
    'F7: same-site sans Origin accepté')
  assert((await call('/api/organization', { method: 'POST', body: tag, cookie, origin: false, fetchSite: 'same-origin' })).status === 200,
    'F7: same-origin sans Origin refusé')
  results.f7SameSiteRejected = true

  // F4 : l'ancien format (100 000 itérations) n'est plus accepté à l'écriture.
  const legacy = await call('/api/vault', { method: 'POST', cookie, body: { type: 'note', label: 'x', payload: `${salt}:${ct}`, iv } })
  assert(legacy.status === 400, `F4: format obsolète accepté (${legacy.status})`)
  const current = await call('/api/vault', { method: 'POST', cookie, body: { type: 'note', label: 'x', payload: `v2:600000:${salt}:${ct}`, iv } })
  assert(current.status === 200, `F4: format courant refusé (${current.status})`)
  // Un élément déjà en base à l'ancien format reste modifiable (favori, libellé)…
  const legacyId = `legacy-${stamp}`
  const db = createClient({ url: dbUrl, authToken: process.env.TURSO_DB_TOKEN || undefined })
  const userId = String((await db.execute({ sql: 'SELECT id FROM users WHERE username = ?', args: [username] })).rows[0].id)
  await db.execute({
    sql: "INSERT INTO vault_items (id, user_id, vault_id, type, label, is_encrypted, payload, iv, created_at, updated_at) VALUES (?, ?, ?, 'note', 'old', 1, ?, ?, datetime('now'), datetime('now'))",
    args: [legacyId, userId, `default-${userId}`, `${salt}:${ct}`, iv],
  })
  db.close()
  assert((await call(`/api/vault/${legacyId}`, { method: 'PUT', cookie, body: { favorite: true } })).status === 200, 'F4: ancien élément non modifiable')
  // … mais on ne peut pas y réécrire une charge à l'ancien format.
  assert((await call(`/api/vault/${legacyId}`, { method: 'PUT', cookie, body: { payload: `${salt}:${ct}`, iv } })).status === 400, 'F4: réécriture à l’ancien format acceptée')
  results.f4LegacyWriteRejected = true

  // Re-chiffrement ciblé : l'ancienne enveloppe doit être celle stockée.
  const upgradeBody = { items: [{ id: legacyId, previousPayload: `${salt}:${ct}`, payload: `v2:600000:${salt}:${ct}`, iv }] }
  assert((await call('/api/vault/upgrade-encryption', { method: 'POST', cookie, body: upgradeBody })).status === 200, 'upgrade: charge héritée refusée')
  assert((await call('/api/vault/upgrade-encryption', { method: 'POST', cookie, body: upgradeBody })).status === 409, 'upgrade: charge déjà remplacée acceptée')
  results.legacyUpgradeGuarded = true

  // Noms d'organisation : le clair reste accepté pour les lignes héritées,
  // l'enveloppe n1 est stockée telle quelle, la migration vérifie l'ancien nom.
  const nameEnvelope = `n1:${salt}:${iv}:${ct}`
  const nameEnvelope2 = `n1:${salt}:${iv}:${b64(new Uint8Array(32).fill(4))}`
  const legacyTag = await call('/api/organization', { method: 'POST', cookie, body: { kind: 'tag', name: 'herite', color: '#4ade80' } })
  assert(legacyTag.status === 200, `org: nom en clair refusé (${legacyTag.status})`)
  assert((await call('/api/organization', { method: 'POST', cookie, body: { kind: 'tag', name: 'n1:pas:valide', name_encrypted: true } })).status === 400, 'org: enveloppe invalide acceptée')
  const sealedTag = await call('/api/organization', { method: 'POST', cookie, body: { kind: 'tag', name: nameEnvelope, name_encrypted: true, color: '#4ade80' } })
  assert(sealedTag.status === 200, `org: enveloppe refusée (${sealedTag.status})`)
  const org = await call('/api/organization', { cookie })
  const storedTag = org.data.tags.find(entry => entry.id === sealedTag.data.id)
  assert(storedTag?.name === nameEnvelope && storedTag?.name_encrypted === true, 'org: nom stocké transformé')
  assert((await call('/api/organization/encrypt-name', { method: 'POST', cookie, body: { kind: 'tag', id: legacyTag.data.id, previous_name: 'faux', name: nameEnvelope2 } })).status === 409, 'org: migration avec un ancien nom erroné acceptée')
  assert((await call('/api/organization/encrypt-name', { method: 'POST', cookie, body: { kind: 'tag', id: legacyTag.data.id, previous_name: 'herite', name: nameEnvelope2 } })).status === 200, 'org: migration refusée')
  results.organizationNamesEncrypted = true

  // Rotation du mot de passe maître : les noms d'organisation changent dans la
  // même transaction que les éléments et l'historique.
  const allItems = await call('/api/vault', { cookie })
  const encryptedItems = allItems.data.items.filter(item => item.is_encrypted)
  const allHistory = await call('/api/vault/history?limit=1000', { cookie })
  const encryptedHistory = allHistory.data.history.filter(snapshot => snapshot.is_encrypted)
  const rotatedName = `n1:${salt}:${iv}:${b64(new Uint8Array(32).fill(5))}`
  const rotation = await call('/api/vault/rotate-encryption', {
    method: 'POST',
    cookie,
    body: {
      items: encryptedItems.map(item => ({ id: item.id, previousPayload: item.payload, previousIv: item.iv, payload: item.payload, iv: item.iv })),
      history: encryptedHistory.map(snapshot => ({ id: snapshot.id, previousPayload: snapshot.payload, previousIv: snapshot.iv, payload: snapshot.payload, iv: snapshot.iv })),
      organization: [{ kind: 'tag', id: sealedTag.data.id, previousPayload: nameEnvelope, payload: rotatedName }],
      verifier: { payload: `v2:600000:${salt}:${ct}`, iv },
    },
  })
  assert(rotation.status === 200, `rotation: ${rotation.status}`)
  const rotatedOrg = await call('/api/organization', { cookie })
  assert(rotatedOrg.data.tags.find(entry => entry.id === sealedTag.data.id)?.name === rotatedName, 'rotation: nom d’organisation non mis à jour')
  results.organizationRotationAtomic = true

  // La session renvoyée au navigateur ne contient pas l'identifiant de session.
  const session = await call('/api/auth/session', { cookie })
  assert(session.data?.user?.id && !JSON.stringify(session.data).includes('"secure"'), 'session: données serveur exposées')

  // Appairage : code long, à usage unique.
  const pairing = await call('/api/security/extension-pair', { method: 'POST', cookie })
  assert(pairing.status === 200, `pair-create: ${pairing.status}`)
  assert(/^[ABCDEFGHJKMNPQRSTVWXYZ23456789]{10}$/.test(pairing.data.code), `pair: code faible (${pairing.data.code})`)
  const paired = await call('/api/extension/pair', { method: 'POST', body: { code: pairing.data.code } })
  assert(paired.status === 200 && /^blx_/.test(paired.data.token), `pair: ${paired.status}`)
  assert((await call('/api/extension/pair', { method: 'POST', body: { code: pairing.data.code } })).status === 401, 'pair: code réutilisable')
  results.pairCodeStrong = true

  // Saisie tolérante : minuscules et tiret acceptés, mauvais format refusé.
  const formatted = await call('/api/security/extension-pair', { method: 'POST', cookie })
  const typed = `${formatted.data.code.slice(0, 5)}-${formatted.data.code.slice(5)}`.toLowerCase()
  assert((await call('/api/extension/pair', { method: 'POST', body: { code: typed } })).status === 200, 'pair: saisie formatée refusée')
  assert((await call('/api/extension/pair', { method: 'POST', body: { code: '123456' } })).status === 400, 'pair: ancien format accepté')

  // F10 : un cookie copié avant la déconnexion ne sert plus après.
  const stolen = await login()
  assert((await call('/api/vault', { cookie: stolen })).status === 200, 'F10: session neuve refusée')
  assert((await call('/api/auth/logout', { method: 'POST', cookie: stolen })).status === 200, 'logout')
  assert((await call('/api/vault', { cookie: stolen })).status === 401, 'F10: cookie encore valide après déconnexion')
  // Les autres appareils restent connectés.
  assert((await call('/api/vault', { cookie })).status === 200, 'F10: la déconnexion a fermé les autres sessions')
  results.f10LogoutRevokes = true

  // Corbeille : suppression réversible, restauration, purge explicite.
  const trashed = await call('/api/vault', { method: 'POST', cookie, body: { type: 'note', label: 'corbeille', payload: `v2:600000:${salt}:${ct}`, iv } })
  const trashId = trashed.data.id
  assert((await call(`/api/vault/${trashId}`, { method: 'DELETE', cookie })).status === 200, 'corbeille: suppression refusée')
  assert(!(await call('/api/vault', { cookie })).data.items.some(entry => entry.id === trashId), 'corbeille: élément encore actif')
  assert((await call('/api/vault/trash', { cookie })).data.items.some(entry => entry.id === trashId), 'corbeille: élément absent de la liste')
  assert((await call(`/api/vault/${trashId}/undelete`, { method: 'POST', cookie })).status === 200, 'corbeille: restauration refusée')
  assert((await call('/api/vault', { cookie })).data.items.some(entry => entry.id === trashId), 'corbeille: élément non restauré')
  const active = await call('/api/vault', { method: 'POST', cookie, body: { type: 'note', label: 'actif', payload: `v2:600000:${salt}:${ct}`, iv } })
  assert((await call(`/api/vault/${active.data.id}?permanent=1`, { method: 'DELETE', cookie })).status === 400, 'corbeille: suppression définitive sans corbeille acceptée')
  assert((await call(`/api/vault/${trashId}`, { method: 'DELETE', cookie })).status === 200, 'corbeille: mise à la corbeille refusée')
  assert((await call(`/api/vault/${trashId}?permanent=1`, { method: 'DELETE', cookie })).status === 200, 'corbeille: suppression définitive refusée')
  assert(!(await call('/api/vault/trash', { cookie })).data.items.some(entry => entry.id === trashId), 'corbeille: élément toujours présent après purge')
  results.trashRestorable = true

  // Sessions : liste, révocation ciblée, fermeture des autres appareils.
  const secondDevice = await login()
  const sessions = (await call('/api/security/sessions', { cookie })).data.sessions
  const currentSession = sessions.find(entry => entry.current)
  const otherSession = sessions.find(entry => !entry.current)
  assert(currentSession && otherSession, 'sessions: liste incomplète')
  assert((await call(`/api/security/sessions/${currentSession.id}`, { method: 'DELETE', cookie })).status === 400, 'sessions: session courante révocable')
  assert((await call(`/api/security/sessions/${otherSession.id}`, { method: 'DELETE', cookie })).status === 200, 'sessions: révocation refusée')
  assert((await call('/api/vault', { cookie: secondDevice })).status === 401, 'sessions: session révoquée encore valide')
  assert((await call('/api/vault', { cookie })).status === 200, 'sessions: session courante fermée par erreur')
  const thirdDevice = await login()
  assert((await call('/api/security/sessions/revoke-others', { method: 'POST', cookie })).status === 200, 'sessions: fermeture des autres refusée')
  assert((await call('/api/vault', { cookie: thirdDevice })).status === 401, 'sessions: autre session encore valide')
  assert((await call('/api/vault', { cookie })).status === 200, 'sessions: session courante fermée')
  results.sessionsRevocable = true

  console.log(JSON.stringify({ ok: true, ...results }))
} finally {
  await cleanup()
}
