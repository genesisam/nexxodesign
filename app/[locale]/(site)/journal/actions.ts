'use server'

import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
const TO   = process.env.RESEND_TO_EMAIL   ?? 'info@nexxodesign.com'

export type NewsletterState = {
  status:   'idle' | 'success' | 'error'
  message?: string
}

const newsletterSchema = z.object({
  email: z.string().email('Ingresa un email válido.').max(255),
})

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse({ email: formData.get('email') })

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Email inválido.' }
  }

  const { email } = parsed.data

  // ── Agregar a la lista en Resend Audiences ───────────────────────────────
  // Usa RESEND_AUDIENCE_ID del env, o busca el primer audience automáticamente
  let audienceId = process.env.RESEND_AUDIENCE_ID
  if (!audienceId) {
    const { data: audiences } = await resend.audiences.list()
    audienceId = audiences?.data?.[0]?.id
  }
  if (audienceId) {
    await resend.contacts.create({ email, audienceId, unsubscribed: false })
  }

  // ── Notificación al admin por cada nuevo suscriptor ───────────────────────
  const { error } = await resend.emails.send({
    from:    `Nexxo Newsletter <${FROM}>`,
    to:      TO,
    subject: `Nuevo suscriptor al newsletter — ${email}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;color:#111">
        <h2 style="margin:0 0 16px;font-size:20px">Nuevo suscriptor</h2>
        <p style="margin:0;font-size:16px">
          <a href="mailto:${email}" style="color:#5B3DF5">${email}</a>
          se suscribió al newsletter de Nexxo.
        </p>
        <p style="margin:16px 0 0;color:#999;font-size:12px">
          Cuando configures tu lista en Resend Audiences, agrega el Audience ID
          a tu .env.local como RESEND_AUDIENCE_ID para gestionar suscriptores automáticamente.
        </p>
      </div>
    `,
  })

  if (error) {
    // No falla silenciosamente — pero no bloqueamos al usuario por esto
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Newsletter] Resend error:', error)
    }
  }

  return { status: 'success' }
}
