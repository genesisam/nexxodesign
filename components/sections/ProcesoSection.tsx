import { getTranslations } from 'next-intl/server'

type Step = { num: string; title: string; desc: string }

export async function ProcesoSection() {
  const t = await getTranslations('nosotros.proceso')
  const steps = t.raw('steps') as Step[]

  return (
    <section className="border-t border-line px-6 md:px-16 lg:px-24 py-20 md:py-28">

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10 mb-14 md:mb-20">
        <div>
          <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em] block mb-4">
            {t('label')}
          </span>
          <h2
            className="font-display font-semibold text-paper leading-[0.9] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}
          >
            De la idea
            <br />
            al deploy.
          </h2>
        </div>
        <p
          className="font-sans text-smoke/55 leading-relaxed max-w-[44ch]"
          style={{ fontSize: 'clamp(0.88rem, 1.2vw, 1rem)' }}
        >
          Cada proyecto sigue el mismo proceso riguroso. Cuatro fases, sin improvisación, con un solo dueño del resultado de principio a fin.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line">
        {steps.map((step) => (
          <div
            key={step.num}
            className="bg-ink p-8 md:p-10 flex flex-col gap-5"
          >
            <span
              className="font-mono text-accent/60 tracking-[0.06em] leading-none"
              style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)' }}
              aria-hidden
            >
              {step.num}
            </span>
            <div>
              <h3
                className="font-display font-semibold text-paper leading-tight tracking-[-0.025em] mb-2"
                style={{ fontSize: 'clamp(1.15rem, 1.6vw, 1.45rem)' }}
              >
                {step.title}
              </h3>
              <p
                className="font-sans text-smoke/55 leading-relaxed"
                style={{ fontSize: '0.8125rem' }}
              >
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
