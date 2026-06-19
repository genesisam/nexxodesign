import Link from 'next/link'
import { NAV_LINKS, CONTACT_CALENDLY, CONTACT_WHATSAPP } from '@/lib/constants'

export function Footer() {
  return (
    <footer aria-label="Footer">

      {/* ── CTA principal — paper invertida ── */}
      <div className="bg-paper px-6 md:px-16 lg:px-24 pt-24 md:pt-32 pb-16 md:pb-24 border-t-0">

        <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em] block mb-10 md:mb-14">
          Siguiente paso
        </span>

        {/* WebGL accent placeholder — shader wipe goes here (§5.8) */}
        <h2
          className="font-display font-semibold text-ink leading-[0.87] tracking-[-0.03em] mb-12 md:mb-16"
          style={{ fontSize: 'clamp(2.75rem, 7.5vw, 7rem)' }}
        >
          ¿Listo para construir<br />
          algo que importe?
        </h2>

        <p className="font-body text-smoke text-lg leading-relaxed max-w-[40ch] mb-10">
          Agenda 30 minutos. Sin pitch de ventas —
          solo escuchamos tu proyecto y te decimos si podemos ayudarte.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={CONTACT_CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest bg-ink text-paper px-8 py-4 hover:bg-ink/80 transition-colors duration-200"
          >
            Agendar llamada
          </a>
          <a
            href={CONTACT_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest border border-ink/20 text-smoke px-8 py-4 hover:border-ink/50 hover:text-ink transition-colors duration-200"
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="bg-paper border-t border-ink/10 px-6 md:px-16 lg:px-24 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">

        <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em]">
          © 2026 Nexxo Studio
        </span>

        <nav aria-label="Footer nav" className="flex flex-wrap gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-mono text-smoke text-[10px] uppercase tracking-[0.22em] hover:text-ink transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        <span className="font-mono text-clay text-[10px] uppercase tracking-[0.25em]">
          Hecho con exigencia
        </span>

      </div>
    </footer>
  )
}
