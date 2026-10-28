import {
  MAX_BCRYPT_PASSWORD_BYTES,
  MIN_ACCOUNT_PASSWORD_LENGTH,
} from '~/utils/security-policy'

const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/
const USERNAME_PATTERN = /^[a-z0-9][a-z0-9._-]{2,31}$/

export function requireRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw createError({ statusCode: 400, message: 'Invalid request body.' })
  }
  return value as Record<string, unknown>
}

export function requireString(
  value: unknown,
  field: string,
  options: { min?: number; max: number; trim?: boolean } = { max: 1_000 },
) {
  if (typeof value !== 'string') {
    throw createError({ statusCode: 400, message: `${field} must be a string.` })
  }

  const result = options.trim === false ? value : value.trim()
  if (result.length < (options.min ?? 1) || result.length > options.max) {
    throw createError({ statusCode: 400, message: `${field} has an invalid length.` })
  }
  return result
}

export function normalizeUsername(value: unknown) {
  const username = requireString(value, 'Username', { min: 3, max: 32 }).toLowerCase()
  if (!USERNAME_PATTERN.test(username)) {
    throw createError({
      statusCode: 400,
      message: 'Le username doit contenir 3 à 32 caractères : lettres, chiffres, point, tiret ou underscore.',
    })
  }
  return username
}

export function normalizeEmail(value: unknown) {
  const email = requireString(value, 'Email', { min: 5, max: 254 }).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    throw createError({ statusCode: 400, message: 'Adresse e-mail invalide.' })
  }
  return email
}

export function normalizeLoginIdentifier(value: unknown) {
  const identifier = requireString(value, 'Username', { min: 3, max: 254 }).toLowerCase()
  if (identifier.includes('@')) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      throw createError({ statusCode: 400, message: 'Identifiant de connexion invalide.' })
    }
    return identifier
  }
  return normalizeUsername(identifier)
}

export function requireNewAccountPassword(value: unknown, field = 'Password') {
  const password = requireString(value, field, {
    min: MIN_ACCOUNT_PASSWORD_LENGTH,
    max: 128,
    trim: false,
  })
  if (new TextEncoder().encode(password).byteLength > MAX_BCRYPT_PASSWORD_BYTES) {
    throw createError({
      statusCode: 400,
      message: `${field} must not exceed ${MAX_BCRYPT_PASSWORD_BYTES} UTF-8 bytes.`,
    })
  }
  return password
}

export function optionalHttpUrl(value: unknown, field = 'URL') {
  if (value === undefined || value === null || value === '') return null
  const raw = requireString(value, field, { min: 1, max: 2_048 })

  try {
    const parsed = new URL(raw)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error('protocol')
    return parsed.toString()
  } catch {
    throw createError({ statusCode: 400, message: `${field} must use http:// or https://.` })
  }
}

function decodedBase64Length(value: string) {
  const padding = value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0
  return Math.floor((value.length * 3) / 4) - padding
}

function validBase64(value: string) {
  return value.length % 4 === 0 && BASE64_PATTERN.test(value)
}

/**
 * Valide une enveloppe chiffrée. Le format historique `<sel>:<chiffré>`
 * (100 000 itérations) n'est accepté que pour décrire une valeur déjà en base,
 * jamais pour en écrire une nouvelle (audit F4).
 */
export function assertEncryptedPayload(payload: unknown, iv: unknown, { allowLegacy = false } = {}) {
  const encrypted = requireString(payload, 'Encrypted payload', { min: 1, max: 350_000, trim: false })
  const vector = requireString(iv, 'IV', { min: 1, max: 64 })
  const parts = encrypted.split(':')
  const legacyParts = allowLegacy && parts.length === 2 ? parts : null
  const currentParts = parts.length === 4 && parts[0] === 'v2' && parts[1] === '600000'
    ? [parts[2], parts[3]]
    : null
  const payloadParts = legacyParts || currentParts

  const [saltPart, cipherPart] = payloadParts ?? []
  if (
    !saltPart ||
    !cipherPart ||
    !validBase64(saltPart) ||
    decodedBase64Length(saltPart) !== 16 ||
    !validBase64(cipherPart) ||
    decodedBase64Length(cipherPart) < 16 ||
    !validBase64(vector) ||
    decodedBase64Length(vector) !== 12
  ) {
    throw createError({ statusCode: 400, message: 'Invalid encrypted payload.' })
  }

  return { payload: encrypted, iv: vector }
}

/**
 * Valide l'enveloppe d'un nom d'organisation chiffré côté client :
 * `n1:<sel base64>:<iv base64>:<chiffré base64>`.
 *
 * Le serveur ne peut pas vérifier le contenu, seulement la forme : un nom
 * chiffré est un identifiant opaque de 16 octets de sel, 12 octets d'IV et au
 * moins 16 octets de texte chiffré.
 */
export function assertEncryptedName(name: unknown) {
  const value = requireString(name, 'Name', { min: 1, max: 2_048, trim: false })
  const parts = value.split(':')
  if (parts.length !== 4 || parts[0] !== 'n1') {
    throw createError({ statusCode: 400, message: 'Invalid encrypted name.' })
  }
  const [, salt, iv, ciphertext] = parts
  if (
    !salt ||
    !iv ||
    !ciphertext ||
    !validBase64(salt) ||
    decodedBase64Length(salt) !== 16 ||
    !validBase64(iv) ||
    decodedBase64Length(iv) !== 12 ||
    !validBase64(ciphertext) ||
    decodedBase64Length(ciphertext) < 16
  ) {
    throw createError({ statusCode: 400, message: 'Invalid encrypted name.' })
  }
  return value
}

export function escapeLikePattern(value: string) {
  return value.replace(/[\\%_]/g, match => `\\${match}`)
}

export function safeInternalPath(value: unknown, fallback = '/dashboard') {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return fallback
  try {
    const parsed = new URL(value, 'https://qvault.local')
    return parsed.origin === 'https://qvault.local' ? `${parsed.pathname}${parsed.search}${parsed.hash}` : fallback
  } catch {
    return fallback
  }
}
