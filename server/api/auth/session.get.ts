export default defineEventHandler(async (event) => {
  const current = await getUserSession(event)
  if (!current?.user?.id) return { user: null }
  try {
    // `secure` (identifiant de session) reste côté serveur.
    const { secure: _secure, ...session } = await requireSession(event) as Record<string, unknown>
    return session
  } catch (error: any) {
    if (Number(error?.statusCode) === 401) return { user: null }
    throw error
  }
})
