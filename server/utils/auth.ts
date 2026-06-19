import { compare, hash } from 'bcryptjs'
import type { H3Event } from 'h3'

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

/**
 * Middleware qui vérifie l'authentification via la session
 * Renvoie une erreur 401 si non authentifié
 */
export async function requireAuth(event: H3Event) {
  const session = await getUserSession(event)

  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Non autorisé. Veuillez vous connecter.',
    })
  }

  return session as typeof session & { user: NonNullable<typeof session.user> }
}
