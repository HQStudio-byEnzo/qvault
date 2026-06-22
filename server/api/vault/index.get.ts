/**
 * GET /api/vault
 * Récupère tous les éléments du coffre-fort de l'utilisateur connecté
 */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const db = useDB()
  const query = getQuery(event)

  const type = typeof query.type === 'string' ? query.type : undefined
  const search = typeof query.search === 'string' ? query.search.trim().slice(0, 200) : undefined
  const favorites = query.favorites === 'true'

  let sql = 'SELECT * FROM vault_items WHERE user_id = ?'
  const params: any[] = [session.user.id]

  if (type && ['link', 'password', 'crypto', 'recovery'].includes(type)) {
    sql += ' AND type = ?'
    params.push(type)
  }

  if (favorites) {
    sql += ' AND favorite = 1'
  }

  if (search) {
    sql += ' AND (label LIKE ? OR url LIKE ? OR type LIKE ? OR (is_encrypted = 0 AND payload LIKE ?))'
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
  }

  sql += ' ORDER BY favorite DESC, created_at DESC'

  const result = await db.execute({ sql, args: params })

  return {
    items: result.rows,
    count: result.rows.length,
  }
})
