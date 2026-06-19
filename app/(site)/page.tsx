// Home — scaffold test page.
// Sections go here once each component is built (§5 order).
// This page currently verifies: Lenis smooth scroll + design tokens rendering.
export const metadata = {
  title: 'Nexxo — Diseño de producto y web premium',
}

export default function HomePage() {
  return (
    <main>
      {/* ── Hero placeholder ── */}
      <section className="relative h-screen flex flex-col justify-end pb-16 px-6 md:px-16 lg:px-24 border-b border-line">
        <div className="max-w-7xl">
          <span className="font-mono text-smoke text-xs uppercase tracking-[0.2em] block mb-6">
            Nexxo Studio · 2026
          </span>
          <h1 className="font-display text-[clamp(3rem,10vw,9rem)] text-paper leading-[0.9] tracking-tight">
            Diseño que<br />
            convierte
          </h1>
          <p className="font-body text-smoke text-lg md:text-xl mt-8 max-w-xl leading-relaxed">
            Producto y web premium para startups de SaaS, fintech e IA.
          </p>
          <p className="font-mono text-xs text-smoke/40 mt-6 uppercase tracking-widest">
            Scaffold · Lenis ↓ scroll para verificar
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 md:right-16 lg:right-24 flex flex-col items-center gap-2">
          <span className="font-mono text-smoke/50 text-[10px] uppercase tracking-widest [writing-mode:vertical-lr]">
            scroll
          </span>
          <div className="w-px h-16 bg-line relative overflow-hidden">
            <div className="absolute inset-0 bg-smoke/50 animate-[slide_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ── Scroll test sections — remove once real sections exist ── */}
      {(['Work', 'Capabilities', 'Process', 'Testimonials'] as const).map((label, i) => (
        <section
          key={label}
          className="min-h-screen flex flex-col justify-between px-6 md:px-16 lg:px-24 py-24 border-b border-line"
        >
          <span className="font-mono text-smoke/40 text-xs uppercase tracking-widest">
            {String(i + 1).padStart(2, '0')} — {label}
          </span>
          <p className="font-display text-[clamp(4rem,12vw,11rem)] text-paper/5 leading-none text-right select-none pointer-events-none">
            {label}
          </p>
        </section>
      ))}

      {/* ── Footer stub ── */}
      <footer className="flex items-center justify-between px-6 md:px-16 lg:px-24 py-8 border-t border-line">
        <span className="font-mono text-smoke text-xs uppercase tracking-widest">
          © 2026 Nexxo
        </span>
        <span className="font-mono text-smoke/40 text-xs uppercase tracking-widest">
          Por construir
        </span>
      </footer>
    </main>
  )
}
