'use client'

import { useActionState, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  CONTACT_WHATSAPP,
  CONTACT_CALENDLY,
  SOCIAL_INSTAGRAM,
  SOCIAL_BEHANCE,
  SOCIAL_LINKEDIN,
} from '@/lib/constants'
import { submitContact, type ContactState } from './actions'
import type { EstimateValue } from '@/components/contact/ProjectEstimator'

// ─── Shared style helpers ─────────────────────────────────────────────────────

const labelCls =
  'block font-mono text-[9px] uppercase tracking-[0.22em] text-paper/45 mb-2.5'

const inputCls = (hasError?: boolean) =>
  [
    'w-full bg-transparent border-b py-3 font-sans text-paper text-[15px] leading-relaxed',
    'placeholder:text-paper/25 outline-none transition-colors duration-200',
    'focus:border-accent',
    hasError ? 'border-red-500' : 'border-paper/20',
  ].join(' ')

const errorCls = 'mt-1.5 font-mono text-[9px] text-red-500 tracking-[0.1em]'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// ─── Contact channels ─────────────────────────────────────────────────────────

export function ContactChannels() {
  const t   = useTranslations('contact.channels')
  const waUrl = `${CONTACT_WHATSAPP}?text=${encodeURIComponent(t('waMessage'))}`

  return (
    <div className="flex flex-col gap-10">

      {/* WhatsApp */}
      <div>
        <p className={labelCls}>WhatsApp</p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between w-full border border-paper/20 text-paper px-6 py-5 hover:bg-accent hover:border-accent transition-colors duration-300"
        >
          <div>
            <span className="block font-display font-semibold text-[1.3rem] leading-tight tracking-[-0.025em]">
              {t('waTitle')}
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-paper/45 mt-1.5 group-hover:text-paper/70 transition-colors duration-200">
              {t('waSubtitle')}
            </span>
          </div>
          <span className="ml-4 shrink-0 text-paper/60 group-hover:text-paper transition-colors duration-200">
            <IconWhatsApp />
          </span>
        </a>
      </div>

      {/* Calendly */}
      <div>
        <p className={labelCls}>{t('callLabel')}</p>
        <a
          href={CONTACT_CALENDLY}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] border border-paper/30 text-paper px-6 py-4 hover:bg-paper hover:text-ink hover:border-paper transition-colors duration-300"
        >
          {t('callBtn')}
        </a>
      </div>

      {/* Email */}
      <div>
        <p className={labelCls}>{t('emailLabel')}</p>
        <a
          href="mailto:info@nexxodesign.com"
          className="font-sans text-paper text-[15px] underline underline-offset-2 decoration-paper/25 hover:decoration-accent hover:text-accent transition-colors duration-200"
        >
          info@nexxodesign.com
        </a>
      </div>

      <div className="border-t border-paper/10" />

      {/* Meta info */}
      <div className="grid grid-cols-2 gap-y-7">
        <div>
          <p className={labelCls}>{t('ubicacionLabel')}</p>
          <p className="font-sans text-paper/60 text-[13px] leading-relaxed">
            {t('ubicacionLine1')}<br />{t('ubicacionLine2')}
          </p>
        </div>
        <div>
          <p className={labelCls}>{t('respuestaLabel')}</p>
          <p className="font-sans text-paper/60 text-[13px] leading-relaxed">
            {t('respuestaText')}
          </p>
        </div>
      </div>

      {/* Social links */}
      <div>
        <p className={labelCls}>{t('siguenos')}</p>
        <div className="flex items-center gap-6 flex-wrap">
          {[
            { label: 'Instagram', href: SOCIAL_INSTAGRAM },
            { label: 'Behance',   href: SOCIAL_BEHANCE   },
            { label: 'LinkedIn',  href: SOCIAL_LINKEDIN  },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/40 hover:text-paper transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── Success message ──────────────────────────────────────────────────────────

function SuccessMessage({ onReset }: { onReset: () => void }) {
  const t = useTranslations('contact.form')
  return (
    <div className="flex flex-col gap-6 py-6" role="status" aria-live="polite">
      <div
        className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center"
        aria-hidden="true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <p className="font-display font-semibold text-paper text-[1.6rem] leading-tight tracking-[-0.02em] mb-2">
          {t('recibido')}
        </p>
        <p className="font-sans text-paper/55 text-[15px] leading-relaxed max-w-[38ch]">
          {t('recibidoDesc')}
        </p>
      </div>
      <button
        onClick={onReset}
        className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper/35 hover:text-paper transition-colors duration-200 self-start"
      >
        {t('otroMensaje')}
      </button>
    </div>
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────────

const INITIAL_STATE: ContactState = { status: 'idle' }

export function ContactForm({ estimateSummary }: { estimateSummary?: EstimateValue | null }) {
  const t = useTranslations('contact.form')

  const projectTypes = [
    { value: '',              label: t('projectTypes.selecciona') },
    { value: 'Producto',      label: t('projectTypes.producto') },
    { value: 'Web & landing', label: t('projectTypes.web') },
    { value: 'Identidad',     label: t('projectTypes.identidad') },
    { value: 'IA aplicada',   label: t('projectTypes.ia') },
    { value: 'Otro',          label: t('projectTypes.otro') },
  ]

  const budgets = [
    { value: '',       label: t('budgets.selecciona') },
    { value: '<$5k',   label: t('budgets.menos5k') },
    { value: '$5–15k', label: t('budgets.5a15k') },
    { value: '$15k+',  label: t('budgets.mas15k') },
    { value: 'No sé',  label: t('budgets.nose') },
  ]

  const [state, formAction, isPending] = useActionState(submitContact, INITIAL_STATE)
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<'name' | 'email' | 'mensaje', string>>
  >({})
  const [showSuccess, setShowSuccess] = useState(false)

  const fieldErrors = { ...state.fieldErrors, ...clientErrors }

  if (state.status === 'success' && !showSuccess) {
    setShowSuccess(true)
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const fd   = new FormData(e.currentTarget)
    const errs: typeof clientErrors = {}

    const name    = (fd.get('name')    as string ?? '').trim()
    const email   = (fd.get('email')   as string ?? '').trim()
    const mensaje = (fd.get('mensaje') as string ?? '').trim()

    if (!name)    errs.name    = t('requerido')
    if (!email)   errs.email   = t('requerido')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                  errs.email   = t('emailInvalido')
    if (!mensaje) errs.mensaje = t('requerido')

    if (Object.keys(errs).length > 0) {
      e.preventDefault()
      setClientErrors(errs)
      return
    }
    setClientErrors({})
  }

  if (showSuccess) {
    return <SuccessMessage onReset={() => setShowSuccess(false)} />
  }

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate>

      {/* Honeypot. The name must NOT look like a real profile field: Chrome
          ignores autoComplete="off" for recognised names (`website` among them)
          and autofills it, which made genuine submissions fail the bot check.
          The data-* attributes keep 1Password and LastPass out of it too. */}
      <input
        type="text"
        name="nx_hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
        data-lpignore="true"
        data-1p-ignore=""
      />

      {/* Estimate summary card */}
      {estimateSummary && (
        <div className="mb-8 border border-accent/25 bg-accent/4 px-5 py-4 flex flex-col gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
            {t('estimadoLabel')}
          </p>
          <div className="flex items-baseline gap-3">
            <span className="font-display font-semibold text-paper text-[1.6rem] leading-none tracking-[-0.03em]">
              {estimateSummary.formatted}
            </span>
            <span className="font-mono text-[9px] text-paper/40 tracking-[0.1em]">{t('desdUSD')}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {[
              [t('labelProyecto'), estimateSummary.projectType],
              [t('labelPaginas'),  `${estimateSummary.pages}`],
              [t('labelDiseno'),   estimateSummary.quality],
              [t('labelRediseno'), estimateSummary.isRedesign ? t('si') : t('no')],
              ...(estimateSummary.addons.length > 0
                ? [[t('labelAddons'), estimateSummary.addons.join(', ')]]
                : []),
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline gap-2">
                <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-paper/35 shrink-0">{k}</span>
                <span className="font-sans text-paper/70 text-[12px] truncate">{v}</span>
              </div>
            ))}
          </div>
          <input type="hidden" name="estimateSummary" value={JSON.stringify(estimateSummary)} />
        </div>
      )}

      <div className="flex flex-col gap-8">

        {/* Name + Email */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className={labelCls}>
              {t('nombre')} <span className="text-accent">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder={t('nombrePlaceholder')}
              required
              className={inputCls(!!fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
              aria-invalid={!!fieldErrors.name}
            />
            {fieldErrors.name && (
              <p id="name-error" className={errorCls} role="alert">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className={labelCls}>
              Email <span className="text-accent">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="tu@empresa.com"
              required
              className={inputCls(!!fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              aria-invalid={!!fieldErrors.email}
            />
            {fieldErrors.email && (
              <p id="email-error" className={errorCls} role="alert">
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>

        {/* Company */}
        <div>
          <label htmlFor="empresa" className={labelCls}>
            {t('empresa')} <span className="text-paper/30">{t('opcional')}</span>
          </label>
          <input
            id="empresa"
            name="empresa"
            type="text"
            autoComplete="organization"
            placeholder={t('empresaPlaceholder')}
            className={inputCls()}
          />
        </div>

        {/* Project type + Budget */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tipoProyecto" className={labelCls}>
              {t('tipoProyecto')}
            </label>
            <div className="relative">
              <select
                id="tipoProyecto"
                name="tipoProyecto"
                className={`${inputCls()} appearance-none cursor-pointer pr-8`}
              >
                {projectTypes.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <span
                className="absolute right-0 top-1/2 -translate-y-1/2 text-paper/35 pointer-events-none font-mono text-[11px]"
                aria-hidden="true"
              >
                ↓
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="presupuesto" className={labelCls}>
              {t('presupuesto')}
            </label>
            <div className="relative">
              <select
                id="presupuesto"
                name="presupuesto"
                className={`${inputCls()} appearance-none cursor-pointer pr-8`}
              >
                {budgets.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <span
                className="absolute right-0 top-1/2 -translate-y-1/2 text-paper/35 pointer-events-none font-mono text-[11px]"
                aria-hidden="true"
              >
                ↓
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="mensaje" className={labelCls}>
            {t('mensaje')} <span className="text-accent">*</span>
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={5}
            placeholder={t('mensajePlaceholder')}
            required
            className={`${inputCls(!!fieldErrors.mensaje)} resize-none`}
            aria-describedby={fieldErrors.mensaje ? 'mensaje-error' : undefined}
            aria-invalid={!!fieldErrors.mensaje}
          />
          {fieldErrors.mensaje && (
            <p id="mensaje-error" className={errorCls} role="alert">
              {fieldErrors.mensaje}
            </p>
          )}
        </div>

        {/* Server-level error */}
        {state.status === 'error' && state.message && Object.keys(fieldErrors).length === 0 && (
          <p className="font-mono text-[9px] text-red-500 tracking-[0.1em]" role="alert">
            {state.message}
          </p>
        )}

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] bg-accent text-paper px-8 py-4 hover:bg-accent/85 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"
                    className="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                    className="opacity-75"
                  />
                </svg>
                {t('enviando')}
              </>
            ) : (
              t('enviar')
            )}
          </button>
        </div>

      </div>
    </form>
  )
}
