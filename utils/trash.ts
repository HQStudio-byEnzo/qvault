/**
 * Corbeille : un élément supprimé reste restaurable pendant 30 jours avant
 * d'être purgé. La constante est partagée par l'API et l'interface pour que
 * l'affichage et la purge ne divergent jamais.
 */
export const TRASH_RETENTION_DAYS = 30

/** Date à laquelle un élément de la corbeille sera supprimé définitivement. */
export function trashExpiresAt(deletedAt: string): Date | null {
  const date = new Date(`${deletedAt.replace(' ', 'T')}Z`)
  if (Number.isNaN(date.getTime())) return null
  return new Date(date.getTime() + TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000)
}
