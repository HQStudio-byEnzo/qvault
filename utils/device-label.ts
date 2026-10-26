/**
 * Libellé court et lisible d'un User-Agent, pour la liste des sessions.
 * Volontairement approximatif : le but est de reconnaître son appareil, pas de
 * faire de l'empreinte. Aucune donnée n'est déduite au-delà du navigateur et du
 * système annoncés.
 */
export function deviceLabel(userAgent: unknown): string {
  const ua = typeof userAgent === 'string' ? userAgent : ''
  if (!ua) return ''

  const browser = /Edg\//.test(ua)
    ? 'Edge'
    : /OPR\/|Opera/.test(ua)
      ? 'Opera'
      : /Firefox\//.test(ua)
        ? 'Firefox'
        : /Chrome\/|CriOS\//.test(ua)
          ? 'Chrome'
          : /Safari\//.test(ua)
            ? 'Safari'
            : ''

  const system = /Windows/.test(ua)
    ? 'Windows'
    : /iPhone|iPad|iPod/.test(ua)
      ? 'iOS'
      : /Android/.test(ua)
        ? 'Android'
        : /Mac OS X|Macintosh/.test(ua)
          ? 'macOS'
          : /Linux/.test(ua)
            ? 'Linux'
            : ''

  return [browser, system].filter(Boolean).join(' · ')
}
