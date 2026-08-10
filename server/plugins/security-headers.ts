export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response) => {
    if (response.headers) {
      delete response.headers['x-powered-by']
      delete response.headers['X-Powered-By']
    }
  })
})
