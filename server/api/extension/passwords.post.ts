export default defineEventHandler(async (event) => {
  const { db, userId } = await requireExtensionAuth(event, 'passwords-write', 60)
  const body = requireRecord(await readBody(event))
  const label = requireString(body.label, 'Label', { min: 1, max: 200 })
  const encrypted = assertEncryptedPayload(body.payload, body.iv)
  const url = optionalHttpUrl(body.url)
  const id = crypto.randomUUID()

  await db.execute({
    sql: `INSERT INTO vault_items
      (id, user_id, vault_id, folder_id, type, label, is_encrypted, payload, iv, url, favorite, created_at, updated_at)
      VALUES (?, ?, ?, NULL, 'password', ?, 1, ?, ?, ?, 0, datetime('now'), datetime('now'))`,
    args: [
      id,
      userId,
      `default-${userId}`,
      label,
      encrypted.payload,
      encrypted.iv,
      url,
    ],
  })

  setHeader(event, 'Cache-Control', 'no-store')
  return { id, message: 'Identifiant ajouté.' }
})
