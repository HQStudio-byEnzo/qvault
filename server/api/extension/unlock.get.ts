export default defineEventHandler(async (event) => {
  const { db, userId } = await requireExtensionAuth(event, 'unlock', 30)

  const [verifier, probe] = await Promise.all([
    db.execute({
      sql: 'SELECT payload, iv FROM master_verifiers WHERE user_id = ?',
      args: [userId],
    }),
    db.execute({
      sql: `SELECT payload, iv
            FROM vault_items
            WHERE user_id = ? AND type = 'password' AND is_encrypted = 1 AND iv IS NOT NULL
            ORDER BY created_at ASC
            LIMIT 1`,
      args: [userId],
    }),
  ])

  setHeader(event, 'Cache-Control', 'no-store')
  return {
    configured: verifier.rows.length > 0,
    verifier: verifier.rows[0] || null,
    probe: probe.rows[0] || null,
  }
})
