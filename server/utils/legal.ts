import type { H3Event } from 'h3'

export const LEGAL_TERMS_VERSION = '2026-06-03'

export async function getLegalAcceptance(event: H3Event, userId: string) {
  const db = useDB(event)
  const result = await db.execute({
    sql: 'SELECT terms_version, accepted_at FROM accepted_terms WHERE user_id = ?',
    args: [userId],
  })

  const row = result.rows[0] as any | undefined
  return {
    accepted: !!row && row.terms_version === LEGAL_TERMS_VERSION,
    version: row?.terms_version || null,
    acceptedAt: row?.accepted_at || null,
  }
}

export async function setLegalAcceptance(event: H3Event, userId: string) {
  const db = useDB(event)
  await db.execute({
    sql: `INSERT INTO accepted_terms (user_id, terms_version, accepted_at, user_agent, ip_address)
          VALUES (?, ?, datetime('now'), ?, ?)
          ON CONFLICT(user_id) DO UPDATE SET
            terms_version = excluded.terms_version,
            accepted_at = excluded.accepted_at,
            user_agent = excluded.user_agent,
            ip_address = excluded.ip_address`,
    args: [
      userId,
      LEGAL_TERMS_VERSION,
      getRequestHeader(event, 'user-agent') || null,
      getRequestIP(event) || null,
    ],
  })
}
