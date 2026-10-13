'use server'

import { z } from 'zod'
import { Resend } from 'resend'

/**
 * "Avísame" for a product that isn't out yet.
 *
 * Same shape as the newsletter action: validate, add to the Resend audience
 * when one is configured, and notify Alexander either way. The notification is
 * what makes this useful on day one — the audience is for the launch email.
 */

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@nexxodesign.com'
const TO   = process.env.NOTIFY_EMAIL ?? process.env.RESEND_TO_EMAIL ?? 'info@nexxodesign.com'

export type NotifyState = {
  status:   'idle' | 'success' | 'error'
  message?: string
}

const notifySchema = z.object({
  email:   z.string().email('Ingresa un email válido.').max(255),
  product: z.string().min(1).max(120),
})

export async function notifyWhenAvailable(
  _prev: NotifyState,
  formData: FormData,
): Promise<NotifyState> {
  // Honeypot, like the contact form: a bot fills every field it finds.
  if ((formData.get('nx_hp') as string | null)?.trim()) {
    return { status: 'error', message: 'Solicitud inválida.' }
  }

  const parsed = notifySchema.safeParse({
    email:   formData.get('email'),
    product: formData.get('product'),
  })

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Email inválido.' }
  }

  const { email, product } = parsed.data

  // The audience is optional on purpose: the list can be created later without
  // touching this code, and a failure here must not lose the lead.
  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID
    if (audienceId) {
      await resend.contacts.create({ email, audienceId, unsubscribed: false })
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[Tienda] Resend audience:', err)
  }

  try {
    await resend.emails.send({
      from:    `Nexxo Tienda <${FROM}>`,
      to:      TO,
      replyTo: email,
      subject: `Lista de espera — ${product}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;color:#111">
          <h2 style="margin:0 0 16px;font-size:20px">Nuevo interesado</h2>
          <p style="margin:0;font-size:16px">
            <a href="mailto:${email}" style="color:#5B3DF5">${email}</a>
            quiere que le avises cuando salga <strong>${product}</strong>.
          </p>
        </div>
      `,
    })
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[Tienda] Resend email:', err)
    return { status: 'error', message: 'No se pudo registrar. Intenta de nuevo en un momento.' }
  }

  return { status: 'success' }
}
