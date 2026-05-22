import { createClient } from '@libsql/client'
import type { H3Event } from 'h3'

let dbClient: ReturnType<typeof createClient> | null = null

/**
 * Récupère le client Turso/LibSQL
 * Utilise un singleton pour réutiliser la connexion
 */
export function useDB(event?: H3Event) {
  if (dbClient) return dbClient

  const config = useRuntimeConfig()

  dbClient = createClient({
    url: config.tursoDbUrl,
    authToken: config.tursoDbToken,
  })

  return dbClient
}
