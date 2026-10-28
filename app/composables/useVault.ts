/**
 * Composable pour la gestion du coffre-fort
 * Gère les appels API et le chiffrement/déchiffrement côté client
 */
import { MASTER_VERIFIER_TEXT } from '~/utils/brand'
import { parseEncryptedName, serializeEncryptedName } from '~/utils/encrypted-name'
import { isLegacyEncryptedPayload } from '~/utils/payload-version'
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
  const { load: loadOrganization, upgradeLegacyNames } = useOrganization()

  const { encrypt, decrypt, serializeEncryptedPayload, parseEncryptedPayload } = useCrypto()

  /**
   * Nuxt 4 type `$fetch` contre l'union de toutes les routes Nitro. Avec une
   * quarantaine de routes, TypeScript sature (TS2321) sur chaque appel ; ce
   * raccourci conserve le typage de la réponse sans l'instanciation récursive.
   */
  const api = $fetch as unknown as <T>(url: string, options?: Record<string, unknown>) => Promise<T>

  /**
   * Update the local stats counters without a server round-trip.
   */
  function bumpStats(delta: number, type: VaultItem['type'], favorite: boolean) {
    const current = stats.value
    if (!current) return
    const counts = current.counts
    counts.total = Math.max(0, counts.total + delta)
    const key = ({ link: 'links', password: 'passwords', crypto: 'crypto', recovery: 'recovery', note: 'notes', totp: 'totp' } as const)[type]
    if (key) counts[key] = Math.max(0, counts[key] + delta)
    if (favorite) counts.favorites = Math.max(0, counts.favorites + delta)
  }

  /**
   * Récupère tous les éléments du coffre-fort
   */
  async function fetchItems(filters?: { type?: string; favorites?: boolean; search?: string }) {
    loading.value = true
    error.value = null

    try {
      // Objet `query` plutôt qu'une URL construite : la route reste un littéral,
      // ce qui évite l'instanciation de types récursive de Nitro.
      const query: Record<string, string> = {}
      if (filters?.type) query.type = filters.type
      if (filters?.favorites) query.favorites = 'true'
      if (filters?.search) query.search = filters.search

      const response = await $fetch<{ items: VaultItem[]; count: number }>('/api/vault', { query })
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
   * Ajoute un nouvel élément au coffre-fort.
   * Le contenu est toujours chiffré côté client avant l'envoi : le serveur
   * refuse tout élément non chiffré.
   */
  async function addItem(data: {
    type: 'link' | 'password' | 'crypto' | 'recovery' | 'note' | 'totp'
    label: string
    payload: string
    url?: string
    vaultId?: string
    folderId?: string | null
    tagIds?: string[]
    favorite?: boolean
  }) {
    error.value = null

    if (!masterPassword.value) {
      const message = "Déverrouillez votre mot de passe maître dans les paramètres avant d'ajouter un élément chiffré."
      error.value = message
      throw new Error(message)
    }

    const encrypted = await encrypt(data.payload, masterPassword.value)
    const payload = serializeEncryptedPayload(encrypted)
    const iv = encrypted.iv

    try {
      const response = await $fetch<{ id: string }>('/api/vault', {
        method: 'POST',
        body: {
          type: data.type,
          label: data.label,
          is_encrypted: true,
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

      // Optimistic insert keeps the UI instant; no full refetch needed.
      const now = new Date().toISOString()
      const optimistic: VaultItem = {
        id: response.id,
        user_id: '',
        type: data.type,
        vault_id: data.vaultId ?? null,
        folder_id: data.folderId ?? null,
        tags: [],
        label: data.label,
        is_encrypted: true,
        payload,
        iv: iv ?? null,
        url: data.type === 'password' ? data.url || undefined : undefined,
        favorite: !!data.favorite,
        created_at: now,
        updated_at: now,
      }
      items.value = [optimistic, ...items.value]
      bumpStats(1, data.type, !!data.favorite)

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

    if (!item.iv) throw new Error('IV manquant pour cet élément chiffré.')
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

    const historyEntries: Array<{ id: string; payload: string; iv: string | null; is_encrypted: boolean | number }> = []
    const pageSize = 1000
    for (let offset = 0; ; offset += pageSize) {
      const page = await api<{
        history: Array<{ id: string; payload: string; iv: string | null; is_encrypted: boolean | number }>
      }>(`/api/vault/history?limit=${pageSize}&offset=${offset}`)
      historyEntries.push(...page.history)
      if (page.history.length < pageSize) break
      await new Promise(resolve => setTimeout(resolve, 0))
    }

    for (const snapshot of historyEntries.filter(entry => Boolean(entry.is_encrypted))) {
      if (!snapshot.iv) throw new Error('Une ancienne version chiffrée est corrompue.')
      let envelope
      try {
        envelope = parseEncryptedPayload(snapshot.payload)
      } catch {
        throw new Error('Une ancienne version chiffrée est corrompue.')
      }
      if (!snapshot.iv) throw new Error('Une ancienne version chiffrée est corrompue.')
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

    // Les noms d'organisation chiffrés doivent suivre la même rotation, sinon
    // ils deviendraient illisibles après le changement de mot de passe.
    const organization = await loadOrganization(true, sourcePassword || '')
    // Attendre la migration des noms encore en clair évite qu'elle modifie une
    // ligne pendant la rotation.
    await upgradeLegacyNames()
    const organizationUpdates: Array<{ kind: string; id: string; previousPayload: string; payload: string }> = []
    for (const [kind, entries] of [
      ['vault', organization.vaults],
      ['folder', organization.folders],
      ['tag', organization.tags],
    ] as const) {
      for (const entry of entries) {
        if (!entry.name_encrypted || !entry.envelope) continue
        const parts = parseEncryptedName(entry.envelope)
        const plain = await decrypt(parts.ciphertext, parts.iv, sourcePassword || '', parts.salt)
        const encrypted = await encrypt(plain, newPassword)
        organizationUpdates.push({
          kind,
          id: entry.id,
          previousPayload: entry.envelope,
          payload: serializeEncryptedName({
            salt: encrypted.salt,
            iv: encrypted.iv,
            ciphertext: encrypted.ciphertext,
          }),
        })
      }
    }

    await api('/api/vault/rotate-encryption', {
      method: 'POST',
      body: {
        items: replacements,
        history: historyReplacements,
        organization: organizationUpdates,
        verifier: {
          payload: serializeEncryptedPayload(verifier),
          iv: verifier.iv,
        },
      },
    })

    setMasterPassword(newPassword)
    await fetchItems()
    await fetchStats()
    await loadOrganization(true)
  }

  /**
   * Met à jour un élément (optimiste : pas de rechargement complet)
   */
  async function updateItem(id: string, data: Partial<VaultItem>) {
    const index = items.value.findIndex(entry => entry.id === id)
    const current = index >= 0 ? items.value[index] : undefined
    const previous = current ? { ...current } : null

    if (current) {
      const next = { ...current, ...data, updated_at: new Date().toISOString() }
      items.value[index] = next
      if (previous && 'favorite' in data && stats.value) {
        const delta = (data.favorite ? 1 : 0) - (previous.favorite ? 1 : 0)
        stats.value.counts.favorites = Math.max(0, stats.value.counts.favorites + delta)
      }
    }

    try {
      await api(`/api/vault/${id}`, { method: 'PUT', body: data })
    } catch (err: any) {
      if (previous && index >= 0) items.value[index] = previous
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

    const index = items.value.findIndex(entry => entry.id === item.id)
    const removed = index >= 0 ? items.value.splice(index, 1)[0] : null
    if (removed) bumpStats(-1, removed.type, removed.favorite)

    try {
      await api(`/api/vault/${item.id}`, { method: 'DELETE' })
    } catch (err: any) {
      if (removed) {
        items.value.splice(index, 0, removed)
        bumpStats(1, removed.type, removed.favorite)
      }
      error.value = err.data?.message || 'Erreur lors de la suppression.'
      throw err
    }
  }

  /**
   * Re-chiffre les éléments encore protégés par l'ancien facteur de travail
   * (100 000 itérations) avec le facteur courant, sans changer de mot de passe.
   *
   * Appelé au déverrouillage : une fois la migration faite, l'appel suivant ne
   * trouve plus rien à mettre à jour. Plafonné pour ne jamais bloquer un
   * déverrouillage sur un très gros coffre ; le reste part à la session
   * suivante.
   */
  async function upgradeLegacyEncryption(): Promise<number> {
    const secret = masterPassword.value
    if (!secret) return 0

    await fetchItems()
    const legacy = items.value
      .filter(item => item.is_encrypted && item.iv && isLegacyEncryptedPayload(item.payload))
      .slice(0, 100)
    if (legacy.length === 0) return 0

    const upgrades = []
    for (const item of legacy) {
      const envelope = parseEncryptedPayload(item.payload)
      const plaintext = await decrypt(envelope.ciphertext, item.iv as string, secret, envelope.salt, envelope.iterations)
      const encrypted = await encrypt(plaintext, secret)
      upgrades.push({
        id: item.id,
        previousPayload: item.payload,
        payload: serializeEncryptedPayload(encrypted),
        iv: encrypted.iv,
      })
    }

    await api('/api/vault/upgrade-encryption', { method: 'POST', body: { items: upgrades } })
    await fetchItems()
    return upgrades.length
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
    upgradeLegacyEncryption,
    updateItem,
    toggleFavorite,
    deleteItem,
  }
}
