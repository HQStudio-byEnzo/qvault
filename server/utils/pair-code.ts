import { randomInt } from 'node:crypto'

/**
 * Code d'appairage de l'extension : 10 caractères parmi 30 (sans 0/O, 1/I/L, U),
 * soit environ 49 bits. L'espace est assez grand pour qu'un attaquant qui essaie
 * des codes au hasard, sans viser personne, ne tombe sur aucun code actif.
 */
export const PAIR_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTVWXYZ23456789'
export const PAIR_CODE_LENGTH = 10
const PAIR_CODE_PATTERN = new RegExp(`^[${PAIR_CODE_ALPHABET}]{${PAIR_CODE_LENGTH}}$`)

export function generatePairCode() {
  let code = ''
  for (let i = 0; i < PAIR_CODE_LENGTH; i += 1) code += PAIR_CODE_ALPHABET[randomInt(0, PAIR_CODE_ALPHABET.length)]
  return code
}

/** Accepte la saisie « abcde-fghjk » ou avec espaces ; renvoie null si invalide. */
export function normalizePairCode(value: unknown) {
  if (typeof value !== 'string' || value.length > 32) return null
  const code = value.toUpperCase().replace(/[\s-]/g, '')
  return PAIR_CODE_PATTERN.test(code) ? code : null
}
