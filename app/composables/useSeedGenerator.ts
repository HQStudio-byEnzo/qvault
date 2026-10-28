import { generateMnemonic, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'

const STRENGTH_BY_WORD_COUNT: Record<number, 128 | 160 | 192 | 224 | 256> = {
  12: 128,
  15: 160,
  18: 192,
  21: 224,
  24: 256,
}

/**
 * Generates standards-compliant English BIP-39 mnemonics locally.
 * Entropy comes from the browser's cryptographically secure random source.
 */
export function useSeedGenerator() {
  function generateSeedPhrase(wordCount = 12) {
    const strength = STRENGTH_BY_WORD_COUNT[wordCount]
    if (!strength) throw new Error('BIP-39 supports 12, 15, 18, 21, or 24 words.')
    return generateMnemonic(wordlist, strength)
  }

  function isValidSeedPhrase(mnemonic: string) {
    return validateMnemonic(mnemonic.trim(), wordlist)
  }

  return {
    generateSeedPhrase,
    isValidSeedPhrase,
  }
}
