export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  enforceRateLimit(event, 'master-verifier-update', 20, 60 * 60 * 1000, String(session.user.id))
  const body = requireRecord(await readBody(event))
  const encrypted = assertEncryptedPayload(body.payload, body.iv)
  const db = useDB()

  await db.execute({
    sql: `INSERT INTO master_verifiers (user_id, payload, iv, updated_at)
          VALUES (?, ?, ?, datetime('now'))
          ON CONFLICT(user_id) DO UPDATE SET
            payload = excluded.payload,
            iv = excluded.iv,
            updated_at = datetime('now')`,
    args: [session.user.id, encrypted.payload, encrypted.iv],
  })

  return { configured: true }
})
