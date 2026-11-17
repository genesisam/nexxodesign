import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates } from '@/lib/seo'
import { Link } from '@/lib/navigation'
import { NosotrosProjects } from './NosotrosProjects'
import { ProcesoCards } from './ProcesoCards'
import type { ProcesoStep } from './ProcesoCards'
import { NexxoEstudio } from '@/components/estudio/NexxoEstudio'
import { HeadlineReveal } from '@/components/motion/HeadlineReveal'
import { BrickArrow } from '@/components/motion/BrickArrow'
import { CursorVariant } from '@/components/motion/CursorVariant'
import type { EstudioCopy } from '@/components/estudio/NexxoEstudio'

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
      <HeadlineReveal />
      <CursorVariant variant="lego" />

      {/* ══ 1. TOPHEAD ═══════════════════════════════════════════════════════ */}
      <section className="w-full">
        <div className="flex items-end justify-between gap-10 gutter-x pt-32 md:pt-[18vh] max-lg:flex-col max-lg:items-start max-lg:gap-6">
          <div>
            <p className={`${eyebrow} text-paper/65 mb-5`} data-rise>
              {t('tophead.eyebrow')}
            </p>
            <h1
              className="font-display font-semibold text-paper leading-[1.05] tracking-[-0.04em] max-w-[42vw] max-lg:max-w-[74vw]"
              style={{ fontSize: 'clamp(2.2rem, 4.4vw, 5.5rem)' }}
              data-words
              data-delay="0.1"
            >
              {t('tophead.headline')}
            </h1>
          </div>
          <div className="flex items-end gap-5 shrink-0 max-lg:w-full">
          {/* flecha de piezas: lleva la vista del titular al párrafo (solo desktop) */}
          <BrickArrow delay={1.25} className="hidden lg:block shrink-0 w-[clamp(180px,15vw,288px)] h-auto mb-[0.15rem]" />
          <p
            className="font-mono text-paper/70 leading-relaxed max-w-[28vw] pb-1 max-lg:max-w-full"
            style={{ fontSize: 'clamp(0.8rem, 1.1vw, 1rem)' }}
            data-rise
            data-delay="0.55"
          >
            {t('tophead.subhead')}
          </p>
          </div>
        </div>

        {/* Estudio 3D explorable (sustituye a la imagen hero estudio-hero.webp) */}
        <div className="mt-[7vh] w-full">
          <NexxoEstudio copy={t.raw('estudio') as EstudioCopy} />
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
              data-words
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
          data-words
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
