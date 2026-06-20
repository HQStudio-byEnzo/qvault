import { createClient } from '@libsql/client'
import type { H3Event } from 'h3'
import { ensureVaultSchema } from './vault-schema'

let dbClient: ReturnType<typeof createClient> | null = null
let dbReadyPromise: Promise<void> | null = null
let dbProxy: ReturnType<typeof createClient> | null = null

/**
 * Récupère le client Turso/LibSQL
 * Utilise un singleton pour réutiliser la connexion
 */
export function useDB(event?: H3Event) {
  if (dbProxy) return dbProxy

  const config = useRuntimeConfig()

  dbClient = createClient({
    url: String(config.tursoDbUrl),
    authToken: config.tursoDbToken ? String(config.tursoDbToken) : undefined,
  })

  if (!dbReadyPromise) {
    dbReadyPromise = ensureVaultSchema(dbClient).finally(() => {
      dbReadyPromise = null
    })
  }

  dbProxy = new Proxy(dbClient as ReturnType<typeof createClient>, {
    get(target, prop, receiver) {
      if (prop === 'execute') {
        return async (...args: any[]) => {
          if (dbReadyPromise) await dbReadyPromise
          return (target.execute as any)(...args)
        }
      }

      if (prop === 'batch') {
        return async (...args: any[]) => {
          if (dbReadyPromise) await dbReadyPromise
          return (target.batch as any)(...args)
        }
      }

      const value = Reflect.get(target, prop, receiver)
      return typeof value === 'function' ? value.bind(target) : value
    },
  }) as ReturnType<typeof createClient>

  return dbProxy
}
