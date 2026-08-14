import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates } from '@/lib/seo'
import { Link } from '@/lib/navigation'
import { NosotrosProjects } from './NosotrosProjects'
import { ProcesoCards } from './ProcesoCards'
import type { ProcesoStep } from './ProcesoCards'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nosotros.meta' })
  return {
    title:       t('title'),
    description: t('description'),
    alternates:  buildAlternates(locale, '/nosotros'),
  }
}

const eyebrow = 'font-mono text-[9px] uppercase tracking-[0.28em]'

export default async function NosotrosPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('nosotros')

  const steps = t.raw('proceso.steps') as ProcesoStep[]

  return (
    <main className="bg-ink">

      {/* ══ 1. TOPHEAD ═══════════════════════════════════════════════════════ */}
      <section className="w-full">
        <div className="flex items-end justify-between gap-10 gutter-x pt-32 md:pt-[18vh] max-lg:flex-col max-lg:items-start max-lg:gap-6">
          <div>
            <p className={`${eyebrow} text-paper/65 mb-5`}>
              {t('tophead.eyebrow')}
            </p>
            <h1
              className="font-display font-semibold text-paper leading-[1.05] tracking-[-0.04em] max-w-[42vw] max-lg:max-w-[74vw]"
              style={{ fontSize: 'clamp(2.2rem, 4.4vw, 5.5rem)' }}
              data-reveal
            >
              {t('tophead.headline')}
            </h1>
          </div>
          <p
            className="font-mono text-paper/70 leading-relaxed shrink-0 max-w-[28vw] pb-1 max-lg:max-w-full"
            style={{ fontSize: 'clamp(0.8rem, 1.1vw, 1rem)' }}
            data-reveal
          >
            {t('tophead.subhead')}
          </p>
        </div>

        <div className="mt-[7vh] w-full overflow-hidden">
          <div
            className="relative w-full aspect-[16/7] bg-gradient-to-br from-paper/10 via-paper/4 to-transparent"
            data-parallax
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/system/estudio-hero.webp"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              fetchPriority="high"
              draggable={false}
            />
          </div>
        </div>
      </section>

      {/* ══ 2. MANIFIESTO EDITORIAL ══════════════════════════════════════════ */}
      <section className="gutter-x py-24 md:py-36 border-b border-paper/10">
        <div className="grid md:grid-cols-[0.7fr_2.3fr] gap-10 md:gap-20 items-start">

          {/* Label sticky */}
          <div className="md:sticky md:top-32">
            <p className={`${eyebrow} text-paper/60`}>{t('manifiesto.label')}</p>
          </div>

          {/* Texto editorial con dos tonos */}
          <div className="flex flex-col gap-10 md:gap-14">
            <p
              className="font-display font-semibold leading-[1.0] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 4.2vw, 4.8rem)' }}
            >
              <span className="text-paper/55">{t('manifiesto.p1muted')} </span>
              <span className="text-paper">{t('manifiesto.p1accent')}</span>
            </p>

            <p
              className="font-display font-semibold leading-[1.0] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 4.2vw, 4.8rem)' }}
            >
              <span className="text-paper">{t('manifiesto.p2accent')} </span>
              <span className="text-paper/55">{t('manifiesto.p2muted')}</span>
            </p>

            <p
              className="font-display font-semibold text-paper leading-[1.0] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 4.2vw, 4.8rem)' }}
            >
              {t('manifiesto.p3')}
            </p>
          </div>

        </div>
      </section>

      {/* ══ 4. PROCESO ═══════════════════════════════════════════════════════ */}
      <section className="pt-20 md:pt-28 pb-0">
        <div className="gutter-x mb-10 md:mb-14">
          <p className={`${eyebrow} text-paper/65`}>{t('proceso.label')}</p>
        </div>
        <ProcesoCards steps={steps} />
      </section>

      {/* ══ 5. TRABAJO SELECCIONADO ══════════════════════════════════════════ */}
      <section className="gutter-x pt-20 md:pt-28 pb-20 md:pb-28 border-t border-paper/10">
        <div className="flex items-end justify-between gap-6 mb-12 md:mb-16 max-sm:flex-col max-sm:items-start">
          <div>
            <p className={`${eyebrow} text-paper/65 mb-4`}>
              {t('trabajo.seccionLabel')}
            </p>
            <h2
              className="font-display font-semibold text-paper leading-[0.92] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
            >
              {t('trabajo.headline')}
            </h2>
          </div>
          <Link
            href="/proyectos"
            className="shrink-0 pb-1 font-mono text-[9px] uppercase tracking-[0.22em] text-paper/65 hover:text-paper transition-colors duration-200 max-sm:self-start"
          >
            {t('trabajo.ctaTodo')}
          </Link>
        </div>
        <NosotrosProjects />
      </section>

      {/* ══ 6. CTA ═══════════════════════════════════════════════════════════ */}
      <section className="gutter-x py-24 md:py-36 border-t border-paper/10" data-reveal>
        <h2
          className="font-display font-semibold text-paper leading-[0.92] tracking-[-0.04em] mb-10"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 6.5rem)' }}
        >
          {t('cta.headline')}
        </h2>
        <Link
          href="/contact"
          className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.22em] bg-accent text-paper px-8 py-4 hover:bg-accent/85 transition-colors duration-200"
        >
          {t('cta.button')}
        </Link>
      </section>

    </main>
  )
}
