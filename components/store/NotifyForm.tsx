'use client'

import { useActionState } from 'react'
import { notifyWhenAvailable, type NotifyState } from '@/app/[locale]/(site)/tienda/actions'

const INITIAL: NotifyState = { status: 'idle' }

/**
 * Waiting list for a product that isn't out yet. Same markup language as the
 * journal's newsletter form, so it reads as part of the site rather than a
 * store widget.
 */
export function NotifyForm({ product, compact = false }: { product: string; compact?: boolean }) {
  const [state, formAction, isPending] = useActionState(notifyWhenAvailable, INITIAL)

  if (state.status === 'success') {
    return (
      <p
        role="status"
        aria-live="polite"
        className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent"
      >
        Listo. Te aviso cuando salga →
      </p>
    )
  }

  return (
    <div>
      <form action={formAction} className={compact ? 'flex items-center gap-2' : 'flex flex-col sm:flex-row gap-3 max-w-[480px]'}>
        <input type="hidden" name="product" value={product} />
        {/* Honeypot: hidden from people, irresistible to bots. */}
        <input
          type="text"
          name="nx_hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute h-0 w-0 opacity-0 pointer-events-none"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="tu@email.com"
          aria-label={`Correo para avisarte sobre ${product}`}
          disabled={isPending}
          className={`flex-1 min-w-0 bg-transparent border border-paper/20 text-paper placeholder:text-paper/55
                      font-sans outline-none focus:border-paper/50 transition-colors duration-200 disabled:opacity-50
                      ${compact ? 'text-[12px] px-3 py-2' : 'text-[14px] px-4 py-3'}`}
        />
        <button
          type="submit"
          disabled={isPending}
          className={`shrink-0 bg-paper text-ink font-mono uppercase tracking-[0.22em]
                      hover:bg-paper/90 transition-colors duration-200 disabled:opacity-60
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                      focus-visible:ring-offset-2 focus-visible:ring-offset-ink
                      ${compact ? 'text-[9px] px-3 py-2' : 'text-[9px] px-6 py-3'}`}
        >
          {isPending ? 'Enviando…' : 'Avísame'}
        </button>
      </form>

      {state.status === 'error' && (
        <p role="status" aria-live="polite" className="font-mono text-[9px] uppercase tracking-[0.18em] text-red-400 mt-2">
          {state.message}
        </p>
      )}
    </div>
  )
}
