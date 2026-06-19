/**
 * Composable pour la gestion du coffre-fort
 * Gère les appels API et le chiffrement/déchiffrement côté client
 */
export interface VaultItem {
  id: string
  user_id: string
  type: 'link' | 'password' | 'crypto' | 'recovery' | 'recovery'
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

export interface VaultStats {
  counts: {
    links: number
    passwords: number
    crypto: number
    recovery: number
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

  const { encrypt, decrypt } = useCrypto()

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
    type: 'link' | 'password' | 'crypto' | 'recovery' | 'recovery'
    label: string
    payload: string
    shouldEncrypt: boolean
    url?: string
  }) {
    error.value = null

    let payload = data.payload
    let iv: string | undefined
    const shouldEncrypt = data.type === 'link' ? data.shouldEncrypt : true

    // Chiffrement côté client si demandé
    if (shouldEncrypt) {
      if (!masterPassword.value) {
        const message = "Déverrouillez votre mot de passe maître dans les paramètres avant d'ajouter un élément chiffré."
        error.value = message
        throw new Error(message)
      }
      const encrypted = await encrypt(data.payload, masterPassword.value)
      payload = `${encrypted.salt}:${encrypted.ciphertext}`
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
          url: data.type === 'link' && !shouldEncrypt ? data.url || undefined : undefined,
        },
      })

      // Rafraîchir la liste
      await fetchItems()
      await fetchStats()

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

    // Le payload est stocké sous la forme "salt:ciphertext"
    const [salt, ciphertext] = item.payload.split(':')
    
    if (!salt || !ciphertext) {
      throw new Error('Format de payload chiffré invalide.')
    }

    return decrypt(ciphertext, item.iv, secret, salt)
  }

  /**
   * Ré-encrypte tous les éléments chiffrés avec un nouveau mot de passe maître
   */
  async function reencryptVault(currentPassword: string | null, newPassword: string) {
    if (items.value.length === 0) {
      await fetchItems()
    }

    const encryptedItems = items.value.filter(item => item.is_encrypted)

    if (encryptedItems.length > 0 && !currentPassword && !masterPassword.value) {
      throw new Error('Le mot de passe maître actuel est requis pour mettre à jour le coffre.')
    }

    const sourcePassword = currentPassword || masterPassword.value
    if (encryptedItems.length > 0 && !sourcePassword) {
      throw new Error('Le mot de passe maître actuel est requis pour mettre à jour le coffre.')
    }

    for (const item of encryptedItems) {
      const plain = await decryptItem(item, sourcePassword || '')
      const encrypted = await encrypt(plain, newPassword)

      await $fetch(`/api/vault/${item.id}`, {
        method: 'PUT',
        body: {
          payload: `${encrypted.salt}:${encrypted.ciphertext}`,
          iv: encrypted.iv,
          is_encrypted: true,
        },
      })
    }

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

        await decryptItem(item, secret)
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
