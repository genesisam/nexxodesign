import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/navigation'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

export async function Statement() {
  const t = await getTranslations('statement')

  return (
    <section aria-label="Manifiesto" className="border-t border-line px-6 md:px-16 lg:px-24 py-24 md:py-36">

      <ScrollReveal stagger>
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
      </ScrollReveal>

      <ScrollReveal className="mt-12 md:mt-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-20">

        {/* Two columns from lg up: at 120 words a single 42ch column left the
            right half of the section empty and the text running very tall.
            Each column keeps a readable measure instead of one long line. */}
        <p className="font-body text-smoke text-base md:text-lg leading-relaxed
                      max-w-[52ch] lg:max-w-none lg:columns-2 lg:gap-16 lg:[column-fill:balance]">
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

      </ScrollReveal>

    </section>
  )
}
