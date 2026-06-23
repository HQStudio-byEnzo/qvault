export interface PasswordEntry {
  password: string
  username?: string
  email?: string
  phone?: string
}

function cleanOptional(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

export function serializePasswordEntry(entry: PasswordEntry) {
  return JSON.stringify({
    password: entry.password,
    username: cleanOptional(entry.username),
    email: cleanOptional(entry.email),
    phone: cleanOptional(entry.phone),
  })
}

export function parsePasswordEntry(payload: string): PasswordEntry {
  try {
    const parsed = JSON.parse(payload)
    if (parsed && typeof parsed === 'object' && typeof parsed.password === 'string') {
      return {
        password: parsed.password,
        username: cleanOptional(parsed.username),
        email: cleanOptional(parsed.email),
        phone: cleanOptional(parsed.phone),
      }
    }
  } catch {
    // Older password items are stored as a plain string.
  }

  return { password: payload }
}
