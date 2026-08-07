import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/sanity/lib/post-data'
import { COVER_GRADIENT } from '@/types/post'
import { buildAlternates } from '@/lib/seo'
import { JournalList } from './JournalList'
import { NewsletterForm } from './NewsletterForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title:       'Journal — Nexxo',
    description: 'Ideas sobre diseño de producto, IA aplicada y SaaS. Cada artículo tiene que ganarse su lugar.',
    alternates:  buildAlternates(locale, '/journal'),
    openGraph: {
      title:       'Journal — Nexxo',
      description: 'Ideas sobre diseño de producto, IA aplicada y SaaS.',
      type:        'website',
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function JournalPage() {
  const posts    = await getAllPosts()
  const featured = posts.find(p => p.featured) ?? posts[0]
  const rest     = posts.filter(p => p._id !== featured?._id)

  return (
    <main className="bg-ink min-h-screen">

      {/* ══ TOPHEAD ═══════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 lg:px-24 pt-32 md:pt-44 pb-16 md:pb-20 border-b border-paper/10">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/40 mb-6">
          Journal · Nexxo
        </p>
        <h1
          className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.04em] mb-7"
          style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}
        >
          Ideas sobre diseño,<br />
          producto e IA.
        </h1>
        <p
          className="font-sans text-paper/50 leading-relaxed max-w-[48ch]"
          style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)' }}
        >
          Lo que aprendemos en proyectos reales. Sin relleno de contenido, sin posts de LinkedIn
          disfrazados de insight.
        </p>
      </section>

      {/* ══ FEATURED POST ══════════════════════════════════════════════════════ */}
      {featured && (
        <section className="px-6 md:px-16 lg:px-24 py-14 md:py-20 border-b border-paper/10">
          <Link
            href={`/journal/${featured.slug.current}`}
            className="group block md:grid md:grid-cols-2 gap-12 lg:gap-20 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
          >
            {/* Cover */}
            <div
              className="rounded-[1.5rem] overflow-hidden aspect-[4/3] mb-8 md:mb-0"
              style={{ background: COVER_GRADIENT[featured.category] }}
            >
              {featured.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featured.cover}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  draggable={false}
                />
              )}
            </div>

            {/* Content */}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent mb-4">
                {featured.category} · Destacado
              </p>
              <h2
                className="font-display font-semibold text-paper leading-[0.92] tracking-[-0.04em] mb-5 group-hover:text-accent transition-colors duration-300"
                style={{ fontSize: 'clamp(1.8rem, 3.4vw, 3.2rem)' }}
              >
                {featured.title}
              </h2>
              <p
                className="font-sans text-paper/55 leading-relaxed mb-6"
                style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)' }}
              >
                {featured.excerpt}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/35">
                {formatDate(featured.publishedAt)} · {featured.readingTime} min de lectura
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* ══ POST LIST (client — filter tabs) ══════════════════════════════════ */}
      {rest.length > 0 && (
        <div className="pt-14 md:pt-20">
          <div className="px-6 md:px-16 lg:px-24 mb-0">
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/35">
              Todos los artículos
            </p>
          </div>
          <JournalList posts={rest} />
        </div>
      )}

      {/* ══ NEWSLETTER ════════════════════════════════════════════════════════ */}
      <NewsletterForm />

    </main>
  )
}
