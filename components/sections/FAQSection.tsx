'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

type Faq = { q: string; a: string }

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  const t     = useTranslations('faq')
  const faqs  = t.raw('items') as Faq[]

  // Built from the same translated source as the visible accordion, so the
  // structured data always matches the language of the page it renders on.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type':        'Question',
      name:           q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <section
      id="faq"
      aria-label={t('aria')}
      className="bg-ink border-t border-paper/10 px-6 md:px-16 lg:px-24 py-20 md:py-28"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20 items-start">

        {/* Left label */}
        <div className="md:sticky md:top-32">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/60 mb-4">
            {t('eyebrow')}
          </p>
          <h2
            className="font-display font-semibold text-paper leading-[0.92] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(1.8rem, 3.2vw, 3.2rem)' }}
          >
            {t('heading1')}<br />{t('heading2')}
          </h2>
          <p className="font-mono text-paper/65 text-[11px] leading-relaxed mt-5 max-w-[24ch]">
            {t('aside')}
          </p>
        </div>

        {/* Right: accordion */}
        <div className="flex flex-col">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="border-b border-paper/10">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-start justify-between gap-6 py-5 md:py-6 text-left group"
              >
                <span
                  className="font-sans font-medium text-paper group-hover:text-paper/80 transition-colors leading-snug"
                  style={{ fontSize: 'clamp(0.95rem, 1.15vw, 1.1rem)' }}
                >
                  {q}
                </span>
                <span
                  className="flex-shrink-0 font-mono text-paper/55 text-lg leading-none mt-0.5 transition-transform duration-200"
                  style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  aria-hidden
                >
                  +
                </span>
              </button>

              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: open === i ? '400px' : '0px' }}
              >
                <p
                  className="font-sans text-paper/55 leading-relaxed pb-6"
                  style={{ fontSize: 'clamp(0.875rem, 1vw, 0.975rem)' }}
                >
                  {a}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
