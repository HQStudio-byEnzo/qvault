/**
 * Composable pour la gestion du coffre-fort
 * Gère les appels API et le chiffrement/déchiffrement côté client
 */
export interface VaultItem {
  id: string
  user_id: string
  type: 'link' | 'password' | 'crypto'
  label: string
  is_encrypted: boolean
  payload: string
  iv: string | null
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
    favorites: number
    total: number
  }
  limits: { passwords: number; crypto: number } | null
  isPremium: boolean
}

export function useVault() {
  const items = useState<VaultItem[]>('vault-items', () => [])
  const stats = useState<VaultStats | null>('vault-stats', () => null)
  const loading = useState('vault-loading', () => false)
  const error = useState<string | null>('vault-error', () => null)

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
    type: 'link' | 'password' | 'crypto'
    label: string
    payload: string
    shouldEncrypt: boolean
    masterPassword?: string
  }) {
    error.value = null

    let payload = data.payload
    let iv: string | undefined
    let salt: string | undefined

    // Chiffrement côté client si demandé
    if (data.shouldEncrypt && data.masterPassword) {
      const encrypted = await encrypt(data.payload, data.masterPassword)
      payload = `${encrypted.salt}:${encrypted.ciphertext}`
      iv = encrypted.iv
    }

    try {
      const response = await $fetch<{ id: string }>('/api/vault', {
        method: 'POST',
        body: {
          type: data.type,
          label: data.label,
          is_encrypted: data.shouldEncrypt,
          payload,
          iv,
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
  async function decryptItem(item: VaultItem, masterPassword: string): Promise<string> {
    if (!item.is_encrypted || !item.iv) {
      return item.payload
    }

    // Le payload est stocké sous la forme "salt:ciphertext"
    const [salt, ciphertext] = item.payload.split(':')
    
    if (!salt || !ciphertext) {
      throw new Error('Format de payload chiffré invalide.')
    }

    return decrypt(ciphertext, item.iv, masterPassword, salt)
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
  async function deleteItem(id: string) {
    try {
      await $fetch(`/api/vault/${id}`, { method: 'DELETE' })
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
    updateItem,
    toggleFavorite,
    deleteItem,
  }
}
