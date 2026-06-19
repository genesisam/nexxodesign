import Link from 'next/link'

// Placeholder metrics — replace with real data from Sanity once projects are in
const STATS = [
  { value: '40+',  label: 'proyectos' },
  { value: '+52%', label: 'conv. promedio' },
  { value: '×2',   label: 'más rápido' },
] as const

const TAGS = ['SaaS', 'Fintech', 'IA', 'Proptech'] as const

export function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative min-h-[100svh] bg-ink flex flex-col justify-end px-6 md:px-16 lg:px-24 pb-12 md:pb-20 border-b border-line"
    >

      {/* ── Top bar (sits below the nav visually) ── */}
      <div className="absolute top-0 left-6 right-6 md:left-16 md:right-16 lg:left-24 lg:right-24 h-16 md:h-20 flex items-center justify-between pointer-events-none">
        <span className="font-mono text-smoke/50 text-[10px] uppercase tracking-[0.25em]">
          Diseño de producto · 2026
        </span>
        <span className="hidden md:block font-mono text-smoke/50 text-[10px] uppercase tracking-[0.25em]">
          LatAm + Global
        </span>
      </div>

      {/* ── Main content — anchored to bottom-left ── */}
      <div className="w-full">

        {/* Service tags */}
        <div className="flex flex-wrap items-center gap-2 mb-10 md:mb-14">
          {TAGS.map(tag => (
            <span
              key={tag}
              className="font-mono text-[9px] uppercase tracking-[0.22em] text-smoke border border-line px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* H1 — thesis statement per §5.1 & §6 */}
        <h1
          className="font-display font-semibold text-paper leading-[0.87] tracking-[-0.03em] mb-10 md:mb-14"
          style={{ fontSize: 'clamp(3rem, 8.5vw, 8.5rem)' }}
        >
          Producto y web<br />
          que convierte<br />
          <span className="text-smoke">desde el día uno.</span>
        </h1>

        {/* Subhead + CTAs — split row on desktop */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-16">

          <p className="font-body text-smoke text-lg md:text-xl leading-relaxed max-w-[38ch]">
            Diseñamos interfaces premium para startups de SaaS, fintech e IA
            que quieren escalar en LatAm y el mundo — con métricas, no con premios.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest bg-accent text-paper px-7 py-3.5 hover:bg-accent/85 transition-colors duration-200"
            >
              Cotiza tu proyecto
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest border border-line text-smoke px-7 py-3.5 hover:border-smoke/60 hover:text-paper transition-colors duration-200"
            >
              Ver trabajo →
            </Link>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="mt-14 md:mt-18 pt-6 border-t border-line flex flex-wrap gap-x-12 gap-y-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="font-display font-semibold text-paper text-2xl md:text-3xl tracking-tight">
                {value}
              </span>
              <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.2em]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-10 right-6 md:right-16 lg:right-24 flex flex-col items-center gap-3">
        <div className="w-px h-12 bg-line relative overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-1/2 bg-smoke/40"
            style={{ animation: 'slideDown 1.6s ease-in-out infinite' }}
          />
        </div>
        <span
          className="font-mono text-smoke/40 text-[9px] uppercase tracking-[0.2em]"
          style={{ writingMode: 'vertical-rl' }}
        >
          scroll
        </span>
      </div>

      {/* scroll indicator keyframe — scoped inline to avoid global pollution */}
      <style>{`
        @keyframes slideDown {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>

    </section>
  )
}
