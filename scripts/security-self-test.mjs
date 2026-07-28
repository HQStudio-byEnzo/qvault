import { useCrypto } from '../composables/useCrypto.ts'
import { useTotp } from '../composables/useTotp.ts'
import { parsePasswordEntry, serializePasswordEntry } from '../utils/password-entry.ts'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const cryptoTools = useCrypto()
const plaintext = 'bitlock://self-test/é2e'
const password = 'correct horse battery staple'
const envelope = await cryptoTools.encrypt(plaintext, password)
assert(atob(envelope.salt).length === 16, 'AES salt must contain 16 bytes')
assert(atob(envelope.iv).length === 12, 'AES-GCM IV must contain 12 bytes')
assert(await cryptoTools.decrypt(envelope.ciphertext, envelope.iv, password, envelope.salt) === plaintext, 'AES-GCM round trip failed')

let rejectedWrongPassword = false
try { await cryptoTools.decrypt(envelope.ciphertext, envelope.iv, 'wrong password', envelope.salt) }
catch { rejectedWrongPassword = true }
assert(rejectedWrongPassword, 'AES-GCM accepted the wrong password')

const credential = parsePasswordEntry(serializePasswordEntry({
  username: 'enzo',
  password: 'correct horse battery staple',
}))
assert(credential.schema === 'bitlock.credentials/v1', 'Credential schema is missing')
assert(credential.username === 'enzo' && credential.password === password, 'Credential round trip failed')
assert(parsePasswordEntry('legacy-secret').password === 'legacy-secret', 'Legacy password payload is unsupported')

const { generateTotp } = useTotp()
const vector = await generateTotp('otpauth://totp/RFC?secret=GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ&digits=8&period=30', 59_000)
assert(vector.code === '94287082', `RFC 6238 vector mismatch: ${vector.code}`)

console.log(JSON.stringify({
  ok: true,
  aesGcm: true,
  wrongPasswordRejected: true,
  credentialSchema: true,
  rfc6238: true,
}))
