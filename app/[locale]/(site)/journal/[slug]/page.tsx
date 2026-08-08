import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPostSlugs, getAllPosts, getPostBySlug } from '@/sanity/lib/post-data'
import { COVER_GRADIENT } from '@/types/post'
import { buildAlternates, absoluteUrl, SITE_URL } from '@/lib/seo'
import { NexxoPortableText } from '@/components/portable-text'
import { NewsletterForm } from '../NewsletterForm'
import { PostShareBar } from '../PostShareBar'

export const revalidate = 3600

type Props = { params: Promise<{ locale: string; slug: string }> }

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map(slug => ({ slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Artículo no encontrado — Nexxo' }

  return {
    title:       `${post.title} — Nexxo Journal`,
    description: post.excerpt,
    alternates:  buildAlternates(locale, `/journal/${slug}`),
    authors:     [{ name: post.author.name, url: absoluteUrl(locale, '/nosotros') }],
    keywords:    post.tags?.length ? post.tags : undefined,
    category:    post.category,
    openGraph: {
      title:         post.title,
      description:   post.excerpt,
      type:          'article',
      url:           absoluteUrl(locale, `/journal/${slug}`),
      siteName:      'Nexxo',
      locale,
      publishedTime: post.publishedAt,
      modifiedTime:  post.publishedAt,
      section:       post.category,
      tags:          post.tags,
      authors:       [post.author.name],
      images:        post.cover
        ? [{ url: post.cover, alt: post.title, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card:        'summary_large_image',
      title:       post.title,
      description: post.excerpt,
      images:      post.cover ? [post.cover] : undefined,
    },
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PostPage({ params }: Props) {
  const { slug, locale } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  // Related: same category, exclude current, max 2; fallback to any 2
  const allPosts   = await getAllPosts()
  const related    = allPosts.filter(p => p._id !== post._id && p.category === post.category).slice(0, 2)
  const relatedPosts = related.length > 0 ? related : allPosts.filter(p => p._id !== post._id).slice(0, 2)

  const postUrl = absoluteUrl(locale, `/journal/${post.slug.current}`)

  // Rough word count off the Portable Text spans — search engines use it as a
  // depth signal, and an approximation beats omitting the field.
  const wordCount = (post.body ?? []).reduce((n, block) => {
    const children = (block as { children?: { text?: string }[] }).children ?? []
    return n + children.reduce((m, c) => m + (c.text?.trim().split(/\s+/).filter(Boolean).length ?? 0), 0)
  }, 0)

  // JSON-LD BlogPosting
  const jsonLd = {
    '@context':    'https://schema.org',
    '@type':       'BlogPosting',
    headline:      post.title,
    description:   post.excerpt,
    datePublished: post.publishedAt,
    // Google treats a missing dateModified as a staleness signal; with no
    // edit tracking in the CMS the publish date is the honest answer.
    dateModified:  post.publishedAt,
    image:         post.cover ? [post.cover] : undefined,
    url:           postUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    inLanguage:    locale,
    articleSection: post.category,
    keywords:      post.tags?.length ? post.tags.join(', ') : undefined,
    timeRequired:  post.readingTime ? `PT${post.readingTime}M` : undefined,
    wordCount:     wordCount || undefined,
    isAccessibleForFree: true,
    author: {
      '@type':   'Person',
      name:      post.author.name,
      jobTitle:  post.author.role,
      url:       absoluteUrl(locale, '/nosotros'),
    },
    publisher: {
      '@type': 'Organization',
      name:    'Nexxo',
      url:     SITE_URL,
      logo:    { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
    },
    // Answer engines quote the lead: naming it explicitly keeps them from
    // stitching a summary out of navigation chrome.
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '[data-speakable]'],
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio',  item: absoluteUrl(locale) },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: absoluteUrl(locale, '/journal') },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="bg-ink">

        {/* ══ TOPHEAD ═══════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-16 lg:px-24 pt-32 md:pt-44 pb-12 md:pb-16">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent mb-6">
            {post.category}
          </p>
          <h1
            className="font-display font-semibold text-paper leading-[0.92] tracking-[-0.04em] mb-8"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 6rem)' }}
          >
            {post.title}
          </h1>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/35">
            {formatDate(post.publishedAt)}
            {' · '}
            {post.readingTime} min de lectura
            {' · '}
            {post.author.name}
          </p>
        </section>

        {/* ══ COVER ═════════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-16 lg:px-24 pb-14 md:pb-20">
          <div
            className="rounded-[2rem] overflow-hidden aspect-[16/9]"
            style={{ background: COVER_GRADIENT[post.category] }}
          >
            {post.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
                draggable={false}
              />
            )}
          </div>
        </section>

        {/* ══ BODY + SIDEBAR ════════════════════════════════════════════════ */}
        <section className="px-6 md:px-16 lg:px-24 pb-14 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] xl:grid-cols-[1fr_280px] gap-12 lg:gap-14 xl:gap-20 items-start">

            {/* ── Article body ── */}
            <div className="min-w-0">
              <NexxoPortableText value={post.body} dark={true} />
            </div>

            {/* ── Sticky sidebar ── */}
            <aside className="lg:sticky lg:top-28 flex flex-col gap-6 pt-1 border-t border-paper/10 lg:border-t-0 mt-10 lg:mt-0">

              {/* Share & AI tools */}
              <PostShareBar slug={post.slug.current} title={post.title} sidebar />

              {/* Divider */}
              <div className="border-t border-paper/10" />

              {/* Author bio */}
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/35 mb-5">
                  Escrito por
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1c1050 0%, #5B3DF5 100%)' }}
                  >
                    {post.author.avatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p
                      className="font-display font-semibold text-paper tracking-[-0.025em] leading-tight"
                      style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)' }}
                    >
                      {post.author.name}
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/40 mt-0.5">
                      {post.author.role}
                    </p>
                  </div>
                </div>
                {/* Social links — TODO: reemplaza href con URLs reales */}
                <div className="flex items-center gap-5 mt-5 flex-wrap">
                  {[
                    { label: 'Instagram', href: '/' },
                    { label: 'YouTube',   href: '/' },
                    { label: 'LinkedIn',  href: '/' },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/35 hover:text-accent transition-colors duration-200"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        </section>

        {/* ══ RELATED POSTS ═════════════════════════════════════════════════ */}
        {relatedPosts.length > 0 && (
          <section className="px-6 md:px-16 lg:px-24 py-14 md:py-20 border-t border-paper/10">
            <div className="flex items-end justify-between gap-4 mb-10">
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/35">
                Seguir leyendo
              </p>
              <Link
                href="/journal"
                className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/35 hover:text-accent transition-colors duration-200"
              >
                Ver todo →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              {relatedPosts.map(rel => (
                <Link
                  key={rel._id}
                  href={`/journal/${rel.slug.current}`}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
                >
                  <div
                    className="rounded-[1.25rem] overflow-hidden aspect-[16/9] mb-4"
                    style={{ background: COVER_GRADIENT[rel.category] }}
                  >
                    {rel.cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={rel.cover} alt={rel.title} className="w-full h-full object-cover" loading="lazy" draggable={false} />
                    )}
                  </div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent mb-2">
                    {rel.category}
                  </p>
                  <h3
                    className="font-display font-semibold text-paper leading-tight tracking-[-0.03em] group-hover:text-accent transition-colors duration-200 mb-2"
                    style={{ fontSize: 'clamp(1rem, 1.6vw, 1.3rem)' }}
                  >
                    {rel.title}
                  </h3>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/35">
                    {formatDate(rel.publishedAt)} · {rel.readingTime} min
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ══ NEWSLETTER ════════════════════════════════════════════════════ */}
        <NewsletterForm />

      </main>
    </>
  )
}
