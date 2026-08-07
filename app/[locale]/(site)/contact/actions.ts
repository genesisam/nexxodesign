'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM  = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
const TO    = process.env.RESEND_TO_EMAIL   ?? 'info@nexxodesign.com'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<'name' | 'email' | 'mensaje', string>>
}

export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // ── Honeypot anti-spam ────────────────────────────────────────────────────
  if ((formData.get('website') as string | null)?.trim()) {
    return { status: 'error', message: 'Solicitud inválida.' }
  }

  // ── Extract fields ────────────────────────────────────────────────────────
  const name           = (formData.get('name')         as string ?? '').trim()
  const email          = (formData.get('email')         as string ?? '').trim()
  const empresa        = (formData.get('empresa')       as string ?? '').trim()
  const tipoProyecto   = (formData.get('tipoProyecto')  as string ?? '').trim()
  const presupuesto    = (formData.get('presupuesto')   as string ?? '').trim()
  const mensaje        = (formData.get('mensaje')       as string ?? '').trim()
  const estimateRaw    = (formData.get('estimateSummary') as string | null) ?? ''
  const estimate       = estimateRaw
    ? (() => { try { return JSON.parse(estimateRaw) } catch { return null } })()
    : null

  // ── Validation ────────────────────────────────────────────────────────────
  const fieldErrors: ContactState['fieldErrors'] = {}
  if (!name)  fieldErrors.name   = 'El nombre es requerido.'
  if (!email) fieldErrors.email  = 'El email es requerido.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fieldErrors.email = 'Ingresa un email válido.'
  if (!mensaje) fieldErrors.mensaje = 'El mensaje es requerido.'

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Por favor corrige los campos marcados.', fieldErrors }
  }

  // ── Send email via Resend ─────────────────────────────────────────────────
  const { error } = await resend.emails.send({
    from:    `Nexxo Contact <${FROM}>`,
    to:      TO,
    replyTo: email,
    subject: `Nuevo contacto — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;color:#111">
        <h2 style="margin:0 0 24px;font-size:22px">Nuevo mensaje de contacto</h2>

        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:140px">Nombre</td>
              <td style="padding:8px 0;font-weight:600">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td>
              <td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
          ${empresa      ? `<tr><td style="padding:8px 0;color:#666">Empresa</td><td style="padding:8px 0">${empresa}</td></tr>` : ''}
          ${tipoProyecto ? `<tr><td style="padding:8px 0;color:#666">Tipo proyecto</td><td style="padding:8px 0">${tipoProyecto}</td></tr>` : ''}
          ${presupuesto  ? `<tr><td style="padding:8px 0;color:#666">Presupuesto</td><td style="padding:8px 0">${presupuesto}</td></tr>` : ''}
          ${estimate     ? `<tr><td style="padding:8px 0;color:#666">Estimado</td><td style="padding:8px 0">${estimate.formatted} — ${estimate.projectType}</td></tr>` : ''}
        </table>

        <div style="margin:24px 0;padding:16px;background:#f5f5f5;border-left:3px solid #5B3DF5">
          <p style="margin:0;white-space:pre-wrap">${mensaje.replace(/</g, '&lt;')}</p>
        </div>

        <p style="color:#999;font-size:12px">
          Responde a este email para contactar a ${name} directamente.
        </p>
      </div>
    `,
  })

  if (error) {
    return { status: 'error', message: 'Error al enviar. Intenta de nuevo o escríbenos por WhatsApp.' }
  }

  return { status: 'success' }
}
