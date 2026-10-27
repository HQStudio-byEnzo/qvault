/**
 * GET /api/health
 * Sonde de disponibilité pour la supervision externe : base joignable, sans
 * détail interne ni donnée utilisateur. Ne crée pas de session, ne touche pas
 * au schéma.
 */
export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  setHeader(event, 'Content-Type', 'application/json; charset=utf-8')

  const started = Date.now()
  try {
    const db = useDB(event)
    await db.execute('SELECT 1')
  } catch {
    setResponseStatus(event, 503)
    return { ok: false, db: 'down' }
  }

  return {
    ok: true,
    db: 'up',
    commit: String(process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7) || null,
    latencyMs: Date.now() - started,
  }
})
