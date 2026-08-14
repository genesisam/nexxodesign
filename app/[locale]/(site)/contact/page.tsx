import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates } from '@/lib/seo'
import { ContactClient } from './ContactClient'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact.meta' })
  return {
    title:       t('title'),
    description: t('description'),
    alternates:  buildAlternates(locale, '/contact'),
  }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')

  return (
    <main className="bg-ink min-h-screen">

      <section className="gutter-x pt-32 md:pt-44 pb-16 md:pb-20 border-b border-paper/10">
        <p className="font-mono text-paper/65 text-[9px] uppercase tracking-[0.28em] mb-6">
          {t('eyebrow')}
        </p>

        <h1
          className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.04em] mb-7 max-w-[16ch]"
          style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}
        >
          {t('headline')}
        </h1>

        <p
          className="font-sans text-paper/55 leading-relaxed max-w-[52ch]"
          style={{ fontSize: 'clamp(1rem, 1.4vw, 1.1rem)' }}
        >
          {t('subhead')}
        </p>
      </section>

      <ContactClient />

    </main>
  )
}
