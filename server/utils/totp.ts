/**
 * TOTP (RFC 6238) côté serveur : base32, génération, vérification avec fenêtre
 * de tolérance et protection contre le rejeu.
 *
 * Module pur (aucun import Nuxt) pour rester testable par scripts/totp-self-test.mjs.
 */
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

export const TOTP_PERIOD = 30
export const TOTP_DIGITS = 6
/** Pas de temps acceptés de part et d'autre du pas courant. */
export const TOTP_WINDOW = 1
export const TOTP_SECRET_BYTES = 20

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function encodeBase32(bytes: Uint8Array): string {
  let bits = 0
  let value = 0
  let output = ''
  for (const byte of bytes) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) output += BASE32_ALPHABET[(value << (5 - bits)) & 31]
  return output
}

export function decodeBase32(input: string): Buffer {
  const clean = String(input || '').toUpperCase().replace(/=+$/, '').replace(/\s+/g, '')
  let bits = 0
  let value = 0
  const output: number[] = []
  for (const char of clean) {
    const index = BASE32_ALPHABET.indexOf(char)
    if (index < 0) throw new Error('Secret TOTP invalide (base32).')
    value = (value << 5) | index
    bits += 5
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return Buffer.from(output)
}

export function generateTotpSecret(bytes: number = TOTP_SECRET_BYTES): string {
  return encodeBase32(randomBytes(bytes))
}

export function totpCode(secret: string, step: number, digits: number = TOTP_DIGITS): string {
  const key = decodeBase32(secret)
  const counter = Buffer.alloc(8)
  counter.writeBigUInt64BE(BigInt(step))
  const digest = createHmac('sha1', key).update(counter).digest()
  const offset = digest[digest.length - 1] & 0x0f
  const binary = ((digest[offset] & 0x7f) << 24)
    | ((digest[offset + 1] & 0xff) << 16)
    | ((digest[offset + 2] & 0xff) << 8)
    | (digest[offset + 3] & 0xff)
  return String(binary % 10 ** digits).padStart(digits, '0')
}

export function currentStep(now: number = Date.now()): number {
  return Math.floor(now / 1000 / TOTP_PERIOD)
}

/** Retire espaces et tirets d'un code saisi par l'utilisateur. */
export function normalizeTotpCode(input: unknown): string {
  return String(input ?? '').replace(/[\s-]+/g, '')
}

export type TotpVerdict = { ok: boolean; step?: number; replayed?: boolean }

/**
 * Vérifie un code TOTP.
 *
 * `lastStep` correspond au dernier pas consommé par ce compte : tout code
 * antérieur ou égal est refusé (un code observé ne resservira pas).
 */
export function verifyTotp(
  secret: string,
  code: unknown,
  options: { now?: number; window?: number; lastStep?: number; digits?: number } = {},
): TotpVerdict {
  const digits = options.digits ?? TOTP_DIGITS
  const window = options.window ?? TOTP_WINDOW
  const normalized = normalizeTotpCode(code)
  if (!new RegExp(`^\\d{${digits}}$`).test(normalized)) return { ok: false }

  const step = currentStep(options.now ?? Date.now())
  const lastStep = Number(options.lastStep ?? 0)
  let matched: number | null = null

  for (let offset = -window; offset <= window; offset += 1) {
    const candidate = step + offset
    if (candidate < 0) continue
    let expected: string
    try {
      expected = totpCode(secret, candidate, digits)
    } catch {
      return { ok: false }
    }
    const a = Buffer.from(expected)
    const b = Buffer.from(normalized)
    if (a.length === b.length && timingSafeEqual(a, b) && matched === null) {
      // Continue la boucle sans court-circuiter : la comparaison reste à temps
      // constant, seul le pas retenu est mémorisé.
      matched = candidate
    }
  }

  if (matched === null) return { ok: false }
  if (lastStep > 0 && matched <= lastStep) return { ok: false, step: matched, replayed: true }
  return { ok: true, step: matched }
}

export function buildOtpAuthUrl(options: { secret: string; account: string; issuer: string }): string {
  const issuer = options.issuer
  const account = options.account
  const label = encodeURIComponent(`${issuer}:${account}`)
  const params = new URLSearchParams({
    secret: options.secret,
    issuer,
    algorithm: 'SHA1',
    digits: String(TOTP_DIGITS),
    period: String(TOTP_PERIOD),
  })
  return `otpauth://totp/${label}?${params.toString()}`
}
