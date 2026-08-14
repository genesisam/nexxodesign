'use client'

import { useActionState } from 'react'
import { subscribeNewsletter, type NewsletterState } from './actions'

const INITIAL: NewsletterState = { status: 'idle' }

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeNewsletter, INITIAL)

  if (state.status === 'success') {
    return (
      <div className="py-20 md:py-28 gutter-x bg-ink" role="status" aria-live="polite">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/65 mb-5">
          Newsletter · Nexxo
        </p>
        <p className="font-display font-semibold text-paper leading-tight tracking-[-0.03em]"
           style={{ fontSize: 'clamp(1.6rem, 3vw, 2.8rem)' }}>
          Estás dentro. Te avisamos con cada artículo nuevo.
        </p>
      </div>
    )
  }

  return (
    <div className="py-20 md:py-28 gutter-x bg-ink">
      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/65 mb-5">
        Newsletter · Nexxo
      </p>
      <h2
        className="font-display font-semibold text-paper leading-[0.92] tracking-[-0.04em] mb-3"
        style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)' }}
      >
        Diseño, producto e IA.<br />
        Sin ruido, cada dos semanas.
      </h2>
      <p className="font-sans text-paper/70 text-[14px] leading-relaxed mb-10 max-w-[44ch]">
        Ideas que usamos en proyectos reales. Nada de newsletters de LinkedIn en disfraz.
      </p>

      <form action={formAction} className="flex flex-col sm:flex-row gap-3 max-w-[480px]">
        <input
          name="email"
          type="email"
          required
          placeholder="tu@email.com"
          disabled={isPending}
          className="flex-1 bg-transparent border border-paper/20 text-paper placeholder:text-paper/55 font-sans text-[14px] px-4 py-3 outline-none focus:border-paper/50 transition-colors duration-200 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 bg-accent text-paper font-mono text-[9px] uppercase tracking-[0.22em] px-6 py-3 hover:bg-accent/85 transition-colors duration-200 disabled:opacity-60"
        >
          {isPending ? 'Suscribiendo…' : 'Suscribirme →'}
        </button>
      </form>

      {state.status === 'error' && (
        <p role="status" aria-live="polite" className="font-mono text-[9px] uppercase tracking-[0.18em] text-red-400 mt-4">
          {state.message}
        </p>
      )}
    </div>
  )
}
