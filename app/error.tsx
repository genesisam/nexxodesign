'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error monitoring service when integrated (e.g. Sentry)
    if (process.env.NODE_ENV !== 'production') {
      console.error(error)
    }
  }, [error])

  return (
    <main className="bg-ink min-h-screen flex flex-col items-start justify-center px-6 md:px-16 lg:px-24">

      <p
        aria-hidden
        className="font-display font-semibold text-paper/5 leading-none select-none absolute left-0 right-0 text-center"
        style={{ fontSize: 'clamp(120px, 30vw, 400px)', letterSpacing: '-0.05em' }}
      >
        500
      </p>

      <div className="relative z-10">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-accent mb-6">
          Error del servidor
        </p>
        <h1
          className="font-display font-semibold text-paper leading-[0.92] tracking-[-0.04em] mb-6"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          Algo salió mal.
        </h1>
        <p className="font-sans text-paper/65 text-base leading-relaxed mb-12 max-w-[42ch]">
          Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.22em] text-paper bg-accent px-6 py-3 hover:bg-accent/85 transition-colors duration-200"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60 border border-paper/20 px-6 py-3 hover:border-paper/50 hover:text-paper transition-colors duration-200"
          >
            Ir al inicio
          </Link>
        </div>
      </div>

    </main>
  )
}
