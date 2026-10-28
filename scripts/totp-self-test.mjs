// Test autonome du TOTP côté serveur : vecteurs RFC 6238, base32, fenêtre,
// anti-rejeu et URL otpauth.
import {
  buildOtpAuthUrl,
  decodeBase32,
  encodeBase32,
  generateTotpSecret,
  normalizeTotpCode,
  TOTP_PERIOD,
  totpCode,
  verifyTotp,
} from '../server/utils/totp.ts'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

// --- Vecteurs officiels RFC 6238 (annexe B), HMAC-SHA1, 8 chiffres -------
const rfcSecret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ' // "12345678901234567890"
const rfcVectors = [
  [59, '94287082'],
  [1111111109, '07081804'],
  [1111111111, '14050471'],
  [1234567890, '89005924'],
  [2000000000, '69279037'],
]
for (const [seconds, expected] of rfcVectors) {
  const step = Math.floor(seconds / TOTP_PERIOD)
  const actual = totpCode(rfcSecret, step, 8)
  assert(actual === expected, `RFC 6238 t=${seconds}: attendu ${expected}, obtenu ${actual}`)
}

// --- base32 -------------------------------------------------------------
const raw = Buffer.from('12345678901234567890')
assert(encodeBase32(raw) === rfcSecret, 'encodeBase32 ne produit pas la valeur RFC')
assert(decodeBase32(rfcSecret).equals(raw), 'decodeBase32 ne restitue pas les octets')
assert(decodeBase32('gezd gnbv gy3t qojq gezd gnbv gy3t qojq'.replaceAll(' ', '')).equals(raw), 'decodeBase32 doit ignorer la casse')
assert(decodeBase32(rfcSecret + '======').equals(raw), 'decodeBase32 doit tolérer le remplissage')
let threw = false
try { decodeBase32('ABC1') } catch { threw = true }
assert(threw, 'decodeBase32 doit refuser un caractère hors alphabet')

// --- Génération ---------------------------------------------------------
const generated = generateTotpSecret()
assert(/^[A-Z2-7]+$/.test(generated), 'le secret généré doit être en base32')
assert(decodeBase32(generated).length === 20, 'le secret généré doit faire 160 bits')

// --- Vérification, fenêtre et anti-rejeu --------------------------------
const secret = generateTotpSecret()
const now = 1_700_000_000_000 // ms
const step = Math.floor(now / 1000 / TOTP_PERIOD)
const good = totpCode(secret, step)
assert(verifyTotp(secret, good, { now }).ok, 'le code courant doit être accepté')
assert(verifyTotp(secret, ` ${good.slice(0, 3)} ${good.slice(3)} `, { now }).ok, 'les espaces doivent être ignorés')
assert(verifyTotp(secret, totpCode(secret, step - 1), { now }).ok, 'le pas précédent doit être accepté (fenêtre de 1)')
assert(verifyTotp(secret, totpCode(secret, step + 1), { now }).ok, 'le pas suivant doit être accepté (fenêtre de 1)')
assert(!verifyTotp(secret, totpCode(secret, step + 3), { now }).ok, 'un code hors fenêtre doit être refusé')
assert(!verifyTotp(secret, '000000', { now }).ok || good === '000000', 'un code arbitraire doit être refusé')
assert(!verifyTotp(secret, '12345', { now }).ok, 'un code trop court doit être refusé')
assert(!verifyTotp(secret, 'abcdef', { now }).ok, 'un code non numérique doit être refusé')
assert(!verifyTotp('pas-un-secret', good, { now }).ok, 'un secret invalide doit être refusé sans exception')

const accepted = verifyTotp(secret, good, { now })
const replay = verifyTotp(secret, good, { now, lastStep: accepted.step })
assert(!replay.ok && replay.replayed === true, 'un code déjà utilisé doit être signalé comme rejoué')
const nextStepCode = totpCode(secret, step + 1)
assert(verifyTotp(secret, nextStepCode, { now, lastStep: accepted.step }).ok, 'le pas suivant reste valable après un code consommé')

// --- URL otpauth --------------------------------------------------------
const url = buildOtpAuthUrl({ secret, account: 'alice@example.com', issuer: 'QVault' })
assert(url.startsWith('otpauth://totp/'), 'URL otpauth invalide')
assert(url.includes('secret=' + secret), 'URL otpauth sans secret')
assert(url.includes('issuer=QVault'), 'URL otpauth sans issuer')
assert(url.includes('algorithm=SHA1') && url.includes('digits=6') && url.includes('period=30'), 'paramètres otpauth incomplets')
assert(url.includes('QVault%3Aalice%40example.com') || url.includes('QVault:alice%40example.com'), 'label otpauth mal encodé')

assert(normalizeTotpCode(' 12 34-56 ') === '123456', 'normalizeTotpCode doit retirer espaces et tirets')

console.log(JSON.stringify({ ok: true, checks: 22 }, null, 2))
