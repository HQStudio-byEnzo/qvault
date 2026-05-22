import { betterAuth } from 'better-auth'
import { dash } from '@better-auth/dash'
import type { H3Event } from 'h3'

let authInstance: ReturnType<typeof betterAuth> | null = null

/**
 * Initialise et retourne l'instance BetterAuth
 * Connecté au dashboard Better Auth Infrastructure
 */
export function useAuth(event: H3Event) {
  const config = useRuntimeConfig()
  
  // Récupère la DB D1
  const { DB } = (event.context.cloudflare?.env || {}) as { DB?: any }
  
  if (!authInstance || DB) {
    authInstance = betterAuth({
      database: {
        type: 'd1',
        db: DB,
      },
      secret: config.betterAuthSecret,
      baseURL: config.betterAuthUrl,
      emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
      },
      session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 jours
        updateAge: 60 * 60 * 24, // Rafraîchir après 1 jour
      },
      trustedOrigins: [config.betterAuthUrl],
      plugins: [
        dash({
          apiKey: config.betterAuthApiKey,
        }),
      ],
    })
  }

  return authInstance
}

/**
 * Récupère la session utilisateur courante depuis un événement H3
 */
export async function getUserSession(event: H3Event) {
  const auth = useAuth(event)
  const headers = getHeaders(event)
  
  const session = await auth.api.getSession({
    headers: new Headers(headers as Record<string, string>),
  })

  return session
}

/**
 * Middleware qui vérifie l'authentification
 * Renvoie une erreur 401 si non authentifié
 */
export async function requireAuth(event: H3Event) {
  const session = await getUserSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Non autorisé. Veuillez vous connecter.',
    })
  }

  return session
}
