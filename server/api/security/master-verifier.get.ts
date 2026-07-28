export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()

  const [verifier, probe] = await Promise.all([
    db.execute({
      sql: 'SELECT payload, iv, updated_at FROM master_verifiers WHERE user_id = ?',
      args: [session.user.id],
    }),
    db.execute({
      sql: `SELECT payload, iv
            FROM vault_items
            WHERE user_id = ? AND is_encrypted = 1 AND iv IS NOT NULL
            ORDER BY created_at ASC
            LIMIT 1`,
      args: [session.user.id],
    }),
  ])

  return {
    configured: verifier.rows.length > 0,
    verifier: verifier.rows[0] || null,
    probe: probe.rows[0] || null,
  }
})
