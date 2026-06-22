/**
 * POST /api/auth/register
 * Inscription par email/mot de passe
 */
import { LEGAL_TERMS_VERSION } from '~/server/utils/legal'

export default defineEventHandler(async (event) => {
  enforceRateLimit(event, 'auth-register', 5, 60 * 60 * 1000)
  const body = requireRecord(await readBody(event))
  const name = requireString(body.name, 'Name', { min: 1, max: 80 })
  const email = normalizeEmail(body.email)
  const password = requireString(body.password, 'Password', { min: 8, max: 128, trim: false })
  const acceptedTerms = body.acceptedTerms === true

  if (!acceptedTerms) {
    throw createError({ statusCode: 400, message: "Vous devez accepter les CGU, la politique de confidentialité et les mentions légales." })
  }

  const db = useDB()

  // Vérifier si l'email existe déjà
  const existing = await db.execute({
    sql: 'SELECT id FROM users WHERE email = ?',
    args: [email],
  })

  if (existing.rows.length > 0) {
    throw createError({ statusCode: 409, message: 'Un compte existe déjà avec cet email.' })
  }

  // Créer l'utilisateur et enregistrer son acceptation dans une transaction.
  const id = crypto.randomUUID()
  const hashedPassword = await hashUserPassword(password)

  await db.batch([
    {
      sql: "INSERT INTO users (id, name, email, password, password_hint, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))",
      args: [id, name, email, hashedPassword, null],
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
  ], 'write')

  // Créer la session.
  await setUserSession(event, {
    user: { id, name, email, sessionVersion: 0, created_at: new Date().toISOString() },
  })

  return { user: { id, name, email } }
})
