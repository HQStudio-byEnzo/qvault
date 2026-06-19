/**
 * POST /api/auth/register
 * Inscription par email/mot de passe
 */
import { LEGAL_TERMS_VERSION } from '~/server/utils/legal'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password, hint, acceptedTerms } = body

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, message: 'Nom, email et mot de passe requis.' })
  }

  if (!acceptedTerms) {
    throw createError({ statusCode: 400, message: "Vous devez accepter les CGU, la politique de confidentialité et les mentions légales." })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  }

  const db = useDB()

  // Vérifier si l'email existe déjà
  const existing = await db.execute({
    sql: 'SELECT id FROM users WHERE email = ?',
    args: [email.toLowerCase()],
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
      args: [id, name, email.toLowerCase(), hashedPassword, hint || null],
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
    user: { id, name, email: email.toLowerCase(), created_at: new Date().toISOString() },
  })

  return { user: { id, name, email: email.toLowerCase() } }
})
