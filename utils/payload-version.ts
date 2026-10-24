/**
 * Distingue les charges chiffrées encore dérivées avec l'ancien facteur de
 * travail (format `<sel>:<chiffré>`, 100 000 itérations PBKDF2) des charges
 * courantes (`v2:600000:<sel>:<chiffré>`). Sert au re-chiffrement automatique
 * au déverrouillage, sans dépendre de Nuxt.
 */
export function isLegacyEncryptedPayload(payload: unknown): payload is string {
  return typeof payload === 'string' && payload.split(':').length === 2
}
