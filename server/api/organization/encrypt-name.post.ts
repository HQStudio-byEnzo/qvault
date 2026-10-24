/**
 * POST /api/organization/encrypt-name
 *
 * Remplace un nom d'organisation encore en clair par son équivalent chiffré.
 * Le client envoie l'ancien nom : le serveur vérifie qu'il correspond toujours
 * à la valeur stockée avant d'écrire, pour ne jamais écraser une modification
 * faite depuis un autre onglet.
 */
const TABLES = {
  vault: 'vaults',
  folder: 'folders',
  tag: 'tags',
} as const

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  await enforceRateLimit(event, 'organization-encrypt-name', 300, 60 * 60 * 1000, String(session.user.id))
  const db = useDB()
  const body = requireRecord(await readBody(event))

  const kind = body.kind
  if (typeof kind !== 'string' || !Object.hasOwn(TABLES, kind)) {
    throw createError({ statusCode: 400, message: 'Type d’organisation invalide.' })
  }
  const table = TABLES[kind as keyof typeof TABLES]
  const id = requireString(body.id, 'Id', { min: 1, max: 128 })
  const previousName = requireString(body.previous_name, 'Previous name', { min: 1, max: 80 })
  const name = assertEncryptedName(body.name)

  const result = await db.execute({
    sql: `UPDATE ${table} SET name = ?, name_encrypted = 1 WHERE id = ? AND user_id = ? AND name = ? AND name_encrypted = 0`,
    args: [name, id, session.user.id, previousName],
  })

  if (result.rowsAffected !== 1) {
    throw createError({ statusCode: 409, message: 'Le nom a changé. Rechargez la page avant de réessayer.' })
  }

  return { message: 'Nom chiffré.' }
})
