import { readFileSync } from 'node:fs'
import { useCrypto } from '../composables/useCrypto.ts'
import { useTotp } from '../composables/useTotp.ts'
import { forgetPasskeyUnlock } from '../composables/usePasskeyUnlock.ts'
import { parsePasswordEntry, serializePasswordEntry } from '../utils/password-entry.ts'
import { isPrivateAnalyticsPath } from '../utils/analytics.ts'
import { CREDENTIAL_SCHEMA, LEGACY_CREDENTIAL_SCHEMA } from '../utils/brand.ts'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const cryptoTools = useCrypto()
const plaintext = 'qvault://self-test/é2e'
const password = 'correct horse battery staple'
const envelope = await cryptoTools.encrypt(plaintext, password)
assert(envelope.iterations === 600_000, 'New encryption must use 600,000 PBKDF2 iterations')
assert(atob(envelope.salt).length === 16, 'AES salt must contain 16 bytes')
assert(atob(envelope.iv).length === 12, 'AES-GCM IV must contain 12 bytes')
assert(await cryptoTools.decrypt(envelope.ciphertext, envelope.iv, password, envelope.salt) === plaintext, 'AES-GCM round trip failed')
const serializedEnvelope = cryptoTools.serializeEncryptedPayload(envelope)
const parsedEnvelope = cryptoTools.parseEncryptedPayload(serializedEnvelope)
assert(parsedEnvelope.iterations === 600_000, 'Versioned payload lost its KDF work factor')
assert(cryptoTools.parseEncryptedPayload(`${envelope.salt}:${envelope.ciphertext}`).iterations === 100_000, 'Legacy payloads are no longer readable')

let rejectedWrongPassword = false
try { await cryptoTools.decrypt(envelope.ciphertext, envelope.iv, 'wrong password', envelope.salt) }
catch { rejectedWrongPassword = true }
assert(rejectedWrongPassword, 'AES-GCM accepted the wrong password')

const credential = parsePasswordEntry(serializePasswordEntry({
  username: 'enzo',
  password: 'correct horse battery staple',
}))
assert(credential.schema === CREDENTIAL_SCHEMA, 'Credential schema is missing')
assert(credential.username === 'enzo' && credential.password === password, 'Credential round trip failed')
assert(parsePasswordEntry('legacy-secret').password === 'legacy-secret', 'Legacy password payload is unsupported')
assert(
  parsePasswordEntry(JSON.stringify({ schema: LEGACY_CREDENTIAL_SCHEMA, password: 'legacy' })).schema === LEGACY_CREDENTIAL_SCHEMA,
  'Legacy credential schema is rejected',
)

// F5 : se déconnecter oublie le déverrouillage par passkey de ce compte.
const storage = new Map()
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: key => storage.delete(key),
}
storage.set('qvault.security.passkeyUnlock:user-1', '{"version":1}')
storage.set('qvault.security.passkeyUnlock:user-2', '{"version":1}')
forgetPasskeyUnlock('user-1')
assert(!storage.has('qvault.security.passkeyUnlock:user-1'), 'Passkey unlock survives sign-out')
assert(storage.has('qvault.security.passkeyUnlock:user-2'), 'Sign-out forgot another account passkey')

const { generateTotp } = useTotp()
const vector = await generateTotp('otpauth://totp/RFC?secret=GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ&digits=8&period=30', 59_000)
assert(vector.code === '94287082', `RFC 6238 vector mismatch: ${vector.code}`)

// Analytics : aucun script tiers ni événement sur le coffre ou les écrans de connexion.
for (const path of ['/dashboard', '/dashboard/vault', '/auth', '/auth/locked']) {
  assert(isPrivateAnalyticsPath(path), `Analytics autorisé sur une route privée : ${path}`)
}
for (const path of ['/', '/features', '/guides/creer-un-coffre', '/audit-securite', '/support', '/dashboardx']) {
  assert(!isPrivateAnalyticsPath(path), `Analytics bloqué sur une route publique : ${path}`)
}

// Aucun indice de mot de passe : la colonne n'est plus créée et aucun libellé
// ne propose d'en enregistrer un.
const schemaSql = readFileSync(new URL('../server/database/schema.sql', import.meta.url), 'utf8')
assert(!/password_hint/.test(schemaSql), 'password_hint est encore créé par le schéma')
const i18nSource = readFileSync(new URL('../composables/useI18n.ts', import.meta.url), 'utf8')
assert(!/'[a-zA-Z.]*hint[A-Z][^']*':/.test(i18nSource), 'Un libellé d’indice de mot de passe subsiste')

console.log(JSON.stringify({
  ok: true,
  aesGcm: true,
  wrongPasswordRejected: true,
  versionedKdf: true,
  legacyPayloadCompatible: true,
  credentialSchema: true,
  rfc6238: true,
  passkeyForgottenOnSignOut: true,
  analyticsPrivateRoutes: true,
  noPasswordHintSurface: true,
}))
