function decodeBase32(value: string) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const clean = value.toUpperCase().replace(/[^A-Z2-7]/g, '')
  let bits = ''
  for (const char of clean) {
    const index = alphabet.indexOf(char)
    if (index < 0) throw new Error('Clé TOTP invalide')
    bits += index.toString(2).padStart(5, '0')
  }
  const bytes: number[] = []
  for (let index = 0; index + 8 <= bits.length; index += 8) bytes.push(parseInt(bits.slice(index, index + 8), 2))
  return new Uint8Array(bytes)
}

export function useTotp() {
  function parseSecret(input: string) {
    const clean = input.trim()
    if (!clean.toLowerCase().startsWith('otpauth://')) return { secret: clean, digits: 6, period: 30, algorithm: 'SHA-1' as const }
    const uri = new URL(clean)
    if (uri.protocol !== 'otpauth:' || uri.hostname.toLowerCase() !== 'totp') throw new Error('URI TOTP invalide')
    const digits = Number(uri.searchParams.get('digits') || 6)
    const period = Number(uri.searchParams.get('period') || 30)
    const algorithmValue = (uri.searchParams.get('algorithm') || 'SHA1').toUpperCase().replace('-', '')
    const algorithms = { SHA1: 'SHA-1', SHA256: 'SHA-256', SHA512: 'SHA-512' } as const
    if (![6, 8].includes(digits) || !Number.isInteger(period) || period < 15 || period > 120 || !(algorithmValue in algorithms)) {
      throw new Error('Paramètres TOTP invalides')
    }
    return {
      secret: uri.searchParams.get('secret') || '',
      digits,
      period,
      algorithm: algorithms[algorithmValue as keyof typeof algorithms],
    }
  }

  async function generateTotp(input: string, timestamp = Date.now()) {
    const config = parseSecret(input)
    if (!config.secret) throw new Error('Clé TOTP manquante')
    const counter = Math.floor(timestamp / 1000 / config.period)
    const message = new ArrayBuffer(8)
    const view = new DataView(message)
    view.setUint32(4, counter, false)
    const decodedSecret = decodeBase32(config.secret)
    if (decodedSecret.length < 10) throw new Error('Clé TOTP trop courte')
    const key = await crypto.subtle.importKey('raw', decodedSecret, { name: 'HMAC', hash: config.algorithm }, false, ['sign'])
    const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, message))
    const offset = signature[signature.length - 1]! & 0x0f
    const binary = ((signature[offset]! & 0x7f) << 24) | ((signature[offset + 1]! & 0xff) << 16) | ((signature[offset + 2]! & 0xff) << 8) | (signature[offset + 3]! & 0xff)
    const code = (binary % (10 ** config.digits)).toString().padStart(config.digits, '0')
    return { code, remaining: config.period - (Math.floor(timestamp / 1000) % config.period), period: config.period }
  }

  return { generateTotp, parseSecret }
}
