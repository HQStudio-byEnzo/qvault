/**
 * POST /api/legal/accept
 * Enregistre l'acceptation des documents legaux pour la version courante
 */
import { LEGAL_TERMS_VERSION, setLegalAcceptance } from '~/server/utils/legal'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  await setLegalAcceptance(event, session.user.id)

  return {
    accepted: true,
    termsVersion: LEGAL_TERMS_VERSION,
  }
})
