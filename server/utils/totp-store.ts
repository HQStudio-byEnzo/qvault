/**
 * Stockage et manipulation du second facteur TOTP.
 *
 * Le secret est chiffré au repos (AES-256-GCM) avec une clé dérivée du secret
 * serveur : un dump de la base ne permet pas de fabriquer des codes. Les codes
 * de secours ne sont stockés que hachés (SHA-256), à usage unique.
 */
import { createCipheriv, createDecipheriv, createHash, hkdfSync, randomBytes } from 'node:crypto'
import type { H3Event } from 'h3'

export const TWO_FACTOR_COOKIE = 'qvault_2fa'
export const CHALLENGE_TTL_SECONDS = 5 * 60
export const RECOVERY_CODE_COUNT = 10

const ENVELOPE_PREFIX = 't1'
let cachedKey: Buffer | null = null

/**
 * Clé de chiffrement des secrets TOTP.
 *
 * `NUXT_TOTP_KEY` (32 octets ou plus, base64 ou brut) est prioritaire ; à
 * défaut la clé est dérivée de `NUXT_SESSION_PASSWORD` par HKDF. Changer la
 * source rend les secrets existants illisibles : c'est volontaire, mais cela
 * doit être documenté et annoncé aux utilisateurs.
 */
function totpKey(): Buffer {
  if (cachedKey) return cachedKey
  const explicit = String(process.env.NUXT_TOTP_KEY || '').trim()
  if (explicit) {
    const raw = /^[A-Za-z0-9+/]{43}=?$/.test(explicit) ? Buffer.from(explicit, 'base64') : Buffer.from(explicit, 'utf8')
    if (raw.length < 32) {
      throw createError({ statusCode: 500, message: 'NUXT_TOTP_KEY doit contenir au moins 32 octets.' })
    }
    cachedKey = Buffer.from(raw.subarray(0, 32))
    return cachedKey
  }
  const password = String((useRuntimeConfig() as any)?.session?.password || '')
  if (password.length < 16) {
    throw createError({
      statusCode: 503,
      message: 'Double authentification indisponible : NUXT_SESSION_PASSWORD manquant.',
    })
  }
  cachedKey = Buffer.from(hkdfSync('sha256', Buffer.from(password), Buffer.from('qvault-totp'), Buffer.from('qvault-totp-secret-v1'), 32))
  return cachedKey
}

export function encryptTotpSecret(secret: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', totpKey(), iv)
  const ciphertext = Buffer.concat([cipher.update(String(secret), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [ENVELOPE_PREFIX, iv.toString('base64url'), tag.toString('base64url'), ciphertext.toString('base64url')].join(':')
}

export function decryptTotpSecret(envelope: string): string {
  const parts = String(envelope || '').split(':')
  if (parts.length !== 4 || parts[0] !== ENVELOPE_PREFIX) {
    throw createError({ statusCode: 500, message: 'Secret TOTP stocké dans un format inconnu.' })
  }
  try {
    const decipher = createDecipheriv('aes-256-gcm', totpKey(), Buffer.from(parts[1], 'base64url'))
    decipher.setAuthTag(Buffer.from(parts[2], 'base64url'))
    return Buffer.concat([decipher.update(Buffer.from(parts[3], 'base64url')), decipher.final()]).toString('utf8')
  } catch {
    throw createError({
      statusCode: 503,
      message: 'Double authentification illisible : la clé serveur a changé. Contactez le support.',
    })
  }
}

export type TotpRecord = {
  secret: string
  enabled: boolean
  lastStep: number
  enabledAt: string | null
}

export async function getTotpRecord(event: H3Event, userId: string): Promise<TotpRecord | null> {
  const result = await useDB(event).execute({
    sql: 'SELECT secret, enabled, last_step, enabled_at FROM user_totp WHERE user_id = ?',
    args: [userId],
  })
  const row = result.rows[0] as any
  if (!row) return null
  return {
    secret: String(row.secret),
    enabled: Number(row.enabled) === 1,
    lastStep: Number(row.last_step) || 0,
    enabledAt: row.enabled_at ? String(row.enabled_at) : null,
  }
}

/** Enregistre un secret en attente : il ne protège rien tant qu'il n'est pas confirmé. */
export async function storePendingTotpSecret(event: H3Event, userId: string, secret: string) {
  await useDB(event).execute({
    sql: `INSERT INTO user_totp (user_id, secret, enabled, last_step, created_at, enabled_at)
          VALUES (?, ?, 0, 0, datetime('now'), NULL)
          ON CONFLICT(user_id) DO UPDATE SET
            secret = excluded.secret,
            enabled = 0,
            last_step = 0,
            created_at = datetime('now'),
            enabled_at = NULL`,
    args: [userId, encryptTotpSecret(secret)],
  })
}

/** Active le second facteur et consomme le pas de temps qui vient de servir. */
export async function activateTotp(event: H3Event, userId: string, lastStep: number) {
  await useDB(event).execute({
    sql: "UPDATE user_totp SET enabled = 1, enabled_at = datetime('now'), last_step = ? WHERE user_id = ?",
    args: [lastStep, userId],
  })
}

export async function disableTotp(event: H3Event, userId: string) {
  await useDB(event).batch([
    { sql: 'DELETE FROM user_totp WHERE user_id = ?', args: [userId] },
    { sql: 'DELETE FROM user_recovery_codes WHERE user_id = ?', args: [userId] },
    { sql: 'DELETE FROM login_challenges WHERE user_id = ?', args: [userId] },
  ], 'write')
}

// --- Codes de secours ----------------------------------------------------

const RECOVERY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function recoveryCode(): string {
  const bytes = randomBytes(10)
  let out = ''
  for (const byte of bytes) out += RECOVERY_ALPHABET[byte % RECOVERY_ALPHABET.length]
  return `${out.slice(0, 5)}-${out.slice(5)}`
}

export function hashRecoveryCode(code: string): string {
  return createHash('sha256').update(String(code || '').toUpperCase().replace(/[\s-]+/g, '')).digest('hex')
}

export function generateRecoveryCodes(count: number = RECOVERY_CODE_COUNT): string[] {
  const codes = new Set<string>()
  while (codes.size < count) codes.add(recoveryCode())
  return [...codes]
}

export async function storeRecoveryCodes(event: H3Event, userId: string, codes: string[]) {
  const db = useDB(event)
  await db.execute({ sql: 'DELETE FROM user_recovery_codes WHERE user_id = ?', args: [userId] })
  await db.batch(
    codes.map(code => ({
      sql: 'INSERT INTO user_recovery_codes (user_id, code_hash, created_at) VALUES (?, ?, datetime(\'now\'))',
      args: [userId, hashRecoveryCode(code)],
    })),
    'write',
  )
}

/** Consomme un code de secours. Retourne true s'il était valide et encore vierge. */
export async function consumeRecoveryCode(event: H3Event, userId: string, code: unknown): Promise<boolean> {
  const normalized = String(code ?? '').trim()
  if (!normalized) return false
  const result = await useDB(event).execute({
    sql: "UPDATE user_recovery_codes SET used_at = datetime('now') WHERE user_id = ? AND code_hash = ? AND used_at IS NULL",
    args: [userId, hashRecoveryCode(normalized)],
  })
  return result.rowsAffected === 1
}

export async function countUnusedRecoveryCodes(event: H3Event, userId: string): Promise<number> {
  const result = await useDB(event).execute({
    sql: 'SELECT COUNT(*) AS total FROM user_recovery_codes WHERE user_id = ? AND used_at IS NULL',
    args: [userId],
  })
  return Number((result.rows[0] as any)?.total || 0)
}

// --- Défis de connexion --------------------------------------------------

function hashChallenge(id: string) {
  return createHash('sha256').update(id).digest('hex')
}

/** Crée un défi court entre mot de passe validé et code TOTP attendu. */
export async function createLoginChallenge(event: H3Event, userId: string) {
  const id = randomBytes(32).toString('base64url')
  await useDB(event).execute({
    sql: `INSERT INTO login_challenges (id_hash, user_id, created_at, expires_at)
          VALUES (?, ?, datetime('now'), datetime('now', ?))`,
    args: [hashChallenge(id), userId, `+${CHALLENGE_TTL_SECONDS} seconds`],
  })
  return { id, expiresIn: CHALLENGE_TTL_SECONDS }
}

export async function readLoginChallenge(event: H3Event, id: unknown) {
  if (typeof id !== 'string' || !id) return null
  const result = await useDB(event).execute({
    sql: `SELECT id_hash, user_id, attempts FROM login_challenges
          WHERE id_hash = ? AND expires_at > datetime('now')`,
    args: [hashChallenge(id)],
  })
  const row = result.rows[0] as any
  if (!row) return null
  return { idHash: String(row.id_hash), userId: String(row.user_id), attempts: Number(row.attempts) || 0 }
}

export async function registerChallengeFailure(event: H3Event, idHash: string) {
  const result = await useDB(event).execute({
    sql: 'UPDATE login_challenges SET attempts = attempts + 1 WHERE id_hash = ? RETURNING attempts',
    args: [idHash],
  })
  return Number((result.rows[0] as any)?.attempts || 0)
}

export async function dropLoginChallenge(event: H3Event, idHash: string) {
  await useDB(event).execute({ sql: 'DELETE FROM login_challenges WHERE id_hash = ?', args: [idHash] })
}

export async function purgeExpiredChallenges(event: H3Event) {
  await useDB(event).execute({ sql: "DELETE FROM login_challenges WHERE expires_at <= datetime('now')" }).catch(() => {})
}
