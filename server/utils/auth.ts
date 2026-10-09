import { compare, hash } from 'bcryptjs'
import type { H3Event } from 'h3'
import { needsEmailCompletion } from './email-verification'

/**
 * Hash un mot de passe avec bcrypt
 */
export async function hashUserPassword(password: string): Promise<string> {
  return hash(password, 12)
}

/**
 * Vérifie un mot de passe contre son hash
 */
export async function verifyUserPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

type RawSession = NonNullable<Awaited<ReturnType<typeof getUserSession>>>
/** Session validée : `user` est toujours défini sur ce type. */
type ValidSession = RawSession & { user: NonNullable<RawSession['user']> }

type LoadedSession = {
  session: ValidSession
  email: unknown
  emailVerified: unknown
}

function emailStateOf(row: unknown) {
  const record = (row ?? {}) as Record<string, unknown>
  return { email: record.email, emailVerified: record.email_verified }
}

/**
 * Charge la session, vérifie qu'elle correspond encore à un compte existant, et
 * récupère l'état de l'adresse e-mail en une seule lecture de base.
 */
async function loadSession(event: H3Event): Promise<LoadedSession> {
  const raw = await getUserSession(event)

  if (!raw?.user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Non autorisé. Veuillez vous connecter.',
    })
  }

  const db = useDB(event)
  const result = await db.execute({
    sql: 'SELECT username, session_version, email, email_verified FROM users WHERE id = ?',
    args: [raw.user.id],
  })
  const currentVersion = Number(result.rows[0]?.session_version ?? -1)
  const sessionVersion = Number(raw.user.sessionVersion ?? 0)

  if (result.rows.length === 0 || currentVersion !== sessionVersion) {
    await clearUserSession(event)
    throw createError({ statusCode: 401, message: 'Session expired. Please sign in again.' })
  }

  const username = String(result.rows[0]?.username || '')
  if (username && raw.user.username !== username) {
    const hydrated = {
      ...raw,
      user: {
        id: raw.user.id,
        username,
        sessionVersion,
        created_at: raw.user.created_at,
        // Preserved on purpose: dropping it would lift the email gate.
        needsEmail: raw.user.needsEmail,
      },
    }
    await setUserSession(event, hydrated)
    return { session: hydrated as ValidSession, ...emailStateOf(result.rows[0]) }
  }

  return {
    session: raw as ValidSession,
    ...emailStateOf(result.rows[0]),
  }
}

/**
 * Session valide, rien de plus. Réservé à l'étape e-mail, à la lecture de la
 * session et à la suppression de compte, qui doivent rester accessibles tant que
 * le compte n'est pas pleinement actif.
 */
export async function requireSession(event: H3Event) {
  const loaded = await loadSession(event)
  return loaded.session
}

/**
 * Garde applicative : session valide **et** adresse e-mail confirmée.
 *
 * Le contrôle vit ici, sur la seule brique que traversent toutes les routes
 * protégées, et relit la base à chaque appel. Il ne dépend donc pas du drapeau
 * `needsEmail` de la session, qui n'a qu'un rôle d'affichage, ni du middleware
 * de route, qui s'exécute côté client et n'est pas une frontière de sécurité.
 */
export async function requireAuth(event: H3Event) {
  const loaded = await loadSession(event)

  if (needsEmailCompletion(loaded.email, loaded.emailVerified)) {
    throw createError({
      statusCode: 403,
      message: 'Confirmez votre adresse e-mail pour activer votre compte.',
    })
  }

  return loaded.session
}
