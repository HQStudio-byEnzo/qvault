import type { H3Event } from 'h3'

/**
 * Récupère la binding D1 depuis le contexte Cloudflare
 * En développement, utilise la base locale via miniflare
 */
export function useDB(event: H3Event) {
  // En production Cloudflare Pages
  const { DB } = (event.context.cloudflare?.env || {}) as { DB?: D1Database }
  
  if (DB) return DB

  // Fallback pour dev (via hubDatabase ou nitro database)
  throw createError({
    statusCode: 500,
    message: 'Database not available. Make sure D1 binding is configured.',
  })
}

/**
 * Interface D1Database pour TypeScript
 */
interface D1Database {
  prepare(query: string): D1PreparedStatement
  exec(query: string): Promise<D1ExecResult>
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = unknown>(colName?: string): Promise<T | null>
  all<T = unknown>(): Promise<D1Result<T>>
  run(): Promise<D1ExecResult>
  raw<T = unknown>(): Promise<T[]>
}

interface D1Result<T = unknown> {
  results: T[]
  success: boolean
  meta: Record<string, unknown>
}

interface D1ExecResult {
  count: number
  duration: number
}
