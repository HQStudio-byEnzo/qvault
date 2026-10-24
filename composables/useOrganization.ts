/**
 * Organisation du coffre : coffres, dossiers et tags.
 *
 * Les noms sont chiffrés dans le navigateur avec le mot de passe maître. La
 * base ne contient que des enveloppes opaques (`n1:<sel>:<iv>:<chiffré>`) et un
 * drapeau `name_encrypted`. Les lignes créées avant ce changement restent en
 * clair et sont re-chiffrées silencieusement au premier déverrouillage.
 */
import { parseEncryptedName, serializeEncryptedName } from '~/utils/encrypted-name'

export type OrganizationKind = 'vault' | 'folder' | 'tag'

export interface OrganizationEntry {
  id: string
  name: string
  name_encrypted: boolean
  // Enveloppe telle que stockée, conservée pour la rotation du mot de passe.
  envelope?: string
  color?: string
  vault_id?: string
  parent_id?: string | null
  is_default?: boolean
}

export interface OrganizationState {
  vaults: OrganizationEntry[]
  folders: OrganizationEntry[]
  tags: OrganizationEntry[]
}

interface RawEntry {
  id: string
  name: string
  name_encrypted?: boolean | number
  color?: string
  vault_id?: string
  parent_id?: string | null
  is_default?: boolean | number
}

let upgradePromise: Promise<void> | null = null

export function useOrganization() {
  const state = useState<OrganizationState>('qvault-organization', () => ({ vaults: [], folders: [], tags: [] }))
  const loaded = useState('qvault-organization-loaded', () => false)
  const { masterPassword } = useMasterPassword()
  const { encrypt, decrypt } = useCrypto()

  function toEntry(row: RawEntry): OrganizationEntry {
    return {
      id: String(row.id),
      name: String(row.name || ''),
      name_encrypted: Boolean(row.name_encrypted),
      envelope: row.name_encrypted ? String(row.name) : undefined,
      color: row.color,
      vault_id: row.vault_id,
      parent_id: row.parent_id ?? null,
      is_default: Boolean(row.is_default),
    }
  }

  async function decryptEntry(row: RawEntry, secret = masterPassword.value): Promise<OrganizationEntry> {
    const entry = toEntry(row)
    if (!entry.name_encrypted) return entry
    if (!secret) {
      entry.name = ''
      return entry
    }
    try {
      const parts = parseEncryptedName(entry.name)
      entry.name = await decrypt(parts.ciphertext, parts.iv, secret, parts.salt)
    } catch {
      // Enveloppe corrompue ou mot de passe maître différent : on n'affiche
      // jamais une valeur partielle.
      entry.name = ''
    }
    return entry
  }

  async function load(force = false, secret = masterPassword.value) {
    if (import.meta.server) return state.value
    if (loaded.value && !force) return state.value

    const raw = await $fetch<{ vaults: RawEntry[]; folders: RawEntry[]; tags: RawEntry[] }>('/api/organization')
    const [vaults, folders, tags] = await Promise.all([
      Promise.all(raw.vaults.map(entry => decryptEntry(entry, secret))),
      Promise.all(raw.folders.map(entry => decryptEntry(entry, secret))),
      Promise.all(raw.tags.map(entry => decryptEntry(entry, secret))),
    ])
    state.value = { vaults, folders, tags }
    // L'ordre alphabétique ne peut plus être fait en SQL sur des noms chiffrés.
    folders.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    tags.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    loaded.value = true

    if (masterPassword.value) void upgradeLegacyNames()
    return state.value
  }

  async function encryptName(name: string) {
    const secret = masterPassword.value
    if (!secret) throw new Error('MASTER_PASSWORD_REQUIRED')
    const envelope = await encrypt(name, secret)
    return serializeEncryptedName({
      salt: envelope.salt,
      iv: envelope.iv,
      ciphertext: envelope.ciphertext,
    })
  }

  async function create(
    kind: OrganizationKind,
    name: string,
    options: { color?: string; vaultId?: string; parentId?: string | null } = {},
  ) {
    const trimmed = name.trim()
    if (!trimmed || trimmed.length > 80) throw new Error('INVALID_NAME')
    const encrypted = await encryptName(trimmed)
    const response = await $fetch<{ id: string }>('/api/organization', {
      method: 'POST',
      body: {
        kind,
        name: encrypted,
        name_encrypted: true,
        color: options.color,
        vault_id: options.vaultId,
        parent_id: options.parentId ?? null,
      },
    })
    loaded.value = false
    return response.id
  }

  async function remove(kind: OrganizationKind, id: string) {
    await $fetch('/api/organization/remove', { method: 'POST', body: { kind, id } })
    loaded.value = false
  }

  /**
   * Chiffre les noms hérités encore en clair. Un échec isolé laisse la ligne
   * telle quelle : elle sera retentée au prochain chargement.
   */
  async function upgradeLegacyNames() {
    if (upgradePromise) return upgradePromise
    if (!masterPassword.value) return
    upgradePromise = (async () => {
      const groups: Array<{ kind: OrganizationKind; entries: OrganizationEntry[] }> = [
        { kind: 'vault', entries: state.value.vaults },
        { kind: 'folder', entries: state.value.folders },
        { kind: 'tag', entries: state.value.tags },
      ]
      for (const group of groups) {
        for (const entry of group.entries) {
          if (entry.name_encrypted || !entry.name) continue
          try {
            const name = await encryptName(entry.name)
            await $fetch('/api/organization/encrypt-name', {
              method: 'POST',
              body: { kind: group.kind, id: entry.id, previous_name: entry.name, name },
            })
            entry.name_encrypted = true
            entry.envelope = name
          } catch {
            // Conflit ou hors ligne : la valeur reste lisible, rien n'est perdu.
          }
        }
      }
    })().finally(() => { upgradePromise = null })
    return upgradePromise
  }

  return { organization: state, loaded, load, create, remove, upgradeLegacyNames }
}
