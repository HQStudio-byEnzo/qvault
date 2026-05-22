import { Resend } from 'resend'

let resendClient: Resend | null = null

/**
 * Récupère le client Resend (singleton)
 */
function getResend(): Resend {
  if (resendClient) return resendClient

  const config = useRuntimeConfig()
  resendClient = new Resend(config.resendApiKey)
  return resendClient
}

/**
 * Génère un code de vérification à 6 chiffres
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Envoie un email de vérification avec un code à 6 chiffres
 */
export async function sendVerificationEmail(email: string, name: string, code: string) {
  const resend = getResend()

  await resend.emails.send({
    from: 'Kipit <noreply@kipit.app>',
    to: email,
    subject: `${code} — Votre code de vérification Kipit`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #111; margin-bottom: 8px;">Bienvenue sur Kipit, ${name} !</h2>
        <p style="color: #666; font-size: 15px; line-height: 1.5;">
          Voici votre code de vérification :
        </p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111;">${code}</span>
        </div>
        <p style="color: #999; font-size: 13px;">
          Ce code expire dans 15 minutes. Si vous n'avez pas créé de compte, ignorez cet email.
        </p>
      </div>
    `,
  })
}
