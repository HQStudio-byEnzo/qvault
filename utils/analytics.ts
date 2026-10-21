/**
 * Routes where no third-party analytics may run or report: the vault itself
 * and the authentication screens, where a master password may be typed.
 */
const PRIVATE_ANALYTICS_PREFIXES = ['/dashboard', '/auth']

export function isPrivateAnalyticsPath(path: string) {
  return PRIVATE_ANALYTICS_PREFIXES.some(prefix => path === prefix || path.startsWith(`${prefix}/`))
}
