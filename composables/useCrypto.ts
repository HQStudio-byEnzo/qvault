/**
 * Composable de chiffrement Zero-Knowledge
 * Tout le chiffrement se fait EXCLUSIVEMENT côté client (navigateur)
 * Le serveur ne reçoit et ne stocke que du texte chiffré illisible
 * 
 * Algorithmes utilisés :
 * - Dérivation de clé : PBKDF2 avec SHA-256 (100 000 itérations)
 * - Chiffrement : AES-256-GCM (authentifié)
 */
export function useCrypto() {
  /**
   * Dérive une clé AES-256 à partir d'un mot de passe maître et d'un sel
   * Utilise PBKDF2 avec 100 000 itérations de SHA-256
   */
  async function deriveKey(masterPassword: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    
    // Importer le mot de passe comme clé brute
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(masterPassword),
      'PBKDF2',
      false,
      ['deriveKey']
    )

    // Dériver la clé AES-256
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      {
        name: 'AES-GCM',
        length: 256,
      },
      false,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * Génère un sel aléatoire (16 bytes)
   */
  function generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(16))
  }

  /**
   * Génère un IV (Initialization Vector) aléatoire (12 bytes pour AES-GCM)
   */
  function generateIV(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(12))
  }

  /**
   * Chiffre un texte en clair avec AES-256-GCM
   * @returns Objet contenant le texte chiffré (base64) et l'IV (base64)
   */
  async function encrypt(
    plaintext: string,
    masterPassword: string,
    salt?: Uint8Array
  ): Promise<{ ciphertext: string; iv: string; salt: string }> {
    const encoder = new TextEncoder()
    const usedSalt = salt || generateSalt()
    const iv = generateIV()
    
    const key = await deriveKey(masterPassword, usedSalt)

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(plaintext)
    )

    return {
      ciphertext: arrayBufferToBase64(encrypted),
      iv: arrayBufferToBase64(iv),
      salt: arrayBufferToBase64(usedSalt),
    }
  }

  /**
   * Déchiffre un texte chiffré avec AES-256-GCM
   * @returns Le texte en clair
   */
  async function decrypt(
    ciphertext: string,
    iv: string,
    masterPassword: string,
    salt: string
  ): Promise<string> {
    const decoder = new TextDecoder()
    
    const key = await deriveKey(masterPassword, base64ToArrayBuffer(salt))

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: base64ToArrayBuffer(iv) },
      key,
      base64ToArrayBuffer(ciphertext)
    )

    return decoder.decode(decrypted)
  }

  /**
   * Convertit un ArrayBuffer en string Base64
   */
  function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  /**
   * Convertit une string Base64 en Uint8Array
   */
  function base64ToArrayBuffer(base64: string): Uint8Array {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes
  }

  return {
    encrypt,
    decrypt,
    generateSalt,
    generateIV,
    deriveKey,
    arrayBufferToBase64,
    base64ToArrayBuffer,
  }
}
