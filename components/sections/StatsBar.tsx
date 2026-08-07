'use client'

const STATS = [
  { value: '40+',   label: 'proyectos entregados' },
  { value: '+280%', label: 'velocidad de cierre (Merxo)' },
  { value: '×2.8',  label: 'conversión promedio' },
  { value: '4.9★',  label: 'satisfacción de clientes' },
  { value: '24h',   label: 'respuesta máxima' },
] as const

export function StatsBar() {
  return (
    <section
      aria-label="Métricas clave"
      className="border-y border-paper/8 bg-ink overflow-hidden"
    >
      <div className="flex divide-x divide-paper/8 max-md:flex-wrap">
        {STATS.map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center gap-1 px-6 py-5 flex-1 min-w-[140px] max-md:border-b max-md:border-paper/8"
          >
            <span
              className="font-display font-semibold text-paper leading-none tracking-[-0.03em]"
              style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2rem)' }}
            >
              {value}
            </span>
            <span className="font-mono text-paper/35 uppercase tracking-[0.18em] text-center leading-snug"
              style={{ fontSize: 'clamp(7px, 0.65vw, 9px)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
