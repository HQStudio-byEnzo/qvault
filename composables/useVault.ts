/**
 * Composable pour la gestion du coffre-fort
 * Gère les appels API et le chiffrement/déchiffrement côté client
 */
import { MASTER_VERIFIER_TEXT } from '~/composables/useMasterPassword'
import { MIN_MASTER_PASSWORD_LENGTH } from '~/utils/security-policy'

export interface VaultItem {
  id: string
  user_id: string
  type: 'link' | 'password' | 'crypto' | 'recovery' | 'note' | 'totp'
  vault_id?: string | null
  folder_id?: string | null
  tags?: VaultTag[]
  label: string
  is_encrypted: boolean
  payload: string
  iv: string | null
  url?: string
  favorite: boolean
  created_at: string
  updated_at?: string
  // Champs calculés côté client
  _decryptedPayload?: string
  _salt?: string
}

export interface VaultTag {
  id: string
  name: string
  color: string
}

export interface VaultStats {
  counts: {
    links: number
    passwords: number
    crypto: number
      recovery: number
      notes: number
      totp: number
    favorites: number
    total: number
  }
}

export function useVault() {
  const items = useState<VaultItem[]>('vault-items', () => [])
  const stats = useState<VaultStats | null>('vault-stats', () => null)
  const loading = useState('vault-loading', () => false)
  const error = useState<string | null>('vault-error', () => null)
  const { masterPassword, setMasterPassword } = useMasterPassword()

  const { encrypt, decrypt, serializeEncryptedPayload, parseEncryptedPayload } = useCrypto()

  /**
   * Récupère tous les éléments du coffre-fort
   */
  async function fetchItems(filters?: { type?: string; favorites?: boolean; search?: string }) {
    loading.value = true
    error.value = null

    try {
      const query = new URLSearchParams()
      if (filters?.type) query.set('type', filters.type)
      if (filters?.favorites) query.set('favorites', 'true')
      if (filters?.search) query.set('search', filters.search)

      const response = await $fetch<{ items: VaultItem[]; count: number }>(
        `/api/vault?${query.toString()}`
      )
      items.value = response.items
    } catch (err: any) {
      error.value = err.data?.message || 'Erreur lors du chargement.'
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupère les statistiques
   */
  async function fetchStats() {
    try {
      stats.value = await $fetch<VaultStats>('/api/vault/stats')
    } catch (err: any) {
      console.error('Erreur stats:', err)
    }
  }

  /**
   * Ajoute un nouvel élément au coffre-fort
   * Si shouldEncrypt=true, le chiffrement est effectué côté client avant envoi
   */
  async function addItem(data: {
    type: 'link' | 'password' | 'crypto' | 'recovery' | 'note' | 'totp'
    label: string
    payload: string
    shouldEncrypt: boolean
    url?: string
    vaultId?: string
    folderId?: string | null
    tagIds?: string[]
    favorite?: boolean
  }, options: { refresh?: boolean } = {}) {
    error.value = null

    let payload = data.payload
    let iv: string | undefined
    const shouldEncrypt = true

    // Chiffrement côté client si demandé
    if (shouldEncrypt) {
      if (!masterPassword.value) {
        const message = "Déverrouillez votre mot de passe maître dans les paramètres avant d'ajouter un élément chiffré."
        error.value = message
        throw new Error(message)
      }
      const encrypted = await encrypt(data.payload, masterPassword.value)
      payload = serializeEncryptedPayload(encrypted)
      iv = encrypted.iv
    }

    try {
      const response = await $fetch<{ id: string }>('/api/vault', {
        method: 'POST',
        body: {
          type: data.type,
          label: data.label,
          is_encrypted: shouldEncrypt,
          payload,
          iv,
          url: data.type === 'password'
            ? data.url || undefined
            : undefined,
          vault_id: data.vaultId,
          folder_id: data.folderId,
          tag_ids: data.tagIds,
          favorite: data.favorite,
        },
      })

      if (options.refresh !== false) {
        await fetchItems()
        await fetchStats()
      }

      return response
    } catch (err: any) {
      error.value = err.data?.message || 'Erreur lors de l\'ajout.'
      throw err
    }
  }

  /**
   * Déchiffre un élément côté client
   */
  async function decryptItem(item: VaultItem, providedPassword: string = ''): Promise<string> {
    if (!item.is_encrypted || !item.iv) {
      return item.payload
    }

    const secret = providedPassword || masterPassword.value
    if (!secret) {
      throw new Error('Déverrouillez votre mot de passe maître pour déchiffrer cet élément.')
    }

    let envelope
    try {
      envelope = parseEncryptedPayload(item.payload)
    } catch {
      throw new Error('Format de payload chiffré invalide.')
    }

    return decrypt(envelope.ciphertext, item.iv, secret, envelope.salt, envelope.iterations)
  }

  /**
   * Ré-encrypte tous les éléments chiffrés avec un nouveau mot de passe maître
   */
  async function reencryptVault(currentPassword: string | null, newPassword: string) {
    if (newPassword.length < MIN_MASTER_PASSWORD_LENGTH) {
      throw new Error(`Le nouveau mot de passe maître doit contenir au moins ${MIN_MASTER_PASSWORD_LENGTH} caractères.`)
    }
    await fetchItems()

    const encryptedItems = items.value.filter(item => item.is_encrypted)

    if (encryptedItems.length > 0 && !currentPassword && !masterPassword.value) {
      throw new Error('Le mot de passe maître actuel est requis pour mettre à jour le coffre.')
    }

    const sourcePassword = currentPassword || masterPassword.value
    if (encryptedItems.length > 0 && !sourcePassword) {
      throw new Error('Le mot de passe maître actuel est requis pour mettre à jour le coffre.')
    }

    // Prepare every replacement before writing anything. A wrong current password
    // therefore cannot modify only part of the vault.
    const replacements = []
    const historyReplacements: Array<{
      id: string
      previousPayload: string
      previousIv: string
      payload: string
      iv: string
    }> = []
    for (const item of encryptedItems) {
      const plain = await decryptItem(item, sourcePassword || '')
      const encrypted = await encrypt(plain, newPassword)

      replacements.push({
        id: item.id,
        previousPayload: item.payload,
        previousIv: item.iv,
        payload: serializeEncryptedPayload(encrypted),
        iv: encrypted.iv,
      })

    }

    const history = await $fetch<{ history: Array<{ id: string; payload: string; iv: string | null; is_encrypted: boolean | number }> }>(
      '/api/vault/history',
    )
    for (const snapshot of history.history.filter(entry => Boolean(entry.is_encrypted))) {
      if (!snapshot.iv) throw new Error('Une ancienne version chiffrée est corrompue.')
      let envelope
      try {
        envelope = parseEncryptedPayload(snapshot.payload)
      } catch {
        throw new Error('Une ancienne version chiffrée est corrompue.')
      }
      const historyPlain = await decrypt(
        envelope.ciphertext,
        snapshot.iv,
        sourcePassword || '',
        envelope.salt,
        envelope.iterations,
      )
      const historyEncrypted = await encrypt(historyPlain, newPassword)
      historyReplacements.push({
        id: snapshot.id,
        previousPayload: snapshot.payload,
        previousIv: snapshot.iv,
        payload: serializeEncryptedPayload(historyEncrypted),
        iv: historyEncrypted.iv,
      })
    }

    const verifier = await encrypt(MASTER_VERIFIER_TEXT, newPassword)

    await $fetch('/api/vault/rotate-encryption', {
      method: 'POST',
      body: {
        items: replacements,
        history: historyReplacements,
        verifier: {
          payload: serializeEncryptedPayload(verifier),
          iv: verifier.iv,
        },
      },
    })

    setMasterPassword(newPassword)
    await fetchItems()
    await fetchStats()
  }

  /**
   * Met à jour un élément
   */
  async function updateItem(id: string, data: Partial<VaultItem>) {
    try {
      await $fetch(`/api/vault/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchItems()
      await fetchStats()
    } catch (err: any) {
      error.value = err.data?.message || 'Erreur lors de la mise à jour.'
      throw err
    }
  }

  /**
   * Toggle le favori
   */
  async function toggleFavorite(item: VaultItem) {
    await updateItem(item.id, { favorite: !item.favorite } as any)
  }

  /**
   * Supprime un élément
   */
  async function deleteItem(item: VaultItem, providedPassword: string = '') {
    try {
      if (item.is_encrypted) {
        const secret = providedPassword || masterPassword.value
        if (!secret) {
          throw new Error('Le mot de passe maître est requis pour supprimer cet élément.')
        }

        try {
          await decryptItem(item, secret)
        } catch {
          throw new Error('Le mot de passe maître est incorrect ou le secret est corrompu.')
        }
      }

      await $fetch(`/api/vault/${item.id}`, { method: 'DELETE' })
      await fetchItems()
      await fetchStats()
    } catch (err: any) {
      error.value = err.data?.message || 'Erreur lors de la suppression.'
      throw err
    }
  }

  return {
    items,
    stats,
    loading,
    error,
    fetchItems,
    fetchStats,
    addItem,
    decryptItem,
    reencryptVault,
    updateItem,
    toggleFavorite,
    deleteItem,
  }
}
