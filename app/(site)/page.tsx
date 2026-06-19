// Design system preview — delete or replace once Hero section is built.
// Shows: typographic scale · color tokens · ink section · paper (inverted) section.
export const metadata = { title: 'Sistema de diseño — Preview' }

const COLORS = [
  { name: 'ink',    hex: '#0E0E0E', dark: false },
  { name: 'paper',  hex: '#EFEBE3', dark: true  },
  { name: 'smoke',  hex: '#8B8B85', dark: true  },
  { name: 'accent', hex: '#5B3DF5', dark: false },
  { name: 'line',   hex: '#232323', dark: false },
  { name: 'clay',   hex: '#C9A88F', dark: true  },
] as const

export default function HomePage() {
  return (
    <main>

      {/* ══════════════════════════════════════════
          SECCIÓN 01 — INK (oscura, principal)
          ══════════════════════════════════════════ */}
      <section className="bg-ink min-h-screen px-6 md:px-16 lg:px-24 py-24 flex flex-col justify-between border-b border-line">

        {/* Label */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em]">
            01 — Sección ink
          </span>
          <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em]">
            bg: #0E0E0E · text: #EFEBE3
          </span>
        </div>

        {/* Type scale — Display */}
        <div className="space-y-0 mt-16">
          <p className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em] mb-8">
            Clash Display — escala display
          </p>

          <div className="border-t border-line pt-6 pb-4 flex items-baseline justify-between gap-4">
            <h1 className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.03em]"
                style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}>
              Diseño que convierte
            </h1>
            <span className="font-mono text-smoke text-[10px] shrink-0 self-start pt-1">
              display-xl · 600
            </span>
          </div>

          <div className="border-t border-line pt-6 pb-4 flex items-baseline justify-between gap-4">
            <h2 className="font-display font-semibold text-paper text-5xl md:text-7xl leading-[0.9] tracking-[-0.02em]">
              Producto + web premium
            </h2>
            <span className="font-mono text-smoke text-[10px] shrink-0 self-start pt-1">
              display-lg · 600
            </span>
          </div>

          <div className="border-t border-line pt-6 pb-4 flex items-baseline justify-between gap-4">
            <h3 className="font-display font-medium text-paper text-3xl md:text-4xl leading-tight tracking-[-0.01em]">
              SaaS · Fintech · IA · Proptech
            </h3>
            <span className="font-mono text-smoke text-[10px] shrink-0 self-start pt-1">
              display-md · 500
            </span>
          </div>

          <div className="border-t border-line pt-6 pb-4 flex items-baseline justify-between gap-4">
            <h4 className="font-display font-regular text-paper text-xl md:text-2xl leading-snug">
              Interfaces que convierten desde el primer scroll
            </h4>
            <span className="font-mono text-smoke text-[10px] shrink-0 self-start pt-1">
              display-sm · 400
            </span>
          </div>
        </div>

        {/* Type scale — Body + Mono */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px border border-line">
          {/* Body */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-line space-y-4">
            <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em] block mb-6">
              DM Sans — body
            </span>
            <p className="font-body text-paper text-xl leading-relaxed">
              Construimos interfaces que eliminan fricción y multiplican conversión — no diseño por diseño.
            </p>
            <p className="font-body text-smoke text-base leading-relaxed">
              Cada decisión visual está anclada a un objetivo de negocio. Trackeamos métricas, no premios.
            </p>
            <p className="font-body text-smoke/60 text-sm leading-relaxed">
              Caption / nota al pie · DM Sans 14px / smoke 60%
            </p>
          </div>

          {/* Mono */}
          <div className="p-8 space-y-4">
            <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em] block mb-6">
              IBM Plex Mono — utility
            </span>
            <p className="font-mono text-paper text-sm leading-relaxed">
              +58% conversión · 3× retención · LCP 1.8s
            </p>
            <p className="font-mono text-smoke text-xs leading-relaxed">
              01 — Proyecto · 2025 · SaaS / LatAm
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {['SaaS', 'Fintech', 'IA', 'Web'].map(tag => (
                <span key={tag} className="font-mono text-[10px] uppercase tracking-[0.2em] text-smoke border border-line px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <button className="font-mono text-xs uppercase tracking-widest bg-accent text-paper px-6 py-3 hover:bg-accent/90 transition-colors">
                Cotiza tu proyecto
              </button>
              <button className="font-mono text-xs uppercase tracking-widest border border-line text-smoke px-6 py-3 hover:border-smoke hover:text-paper transition-colors">
                Ver work
              </button>
            </div>
          </div>
        </div>

      </section>


      {/* ══════════════════════════════════════════
          SECCIÓN 02 — PAPER (invertida, clara)
          ══════════════════════════════════════════ */}
      <section className="bg-paper min-h-screen px-6 md:px-16 lg:px-24 py-24 flex flex-col justify-between">

        {/* Label */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em]">
            02 — Sección paper (invertida)
          </span>
          <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em]">
            bg: #EFEBE3 · text: #0E0E0E
          </span>
        </div>

        {/* Headline on light */}
        <div className="mt-16 border-t border-ink/10">
          <div className="pt-8 pb-6">
            <h2 className="font-display font-semibold text-ink leading-[0.88] tracking-[-0.03em]"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}>
              Trabajo seleccionado
            </h2>
          </div>
          <p className="font-body text-ink/60 text-xl leading-relaxed max-w-2xl border-t border-ink/10 pt-6">
            Proyectos reales con métricas reales. Sin slides genéricos — solo antes y después, con números.
          </p>
        </div>

        {/* Color palette swatches */}
        <div className="mt-16">
          <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em] block mb-6">
            Paleta de colores
          </span>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-px border border-ink/10">
            {COLORS.map(({ name, hex, dark }) => (
              <div key={name} className="aspect-square flex flex-col justify-between p-3"
                   style={{ backgroundColor: hex }}>
                <span className={`font-mono text-[9px] uppercase tracking-widest ${dark ? 'text-[#0E0E0E]/60' : 'text-[#EFEBE3]/60'}`}>
                  {name}
                </span>
                <span className={`font-mono text-[9px] ${dark ? 'text-[#0E0E0E]/50' : 'text-[#EFEBE3]/50'}`}>
                  {hex}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Clay accent usage example */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-px border border-ink/10">
          <div className="bg-clay p-8 md:col-span-1">
            <span className="font-mono text-[#0E0E0E]/60 text-[10px] uppercase tracking-widest block mb-3">clay</span>
            <p className="font-display font-medium text-ink text-2xl leading-tight">
              Acento cálido sobre paper
            </p>
          </div>
          <div className="bg-accent p-8 md:col-span-1">
            <span className="font-mono text-paper/60 text-[10px] uppercase tracking-widest block mb-3">accent</span>
            <p className="font-display font-medium text-paper text-2xl leading-tight">
              CTA sobre accent
            </p>
          </div>
          <div className="bg-ink p-8 md:col-span-1 border border-line">
            <span className="font-mono text-smoke text-[10px] uppercase tracking-widest block mb-3">ink</span>
            <p className="font-display font-medium text-paper text-2xl leading-tight">
              Display sobre ink
            </p>
          </div>
        </div>

        {/* Footer del preview */}
        <div className="mt-12 pt-6 border-t border-ink/10 flex items-center justify-between">
          <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em]">
            Sistema validado — listo para Hero
          </span>
          <span className="font-mono text-clay text-[10px] uppercase tracking-[0.25em]">
            Nexxo · 2026
          </span>
        </div>

      </section>

    </main>
  )
}
