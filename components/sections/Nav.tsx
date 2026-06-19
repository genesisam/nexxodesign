'use client'

import { useState } from 'react'
import Link from 'next/link'
import { NAV_LINKS, CONTACT_CALENDLY } from '@/lib/constants'

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* ── Fixed nav — mix-blend-difference so it auto-inverts on any bg ── */}
      <nav
        aria-label="Navegación principal"
        className={[
          'fixed top-0 left-0 right-0 z-50 pointer-events-none',
          // Only blend when menu is closed — inside the ink overlay blend is not needed
          open ? '' : 'mix-blend-difference',
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 h-16 md:h-20 pointer-events-auto">

          {/* Logo wordmark */}
          <Link
            href="/"
            className="font-display font-semibold text-paper text-xl leading-none tracking-tight"
            onClick={() => setOpen(false)}
          >
            Nexxo
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10" role="list">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper opacity-70 hover:opacity-100 transition-opacity duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center font-mono text-[10px] uppercase tracking-[0.22em] text-paper border border-paper/60 px-5 py-2.5 hover:border-paper transition-colors duration-200"
          >
            Cotiza
          </Link>

          {/* Mobile toggle */}
          <button
            className="md:hidden font-mono text-[10px] uppercase tracking-[0.22em] text-paper pointer-events-auto"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            {open ? 'Cerrar' : 'Menú'}
          </button>
        </div>
      </nav>

      {/* ── Mobile fullscreen menu ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink flex flex-col justify-between px-6 pt-28 pb-12"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
        >
          <ul className="space-y-2" role="list">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block font-display font-semibold text-paper text-[13vw] leading-[1] tracking-tight hover:text-smoke transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <Link
              href="/contact"
              className="flex items-center justify-center font-mono text-xs uppercase tracking-widest bg-accent text-paper w-full py-4"
              onClick={() => setOpen(false)}
            >
              Cotiza tu proyecto
            </Link>
            <a
              href={CONTACT_CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center font-mono text-xs uppercase tracking-widest border border-line text-smoke w-full py-4"
              onClick={() => setOpen(false)}
            >
              Agendar llamada
            </a>
          </div>
        </div>
      )}
    </>
  )
}
