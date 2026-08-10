import { createHash } from 'node:crypto'
import type { H3Event } from 'h3'

function clientAddress(event: H3Event) {
  return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
}

export async function enforceRateLimit(
  event: H3Event,
  scope: string,
  limit: number,
  windowMs: number,
  discriminator = '',
) {
  const now = Date.now()
  const resetAt = now + windowMs
  const keyHash = createHash('sha256')
    .update(`${scope}:${clientAddress(event)}:${discriminator}`)
    .digest('hex')
  const db = useDB(event)
  const result = await db.execute({
    sql: `INSERT INTO rate_limits (key_hash, count, reset_at)
          VALUES (?, 1, ?)
          ON CONFLICT(key_hash) DO UPDATE SET
            count = CASE
              WHEN rate_limits.reset_at <= ? THEN 1
              ELSE rate_limits.count + 1
            END,
            reset_at = CASE
              WHEN rate_limits.reset_at <= ? THEN excluded.reset_at
              ELSE rate_limits.reset_at
            END
          RETURNING count, reset_at`,
    args: [keyHash, resetAt, now, now],
  })
  const current = result.rows[0]
  const count = Number(current?.count || 0)
  const currentResetAt = Number(current?.reset_at || resetAt)

  if (count > limit) {
    const retryAfter = Math.max(1, Math.ceil((currentResetAt - now) / 1000))
    setResponseHeader(event, 'Retry-After', retryAfter)
    throw createError({
      statusCode: 429,
      message: 'Too many requests. Please try again later.',
    })
  }

  // Opportunistic cleanup keeps the shared table bounded without a cron job.
  if (count === 1 && Math.random() < 0.02) {
    await db.execute({
      sql: 'DELETE FROM rate_limits WHERE reset_at <= ?',
      args: [now],
    }).catch(() => {})
  }
}
