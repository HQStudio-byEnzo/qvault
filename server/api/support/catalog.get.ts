export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  return {
    entries: getSupportCatalog(event),
    privacy: {
      tracking: false,
      vaultAccess: false,
    },
  }
})
