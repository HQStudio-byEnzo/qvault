export default defineEventHandler(async () => {
  throw createError({
    statusCode: 410,
    message: 'Password hints are disabled.',
  })
})
