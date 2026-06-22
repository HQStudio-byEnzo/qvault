const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/

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

export function normalizeEmail(value: unknown) {
  const email = requireString(value, 'Email', { min: 3, max: 254 }).toLowerCase()
  if (!EMAIL_PATTERN.test(email)) {
    throw createError({ statusCode: 400, message: 'Invalid email address.' })
  }
  return email
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

export function assertEncryptedPayload(payload: unknown, iv: unknown) {
  const encrypted = requireString(payload, 'Encrypted payload', { min: 1, max: 350_000, trim: false })
  const vector = requireString(iv, 'IV', { min: 1, max: 64 })
  const parts = encrypted.split(':')

  if (
    parts.length !== 2 ||
    !validBase64(parts[0]) ||
    decodedBase64Length(parts[0]) !== 16 ||
    !validBase64(parts[1]) ||
    decodedBase64Length(parts[1]) < 16 ||
    !validBase64(vector) ||
    decodedBase64Length(vector) !== 12
  ) {
    throw createError({ statusCode: 400, message: 'Invalid encrypted payload.' })
  }

  return { payload: encrypted, iv: vector }
}

export function safeInternalPath(value: unknown, fallback = '/dashboard') {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return fallback
  try {
    const parsed = new URL(value, 'https://bitlock.local')
    return parsed.origin === 'https://bitlock.local' ? `${parsed.pathname}${parsed.search}${parsed.hash}` : fallback
  } catch {
    return fallback
  }
}
