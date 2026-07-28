export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()
  const result = await db.execute({
    sql: `SELECT type, COUNT(*) AS count FROM vault_items WHERE user_id = ? GROUP BY type`,
    args: [session.user.id],
  })
  const countsByType = Object.fromEntries(result.rows.map(row => [String((row as any).type), Number((row as any).count) || 0]))
  const favorites = await db.execute({ sql: 'SELECT COUNT(*) AS count FROM vault_items WHERE user_id = ? AND favorite = 1', args: [session.user.id] })
  const counts = {
    links: countsByType.link || 0,
    passwords: countsByType.password || 0,
    crypto: countsByType.crypto || 0,
    recovery: countsByType.recovery || 0,
    notes: countsByType.note || 0,
    totp: countsByType.totp || 0,
    favorites: Number(favorites.rows[0]?.count) || 0,
    total: 0,
  }
  counts.total = counts.links + counts.passwords + counts.crypto + counts.recovery + counts.notes + counts.totp
  return { counts }
})
