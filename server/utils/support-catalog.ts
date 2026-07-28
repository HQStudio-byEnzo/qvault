import type { H3Event } from 'h3'

export type SupportEntry = {
  id: string
  kind: 'sponsor' | 'affiliate'
  title: string
  description: string
  url: string
  disclosure: string
}

function safeText(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function safePartnerUrl(value: unknown) {
  if (typeof value !== 'string' || value.length > 2_048) return null
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'https:') return null
    parsed.username = ''
    parsed.password = ''
    return parsed.toString()
  } catch {
    return null
  }
}

export function getSupportCatalog(event?: H3Event): SupportEntry[] {
  const config = useRuntimeConfig(event)
  let input: unknown
  try {
    input = JSON.parse(String(config.supportCatalogJson || '[]'))
  } catch {
    return []
  }

  if (!Array.isArray(input)) return []

  return input.slice(0, 12).flatMap((candidate): SupportEntry[] => {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return []
    const record = candidate as Record<string, unknown>
    const id = safeText(record.id, 48)
    const kind = record.kind === 'sponsor' || record.kind === 'affiliate'
      ? record.kind
      : null
    const title = safeText(record.title, 80)
    const description = safeText(record.description, 240)
    const disclosure = safeText(record.disclosure, 160)
    const url = safePartnerUrl(record.url)

    if (!/^[a-z0-9][a-z0-9_-]{1,47}$/i.test(id) || !kind || !title || !description || !url) {
      return []
    }

    return [{
      id,
      kind,
      title,
      description,
      url,
      disclosure: disclosure || (kind === 'affiliate' ? 'Lien affilié' : 'Contenu sponsorisé'),
    }]
  })
}
