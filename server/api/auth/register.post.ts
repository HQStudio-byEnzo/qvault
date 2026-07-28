/**
 * POST /api/auth/register
 * Crée un compte strictement local sans adresse email.
 */
import { LEGAL_TERMS_VERSION } from '~/server/utils/legal'

export default defineEventHandler(async (event) => {
  enforceRateLimit(event, 'auth-register', 5, 60 * 60 * 1000)
  const body = requireRecord(await readBody(event))
  const username = normalizeUsername(body.username)
  const password = requireNewAccountPassword(body.password)
  const passwordHint = body.passwordHint === undefined
    ? null
    : requireString(body.passwordHint, 'Password hint', { min: 0, max: 200 }) || null
  if (body.acceptedTerms !== true) {
    throw createError({ statusCode: 400, message: 'Vous devez accepter les documents juridiques.' })
  }

  const db = useDB()
  const existing = await db.execute({
    sql: 'SELECT id FROM users WHERE username = ?',
    args: [username],
  })
  if (existing.rows.length > 0) {
    throw createError({ statusCode: 409, message: 'Ce username est déjà utilisé.' })
  }

  const id = crypto.randomUUID()
  const hashedPassword = await hashUserPassword(password)
  const internalLegacyEmail = `${id}@bitlock.invalid`

  try {
    await db.batch([
      {
        sql: "INSERT INTO users (id, name, username, email, password, password_hint, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))",
        args: [id, username, username, internalLegacyEmail, hashedPassword, passwordHint],
      },
      {
        sql: `INSERT INTO accepted_terms (user_id, terms_version, accepted_at, user_agent, ip_address)
              VALUES (?, ?, datetime('now'), ?, ?)`,
        args: [
          id,
          LEGAL_TERMS_VERSION,
          getRequestHeader(event, 'user-agent') || null,
          getRequestIP(event) || null,
        ],
      },
      {
        sql: "INSERT INTO vaults (id, user_id, name, color, is_default, created_at, updated_at) VALUES (?, ?, 'Principal', '#4ade80', 1, datetime('now'), datetime('now'))",
        args: [`default-${id}`, id],
      },
    ], 'write')
  } catch (error) {
    if (/unique|constraint/i.test(String((error as any)?.message || error))) {
      throw createError({ statusCode: 409, message: 'Ce username est déjà utilisé.' })
    }
    throw error
  }

  await setUserSession(event, {
    user: { id, username, sessionVersion: 0, created_at: new Date().toISOString() },
  })
  return { user: { id, username } }
})
