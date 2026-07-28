import { createHash, randomBytes } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  enforceRateLimit(event, 'extension-token-create', 10, 60 * 60 * 1000, String(session.user.id))
  const db = useDB()
  const token = `blx_${randomBytes(32).toString('base64url')}`
  const tokenHash = createHash('sha256').update(token).digest('hex')

  await db.execute({
    sql: "INSERT INTO extension_tokens (user_id, token_hash, created_at, last_used_at) VALUES (?, ?, datetime('now'), NULL) ON CONFLICT(user_id) DO UPDATE SET token_hash = excluded.token_hash, created_at = excluded.created_at, last_used_at = NULL",
    args: [session.user.id, tokenHash],
  })
  setHeader(event, 'Cache-Control', 'no-store')
  return { token }
})
