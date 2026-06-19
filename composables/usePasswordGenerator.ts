export interface PasswordGeneratorOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  avoidAmbiguous: boolean
}

const AMBIGUOUS = new Set(['0', 'O', 'o', '1', 'l', 'I', '|'])
const SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
}

function secureIndex(max: number) {
  const values = new Uint32Array(1)
  crypto.getRandomValues(values)
  return values[0] % max
}

export function usePasswordGenerator() {
  function charset(options: PasswordGeneratorOptions) {
    const selected = [
      options.uppercase ? SETS.uppercase : '',
      options.lowercase ? SETS.lowercase : '',
      options.numbers ? SETS.numbers : '',
      options.symbols ? SETS.symbols : '',
    ].join('')
    return options.avoidAmbiguous ? selected.split('').filter(c => !AMBIGUOUS.has(c)).join('') : selected
  }

  function generatePassword(options: PasswordGeneratorOptions) {
    const chars = charset(options)
    if (!chars) return ''
    return Array.from({ length: options.length }, () => chars[secureIndex(chars.length)]).join('')
  }

  function entropy(password: string, options: PasswordGeneratorOptions) {
    const chars = charset(options).length || 1
    return Math.round(password.length * Math.log2(chars))
  }

  return { generatePassword, entropy }
}
