export default defineEventHandler((event) => {
  const method = getMethod(event).toUpperCase()
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return

  const fetchSite = getRequestHeader(event, 'sec-fetch-site')
  if (fetchSite === 'cross-site') {
    throw createError({ statusCode: 403, message: 'Cross-site request blocked.' })
  }

  const origin = getRequestHeader(event, 'origin')
  if (!origin) return

  const forwardedHost = getRequestHeader(event, 'x-forwarded-host')
  const host = forwardedHost || getRequestHeader(event, 'host')
  const forwardedProto = getRequestHeader(event, 'x-forwarded-proto')
  const protocol = forwardedProto || (process.env.NODE_ENV === 'production' ? 'https' : 'http')

  if (!host || origin !== `${protocol}://${host}`) {
    throw createError({ statusCode: 403, message: 'Invalid request origin.' })
  }
})
