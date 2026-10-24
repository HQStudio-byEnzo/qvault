/**
 * Enveloppe chiffrée des noms d'organisation (coffres, dossiers, tags).
 *
 * Format : `n1:<sel base64>:<iv base64>:<chiffré base64>`
 *
 * Le nom est chiffré dans le navigateur avec la clé dérivée du mot de passe
 * maître. Le sel et l'IV voyagent dans la valeur : le serveur stocke un
 * identifiant technique, jamais le libellé. Ce module reste sans dépendance
 * pour être testable hors de Nuxt.
 */
export const ENCRYPTED_NAME_VERSION = 'n1'
export const ENCRYPTED_NAME_MAX_LENGTH = 2_048

export interface EncryptedNameParts {
  salt: string
  iv: string
  ciphertext: string
}

export function serializeEncryptedName(parts: EncryptedNameParts) {
  return `${ENCRYPTED_NAME_VERSION}:${parts.salt}:${parts.iv}:${parts.ciphertext}`
}

export function isEncryptedNameValue(value: unknown): value is string {
  return typeof value === 'string'
    && value.length <= ENCRYPTED_NAME_MAX_LENGTH
    && value.startsWith(`${ENCRYPTED_NAME_VERSION}:`)
}

export function parseEncryptedName(value: string): EncryptedNameParts {
  const parts = value.split(':')
  if (
    parts.length !== 4 ||
    parts[0] !== ENCRYPTED_NAME_VERSION ||
    !parts[1] ||
    !parts[2] ||
    !parts[3]
  ) {
    throw new Error('INVALID_ENCRYPTED_NAME')
  }
  return { salt: parts[1], iv: parts[2], ciphertext: parts[3] }
}
