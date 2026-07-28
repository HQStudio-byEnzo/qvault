export default defineEventHandler(async (event) => {
  const current = await getUserSession(event)
  if (!current?.user?.id) return { user: null }
  try {
    return await requireAuth(event)
  } catch (error: any) {
    if (Number(error?.statusCode) === 401) return { user: null }
    throw error
  }
})
