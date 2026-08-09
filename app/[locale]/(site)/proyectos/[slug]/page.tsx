import { notFound }          from 'next/navigation'
import Link                  from 'next/link'
import type { Metadata }     from 'next'
import { getTranslations }   from 'next-intl/server'
import type {
  Metric, ProjectPreview, Project,
  StoryBlock, OverviewBlock, SectionHeaderBlock,
  MediaBlock, SplitShowBlock, QuoteBlock, FeedbackBlock, SplitItem,
} from '@/types/project'
import { buildAlternates, absoluteUrl, SITE_URL } from '@/lib/seo'
import { getProjectBySlug, getAllProjectSlugs } from '@/sanity/lib/project-data'
import { MOCK_PROJECTS } from '@/sanity/mock/projects'
import { NexxoPortableText } from '@/components/portable-text'

// ─── ISR ─────────────────────────────────────────────────────────────────────
export const revalidate = 60

// ─── Params ──────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const project          = await getProjectBySlug(slug)
  if (!project) return { title: 'Proyecto — Nexxo' }

  const isEn = locale === 'en'
  const META = isEn ? SEO_META_EN : SEO_META
  const meta = META[slug]

  const title       = meta?.title       ?? `${project.title} — Diseño de Producto | Nexxo`
  const description = meta?.description ?? (isEn ? project.excerpt_en : undefined) ?? project.excerpt

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/proyectos/${slug}`),
    openGraph: {
      title,
      description,
      type:   'website',
      images: project.cover ? [{ url: project.cover, alt: project.title }] : [],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      project.cover ? [project.cover] : undefined,
    },
  }
}

// ─── SEO meta — ES ───────────────────────────────────────────────────────────

const SEO_META: Record<string, { title: string; description: string }> = {
  'solivus': {
    title:       'Solivus — UX para Software Industrial de Monitoreo Solar | Nexxo',
    description: 'Cómo diseñamos el dashboard y la app móvil de Solivus, plataforma AI de monitoreo solar. −47% tiempo de respuesta a alertas críticas.',
  },
  'merxo': {
    title:       'Merxo CRM — Diseño de Producto para Pipeline Comercial B2B | Nexxo',
    description: 'Diseñamos la marca y plataforma CRM de Merxo que convirtió el caos comercial en pipeline predecible. +280% velocidad de cierre en 90 días.',
  },
  'nexo-go': {
    title:       'Nexo Go — App IoT de Tracking para Bicicletas Eléctricas | Nexxo',
    description: 'Diseño de app móvil IoT de seguridad y tracking para bicicletas eléctricas. 0 robos reportados entre usuarios activos de Nexo Go.',
  },
  'greenery-420': {
    title:       'Greenery 420 CBD — E-commerce en Sector Regulado | Nexxo',
    description: 'E-commerce CBD premium para Greenery 420 Madrid. Diseño que cumple regulación y convierte: +185% vs benchmark wellness.',
  },
  'maison-oliva': {
    title:       'Maison Oliva — E-commerce de Alta Costura en Shopify | Nexxo',
    description: 'E-commerce editorial de alta costura en Shopify. Dirección de arte para Maison Oliva: diseño desktop y móvil con +240% tiempo en sitio.',
  },
  'tolvia': {
    title:       'Tolvia — IA Conversacional que Humaniza la Atención al Cliente | Nexxo',
    description: 'Diseñamos la marca, web, app desktop y audiovisual de Tolvia — la IA conversacional que automatiza el 87% de conversaciones con voz natural y contexto real.',
  },
}

// ─── SEO meta — EN ───────────────────────────────────────────────────────────

const SEO_META_EN: Record<string, { title: string; description: string }> = {
  'solivus': {
    title:       'Solivus — UX for Industrial Solar Monitoring Software | Nexxo',
    description: 'How we designed the Solivus dashboard and mobile app, an AI solar monitoring platform. −47% critical alert response time.',
  },
  'merxo': {
    title:       'Merxo CRM — Product Design for B2B Commercial Pipeline | Nexxo',
    description: 'We designed the Merxo brand and CRM platform that turned commercial chaos into predictable pipeline. +280% deal velocity in 90 days.',
  },
  'nexo-go': {
    title:       'Nexo Go — IoT Tracking App for Electric Bikes | Nexxo',
    description: 'IoT mobile app design for security and tracking of electric bikes. 0 thefts reported among active Nexo Go users.',
  },
  'greenery-420': {
    title:       'Greenery 420 CBD — E-commerce in a Regulated Sector | Nexxo',
    description: 'Premium CBD e-commerce for Greenery 420 Madrid. Design that meets regulation and converts: +185% vs wellness benchmark.',
  },
  'maison-oliva': {
    title:       'Maison Oliva — Haute Couture E-commerce on Shopify | Nexxo',
    description: 'Editorial haute couture e-commerce on Shopify. Art direction for Maison Oliva: desktop and mobile design with +240% time on site.',
  },
  'tolvia': {
    title:       'Tolvia — Conversational AI that Humanizes Customer Service | Nexxo',
    description: 'We designed the brand, website, desktop app and audiovisual assets for Tolvia — the conversational AI that automates 87% of conversations with natural voice and real context.',
  },
}

// ─── Contextual CTA — ES ─────────────────────────────────────────────────────

const CTA_DATA: Record<string, { label: string; heading: string }> = {
  'solivus':      { label: '¿Tu software industrial?', heading: 'Datos críticos merecen una interfaz que los haga entendibles.' },
  'merxo':        { label: '¿Tu equipo comercial?',    heading: 'Un CRM que tu equipo abandona no es un CRM. Es ruido caro.' },
  'nexo-go':      { label: '¿Tu app IoT?',             heading: 'La experiencia define si el hardware se usa o se olvida.' },
  'greenery-420': { label: '¿Tu e-commerce?',          heading: 'Sector regulado no es excusa para un diseño que no convierte.' },
  'maison-oliva': { label: '¿Tu marca?',               heading: 'Tu producto merece un e-commerce a su altura.' },
  'tolvia':       { label: '¿Tu atención al cliente?', heading: 'La IA que entiende el contexto es la que retiene al cliente.' },
}

const DEFAULT_CTA = { label: '¿Tu proyecto?', heading: 'Un resultado así te puede tocar.' }

// ─── Contextual CTA — EN ─────────────────────────────────────────────────────

const CTA_DATA_EN: Record<string, { label: string; heading: string }> = {
  'solivus':      { label: 'Your industrial software?', heading: 'Critical data deserves an interface that makes it understandable.' },
  'merxo':        { label: 'Your sales team?',          heading: "A CRM your team abandons isn't a CRM. It's expensive noise." },
  'nexo-go':      { label: 'Your IoT app?',             heading: 'The experience defines whether the hardware gets used or forgotten.' },
  'greenery-420': { label: 'Your e-commerce?',          heading: "A regulated sector is no excuse for a design that doesn't convert." },
  'maison-oliva': { label: 'Your brand?',               heading: 'Your product deserves an e-commerce at its level.' },
  'tolvia':       { label: 'Your customer service?',    heading: 'The AI that understands context is the one that keeps customers.' },
}

const DEFAULT_CTA_EN = { label: 'Your project?', heading: 'A result like this could be yours.' }

// ─── Design constants ─────────────────────────────────────────────────────────

const VERTICAL_BG: Record<string, string> = {
  SaaS:     'linear-gradient(148deg, #0c0c1e 0%, #12112c 40%, #1c1050 72%, #5B3DF5 100%)',
  Fintech:  'linear-gradient(148deg, #091410 0%, #0e1c17 40%, #0f2e24 72%, #1B6B5A 100%)',
  Web:      'linear-gradient(148deg, #16100c 0%, #241710 40%, #3a2114 72%, #C9A88F 100%)',
  Branding: 'linear-gradient(148deg, #0a0a0a 0%, #141414 40%, #222222 72%, #484848 100%)',
  IA:       'linear-gradient(148deg, #0d0814 0%, #1e0f38 40%, #2e1268 72%, #6B35C8 100%)',
}

const getBg = (vertical: string) => VERTICAL_BG[vertical] ?? VERTICAL_BG['SaaS']

// ─── Shared sub-components ────────────────────────────────────────────────────

function ResultsBar({ metrics }: { metrics: Metric[] }) {
  return (
    <section className="bg-ink px-6 md:px-16 lg:px-24 py-12 md:py-16 border-y border-line">
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:divide-x md:divide-line">
        {metrics.map((m, i) => (
          <div key={m._key} className={i > 0 ? 'md:pl-10' : ''}>
            <dd
              className="font-display font-semibold text-accent leading-none tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)' }}
            >
              {m.value}
            </dd>
            <dt className="font-mono text-smoke/60 text-[8.5px] uppercase tracking-[0.22em] mt-2.5">
              {m.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  )
}

function CtaSection({
  label, heading, ctaBtn, moreBtn,
}: {
  label: string; heading: string; ctaBtn: string; moreBtn: string
}) {
  return (
    <section className="bg-ink px-6 md:px-16 lg:px-24 py-20 md:py-28 border-t border-line">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <p className="font-mono text-smoke/55 text-[9px] uppercase tracking-[0.25em] mb-4">
            {label}
          </p>
          <h2
            className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 5.5rem)' }}
          >
            {heading}
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.22em] bg-accent text-paper px-8 py-4 hover:bg-accent/90 transition-colors duration-200"
          >
            {ctaBtn}
          </Link>
          <Link
            href="/proyectos"
            className="inline-flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.22em] border border-paper/20 text-paper/70 px-8 py-4 hover:border-paper/50 hover:text-paper transition-colors duration-200"
          >
            {moreBtn}
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Story block renderers ────────────────────────────────────────────────────

function OverviewRenderer({ block }: { block: OverviewBlock }) {
  const hasLeft = !!(block.label || block.heading)
  return (
    <section className="bg-ink px-6 md:px-16 lg:px-24 py-14 md:py-20">
      <div className={`grid gap-10 lg:gap-20 items-start ${hasLeft ? 'md:grid-cols-[1.4fr_1fr]' : ''}`}>
        {hasLeft && (
          <div className="md:pt-1">
            {block.label && (
              <p className="font-mono text-smoke/60 text-[9px] uppercase tracking-[0.25em] mb-4">
                {block.label}
              </p>
            )}
            {block.heading && (
              <h3
                className="font-display font-semibold text-paper leading-tight tracking-[-0.01em]"
                style={{ fontSize: 'clamp(1.25rem, 2vw, 1.9rem)' }}
              >
                {block.heading}
              </h3>
            )}
          </div>
        )}
        <div className="w-full">
          <NexxoPortableText value={block.body} dark />
          {block.link && (
            <a
              href={block.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/65 hover:text-accent mt-5 transition-colors duration-200"
            >
              {block.link.label} →
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

function SectionHeaderRenderer({ block }: { block: SectionHeaderBlock }) {
  return (
    <section className="bg-ink px-6 md:px-16 lg:px-24 pt-20 md:pt-28 pb-10 md:pb-14">
      <h2
        className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.04em] max-w-[16ch]"
        style={{ fontSize: 'clamp(2.8rem, 6vw, 6.5rem)' }}
      >
        {block.heading}
      </h2>
      {block.divider && (
        <div className="mt-8 md:mt-10 border-t border-line" />
      )}
    </section>
  )
}

function MediaRenderer({ block, bg }: { block: MediaBlock; bg: string }) {
  const isSmall = block.size === 'sm'
  return (
    <section className="bg-ink px-6 md:px-16 lg:px-24 py-5 md:py-8">
      <figure className={isSmall ? 'max-w-[75%]' : 'w-full'}>
        <div className="relative overflow-hidden rounded-[2rem]" style={{ aspectRatio: '16/9' }} data-parallax="media">
          {block.url ? (
            block.mediaType === 'video' ? (
              <video
                src={block.url}
                autoPlay muted loop playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={block.url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
            )
          ) : (
            <div className="w-full h-full" style={{ background: bg }} />
          )}
        </div>
        {block.caption && (
          <figcaption className="mt-4 font-mono text-smoke/65 text-[9px] uppercase tracking-[0.2em]">
            {block.caption}
          </figcaption>
        )}
      </figure>
    </section>
  )
}

function SplitItemCard({ item, bg }: { item: SplitItem; bg: string }) {
  const aspectRatio = item.size === 'sm' ? '1 / 1' : '100 / 128'
  return (
    <figure>
      <div
        className="relative overflow-hidden rounded-[2rem]"
        style={{ aspectRatio }}
      >
        {item.url ? (
          item.mediaType === 'video' ? (
            <video
              src={item.url}
              autoPlay muted loop playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              draggable={false}
            />
          )
        ) : (
          <div className="w-full h-full" style={{ background: bg }} />
        )}
      </div>
      {item.caption && (
        <figcaption className="mt-4 mb-4 font-mono text-smoke/70 text-[14px] leading-snug max-w-[88%]">
          {item.caption}
        </figcaption>
      )}
    </figure>
  )
}

function SplitShowRenderer({ block, bg }: { block: SplitShowBlock; bg: string }) {
  const leftItems  = block.items.filter((_, i) => i % 2 === 0)
  const rightItems = block.items.filter((_, i) => i % 2 !== 0)

  return (
    <section className="bg-ink px-6 md:px-16 lg:px-24 py-10 md:py-14">
      <div className="hidden md:grid grid-cols-2 gap-10 lg:gap-14">
        <div className="flex flex-col gap-10 lg:gap-14">
          {leftItems.map(item => <SplitItemCard key={item._key} item={item} bg={bg} />)}
        </div>
        <div className="flex flex-col gap-10 lg:gap-14 mt-20">
          {rightItems.map(item => <SplitItemCard key={item._key} item={item} bg={bg} />)}
        </div>
      </div>
      <div className="md:hidden flex flex-col gap-6">
        {block.items.map(item => <SplitItemCard key={item._key} item={item} bg={bg} />)}
      </div>
    </section>
  )
}

function QuoteRenderer({ block }: { block: QuoteBlock }) {
  return (
    <section className="bg-ink px-6 md:px-16 lg:px-24 py-16 md:py-24">
      <blockquote className="w-full max-w-4xl border-l-2 border-accent pl-8 md:pl-12">
        <p
          className="font-display font-semibold text-paper leading-[0.95] tracking-[-0.035em]"
          style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)' }}
        >
          {block.text}
        </p>
      </blockquote>
    </section>
  )
}

function FeedbackRenderer({ block, feedbackLabel }: { block: FeedbackBlock; feedbackLabel: string }) {
  return (
    <section className="bg-ink px-6 md:px-16 lg:px-24 py-14 md:py-20 border-t border-line">
      <div className="grid md:grid-cols-[0.85fr_2fr] gap-10 lg:gap-20 items-start">
        <div className="md:pt-1">
          <p className="font-mono text-smoke/60 text-[9px] uppercase tracking-[0.25em]">
            {feedbackLabel}
          </p>
        </div>
        <div>
          <p
            className="font-display font-semibold text-paper leading-[0.95] tracking-[-0.03em] mb-8 max-w-[52ch]"
            style={{ fontSize: 'clamp(1.25rem, 2.2vw, 2.1rem)' }}
          >
            "{block.quote}"
          </p>
          <p className="font-mono text-smoke/65 text-[9px] uppercase tracking-[0.2em]">
            {block.name} · {block.role}{block.company ? `, ${block.company}` : ''}
          </p>
          {block.link && (
            <a
              href={block.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/65 hover:text-accent mt-5 transition-colors duration-200"
            >
              {block.link.label} →
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

function StoryBlockRenderer({
  block, bg, feedbackLabel,
}: {
  block: StoryBlock; bg: string; feedbackLabel: string
}) {
  switch (block._type) {
    case 'overview':      return <OverviewRenderer      block={block} />
    case 'sectionHeader': return <SectionHeaderRenderer block={block} />
    case 'media':         return <MediaRenderer         block={block} bg={bg} />
    case 'splitShow':     return <SplitShowRenderer     block={block} bg={bg} />
    case 'quote':         return <QuoteRenderer         block={block} />
    case 'feedback':      return <FeedbackRenderer      block={block} feedbackLabel={feedbackLabel} />
    default:              return null
  }
}

// ─── Siguiente proyecto ───────────────────────────────────────────────────────

function NextProjectSection({
  next, nextLabel, backLabel,
}: {
  next: ProjectPreview; nextLabel: string; backLabel: string
}) {
  const bg = getBg(next.vertical)
  return (
    <section className="bg-ink px-6 md:px-16 lg:px-24 py-16 md:py-20 border-t border-line">
      <p className="font-mono text-smoke/55 text-[9px] uppercase tracking-[0.25em] mb-8">
        {nextLabel}
      </p>

      <Link
        href={`/proyectos/${next.slug.current}`}
        className="group inline-flex items-end gap-6 md:gap-10"
      >
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ width: 'clamp(80px, 12vw, 160px)', aspectRatio: '3/4' }}
          aria-hidden
        >
          {next.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={next.cover}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full" style={{ background: bg }} />
          )}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'rgba(14,14,14,0.35)' }}
          />
        </div>

        <h3
          className="font-display font-semibold text-paper/60 group-hover:text-paper transition-colors duration-300 leading-[0.9] tracking-[-0.04em] pb-1"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 6.5rem)' }}
        >
          {next.title}
          <span className="text-smoke/55 group-hover:text-accent transition-colors duration-300"> →</span>
        </h3>
      </Link>

      <div className="mt-10">
        <Link
          href="/proyectos"
          className="font-mono text-smoke/55 hover:text-paper text-[9px] uppercase tracking-[0.22em] transition-colors duration-200"
        >
          {backLabel}
        </Link>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CaseStudyPage({ params }: Props) {
  const { slug, locale } = await params
  const project: Project | null = await getProjectBySlug(slug)
  if (!project) notFound()

  const isEn = locale === 'en'
  const t    = await getTranslations('proyectos')

  // EN resolution order: Sanity first, then the mock, then the Spanish field.
  // Sanity now carries the `_en` fields, so the CMS is the source of truth and
  // the mock is only a fallback for the projects that predate it. A project
  // translated only halfway still renders — untranslated fields show Spanish.
  const enMock = isEn ? (MOCK_PROJECTS.find(p => p.slug.current === slug) ?? null) : null

  const subtitle = (isEn ? project.subtitle_en ?? enMock?.subtitle_en : null) ?? project.subtitle
  const excerpt  = (isEn ? project.excerpt_en  ?? enMock?.excerpt_en  : null) ?? project.excerpt
  const metrics  = (isEn ? project.metrics_en  ?? enMock?.metrics_en  : null) ?? project.metrics
  const story    = (isEn ? project.story_en    ?? enMock?.story_en    : null) ?? project.story

  const bg = getBg(project.vertical)

  const ctaMap  = isEn ? CTA_DATA_EN : CTA_DATA
  const ctaData = ctaMap[slug] ?? (isEn ? DEFAULT_CTA_EN : DEFAULT_CTA)

  // JSON-LD — Quick Win #5
  const jsonLd = {
    '@context':    'https://schema.org',
    '@type':       'CreativeWork',
    name:          project.title,
    description:   excerpt,
    url:           absoluteUrl(locale, `/proyectos/${project.slug.current}`),
    image:         project.cover ?? undefined,
    // `year` is optional in the Sanity schema — guard it, or a project saved
    // without one throws and takes down the whole case study page.
    ...(project.year != null && { dateCreated: project.year.toString() }),
    keywords:      [project.vertical, 'automatización IA', 'diseño de producto', 'UX/UI', 'Nexxo'].join(', '),
    creator: {
      '@type': 'Organization',
      name:    'Nexxo',
      url:     SITE_URL,
    },
    ...(metrics && metrics.length > 0 && {
      comment: metrics.map(m => `${m.label}: ${m.value}`).join(' · '),
    }),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio',    item: absoluteUrl(locale) },
      { '@type': 'ListItem', position: 2, name: 'Proyectos', item: absoluteUrl(locale, '/proyectos') },
      { '@type': 'ListItem', position: 3, name: project.title },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <main>

      {/* ── 1. Tophead ─────────────────────────────────────────────────────── */}
      <section className="bg-ink px-6 md:px-16 lg:px-24 pt-32 md:pt-44 pb-12 md:pb-16 flex flex-col items-center text-center">

        {/* Breadcrumb visual */}
        <nav aria-label="Breadcrumb" className="absolute top-[5.5rem] left-6 md:left-16 lg:left-24">
          <ol className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-paper/55">
            <li><Link href={`/${locale}`} className="hover:text-paper/60 transition-colors">Inicio</Link></li>
            <li aria-hidden className="text-paper/15">›</li>
            <li><Link href={`/${locale}/proyectos`} className="hover:text-paper/60 transition-colors">{t('volver').replace('← Volver a ', '')}</Link></li>
            <li aria-hidden className="text-paper/15">›</li>
            <li className="text-paper/70">{project.title}</li>
          </ol>
        </nav>

        <p className="font-mono text-smoke/60 text-[9px] uppercase tracking-[0.28em] mb-7">
          {/* Every part is optional in the schema — join only what exists so a
              missing field doesn't leave a dangling separator. */}
          {[project.client, project.year, project.vertical, project.timeline]
            .filter(Boolean)
            .join(' · ')}
        </p>

        <h1
          className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(4rem, 11vw, 11rem)' }}
        >
          {project.title}
        </h1>

        {subtitle && (
          <p
            className="font-display font-light text-paper/70 leading-tight tracking-[-0.025em] mt-5 md:mt-7 max-w-[56ch]"
            style={{ fontSize: 'clamp(1.3rem, 2.8vw, 2.6rem)' }}
          >
            {subtitle}
          </p>
        )}

        <p
          className="font-sans text-paper/55 leading-relaxed mt-6 md:mt-8 max-w-[72ch]"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
        >
          {excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-7 md:mt-9">
          {project.services.map(s => (
            <span
              key={s}
              className="font-mono text-paper/65 text-[8px] uppercase tracking-[0.2em] border border-paper/15 px-3 py-1.5"
            >
              {s}
            </span>
          ))}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-accent text-[8px] uppercase tracking-[0.2em] border border-accent/40 px-3 py-1.5 hover:border-accent transition-colors duration-200"
            >
              {t('verSitio')}
            </a>
          )}
        </div>
      </section>

      {/* ── 2. Preview cover ───────────────────────────────────────────────── */}
      <section className="bg-ink px-6 md:px-16 lg:px-24 pb-14 md:pb-20">
        <div
          className="relative overflow-hidden rounded-[2rem]"
          style={{ aspectRatio: '16/9' }}
          data-parallax="cover"
        >
          {project.heroMedia ? (
            <video
              src={project.heroMedia}
              autoPlay muted loop playsInline
              className="w-full h-full object-cover"
            />
          ) : project.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover}
              alt={project.title}
              className="w-full h-full object-cover"
              fetchPriority="high"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full" style={{ background: bg }} />
          )}
        </div>
      </section>

      {/* ── 3. Results bar ─────────────────────────────────────────────────── */}
      {metrics && metrics.length > 0 && (
        <ResultsBar metrics={metrics} />
      )}

      {/* ── 4. Story blocks ────────────────────────────────────────────────── */}
      {story.length > 0 && (
        <div className="bg-ink">
          {story.map(block => (
            <StoryBlockRenderer
              key={block._key}
              block={block}
              bg={bg}
              feedbackLabel={t('feedbackLabel')}
            />
          ))}
        </div>
      )}

      {/* ── 5. Next project ────────────────────────────────────────────────── */}
      {project.nextProject && (
        <NextProjectSection
          next={project.nextProject}
          nextLabel={t('siguienteLabel')}
          backLabel={t('volver')}
        />
      )}

      {/* ── 6. CTA final ───────────────────────────────────────────────────── */}
      <CtaSection
        label={ctaData.label}
        heading={ctaData.heading}
        ctaBtn={t('cotiza')}
        moreBtn={t('verMas')}
      />

    </main>
    </>
  )
}
