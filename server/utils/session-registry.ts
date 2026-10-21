import { createHash, randomBytes } from 'node:crypto'
import type { H3Event } from 'h3'

/**
 * Registre serveur des sessions (audit F10). Le cookie scellé seul ne peut pas
 * être révoqué : une copie volée restait valable après la déconnexion. Chaque
 * session porte désormais un identifiant aléatoire (`secure.sid`, jamais envoyé
 * au navigateur) dont seul le SHA-256 est en base ; se déconnecter le supprime.
 */
export const SESSION_TTL_DAYS = 30

export function hashSessionId(sid: string) {
  return createHash('sha256').update(sid).digest('hex')
}

/** Ouvre une session neuve pour `user` et la remplace dans le cookie. */
export async function openUserSession(event: H3Event, user: Record<string, unknown> & { id: string }) {
  const db = useDB(event)
  const sid = randomBytes(32).toString('base64url')
  await db.batch([
    { sql: "DELETE FROM user_sessions WHERE expires_at <= datetime('now')", args: [] },
    {
      sql: `INSERT INTO user_sessions (id_hash, user_id, created_at, expires_at)
            VALUES (?, ?, datetime('now'), datetime('now', ?))`,
      args: [hashSessionId(sid), user.id, `+${SESSION_TTL_DAYS} days`],
    },
  ], 'write')
  await replaceUserSession(event, { user, secure: { sid } } as any)
}

/** Vrai si le cookie correspond à une session encore ouverte pour cet utilisateur. */
export async function isSessionOpen(event: H3Event, userId: string, sid: unknown) {
  if (typeof sid !== 'string' || !sid) return false
  const result = await useDB(event).execute({
    sql: "SELECT 1 FROM user_sessions WHERE id_hash = ? AND user_id = ? AND expires_at > datetime('now')",
    args: [hashSessionId(sid), userId],
  })
  return result.rows.length > 0
}

export async function closeUserSession(event: H3Event) {
  const session = await getUserSession(event)
  const sid = (session as any)?.secure?.sid
  if (typeof sid === 'string' && sid) {
    await useDB(event).execute({ sql: 'DELETE FROM user_sessions WHERE id_hash = ?', args: [hashSessionId(sid)] })
  }
  await clearUserSession(event)
}

/** Ferme toutes les sessions de l'utilisateur sauf, si fournie, la session courante. */
export async function closeOtherSessions(event: H3Event, userId: string, keepSid?: unknown) {
  const keep = typeof keepSid === 'string' && keepSid ? hashSessionId(keepSid) : ''
  await useDB(event).execute({
    sql: 'DELETE FROM user_sessions WHERE user_id = ? AND id_hash <> ?',
    args: [userId, keep],
  })
}
