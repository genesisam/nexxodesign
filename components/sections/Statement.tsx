import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/navigation'

export async function Statement() {
  const t = await getTranslations('statement')

  return (
    <section aria-label="Manifiesto" className="border-t border-line px-6 md:px-16 lg:px-24 py-24 md:py-36">

      <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em] block mb-12 md:mb-16">
        {t('seccion')}
      </span>

      <p
        className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.03em] max-w-[22ch]"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
      >
        {t('texto')}{' '}
        <span className="text-accent">{t('acento')}</span>
      </p>

      <div className="mt-12 md:mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-16">

        <p className="font-body text-smoke text-base md:text-lg leading-relaxed max-w-[42ch]">
          {t('body')}
        </p>

        <Link
          href="/contact"
          className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-paper transition-colors duration-300 shrink-0"
        >
          {t('cta')}
          <span
            className="text-accent transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          >
            →
          </span>
        </Link>

      </div>

    </section>
  )
}
