import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllProducts, getAllProductSlugs, getProductBySlug } from '@/sanity/lib/product-data'
import { buildAlternates, absoluteUrl } from '@/lib/seo'
import { NexxoPortableText } from '@/components/portable-text'
import { ProductGallery } from '@/components/store/ProductGallery'
import { BuyPanel } from '@/components/store/BuyPanel'
import { Accordion } from '@/components/store/Accordion'
import { formatUSD } from '@/lib/price'
import {
  PRODUCT_GRADIENT, PRODUCT_TYPE_LABEL, fromPrice, type ProductSummary,
} from '@/types/product'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado — Nexxo' }

  const title = `${product.title} — Tienda Nexxo`

  return {
    title,
    description: product.tagline,
    alternates:  buildAlternates(locale, `/tienda/${slug}`),
    openGraph: {
      title,
      description: product.tagline,
      type:        'website',
      images: product.cover
        ? [{ url: product.cover, alt: product.title, width: 1200, height: 630 }]
        : undefined,
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const all     = await getAllProducts()
  const price   = fromPrice(product)
  const soon    = product.status === 'coming_soon'
  const url     = absoluteUrl(locale, `/tienda/${slug}`)

  // Related: the bundle this product belongs to first — it is the one upgrade
  // worth showing — then the rest of the catalogue.
  const bundle  = all.find(p => p.type === 'bundle' && p._id !== product._id)
  const related: ProductSummary[] = [
    ...(bundle ? [bundle] : []),
    ...all.filter(p => p._id !== product._id && p._id !== bundle?._id),
  ].slice(0, 3)

  // schema.org Product. One Offer per licence, which is how a search engine
  // reads a tiered price without inventing a range of its own.
  const offers = (product.licenses ?? []).map(license => ({
    '@type':        'Offer',
    name:           license.name,
    price:          license.price,
    priceCurrency:  'USD',
    availability:   soon ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock',
    url,
  }))

  const jsonLd = {
    '@context':   'https://schema.org',
    '@type':      'Product',
    name:         product.title,
    description:  product.tagline,
    url,
    category:     PRODUCT_TYPE_LABEL[product.type],
    image:        product.cover ? [product.cover] : undefined,
    brand:        { '@type': 'Brand', name: 'Nexxo' },
    offers: offers.length
      ? offers
      : price !== null
        ? [{ '@type': 'Offer', price, priceCurrency: 'USD', availability: soon ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock', url }]
        : undefined,
  }

  return (
    <main className="bg-ink min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ══ CABECERA ══════════════════════════════════════════════════════════ */}
      <section className="gutter-x pt-32 md:pt-40 pb-14 md:pb-20">
        <Link
          href="/tienda"
          className="inline-block font-mono text-[9px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper transition-colors duration-200 mb-10"
        >
          ← Tienda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-start">
          <ProductGallery product={product} />

          <div className="lg:sticky lg:top-28">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
                {PRODUCT_TYPE_LABEL[product.type]}
              </span>
              {(product.badge || soon) && (
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] bg-paper text-ink px-2.5 py-1">
                  {soon ? 'Próximamente' : product.badge}
                </span>
              )}
            </div>

            <h1
              className="font-display font-semibold text-paper leading-[0.95] tracking-[-0.04em] mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
            >
              {product.title}
            </h1>
            <p className="font-sans text-paper/70 text-[15px] leading-relaxed mb-8 max-w-[46ch]">
              {product.tagline}
            </p>

            {product.compareAtPrice && price !== null && (
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/45 mb-6">
                <span className="line-through">{formatUSD(product.compareAtPrice)}</span>
                <span className="text-paper/75 ml-2">Ahorras {formatUSD(product.compareAtPrice - price)}</span>
              </p>
            )}

            <BuyPanel product={product} />
          </div>
        </div>
      </section>

      {/* ══ DESCRIPCIÓN ═══════════════════════════════════════════════════════ */}
      {product.description?.length > 0 && (
        <section className="gutter-x py-14 md:py-20 border-t border-paper/10">
          <div className="max-w-[68ch]">
            <NexxoPortableText value={product.description} dark={true} />
          </div>
        </section>
      )}

      {/* ══ CARACTERÍSTICAS ═══════════════════════════════════════════════════ */}
      {product.features?.length > 0 && (
        <section className="gutter-x py-14 md:py-20 border-t border-paper/10">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/65 mb-10">
            Qué hace
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10" role="list">
            {product.features.map(feature => (
              <li key={feature._key ?? feature.title}>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display font-semibold text-paper text-[1.05rem] leading-tight tracking-[-0.02em]">
                    {feature.title}
                  </h2>
                  {feature.isPro && (
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-accent border border-accent/40 px-2 py-0.5">
                      Pro
                    </span>
                  )}
                </div>
                <p className="font-sans text-paper/60 text-[14px] leading-relaxed max-w-[46ch]">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ══ FREE VS PRO ═══════════════════════════════════════════════════════ */}
      {product.freeVsPro?.length > 0 && (
        <section className="gutter-x py-14 md:py-20 border-t border-paper/10">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/65 mb-10">
            Free vs Pro
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse">
              <caption className="sr-only">Comparación entre la versión gratis y la versión Pro</caption>
              <thead>
                <tr className="border-b border-paper/15">
                  <th scope="col" className="text-left font-mono text-[9px] uppercase tracking-[0.2em] text-paper/55 pb-4">Característica</th>
                  <th scope="col" className="text-left font-mono text-[9px] uppercase tracking-[0.2em] text-paper/55 pb-4 w-[22%]">Free</th>
                  <th scope="col" className="text-left font-mono text-[9px] uppercase tracking-[0.2em] text-accent pb-4 w-[22%]">Pro</th>
                </tr>
              </thead>
              <tbody>
                {product.freeVsPro.map(row => (
                  <tr key={row._key ?? row.feature} className="border-b border-paper/10">
                    <th scope="row" className="text-left font-sans font-normal text-paper/80 text-[14px] py-4 pr-6">{row.feature}</th>
                    <td className="font-sans text-paper/50 text-[14px] py-4">{row.free}</td>
                    <td className="font-sans text-paper text-[14px] py-4">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ══ INCLUYE + COMPATIBILIDAD ══════════════════════════════════════════ */}
      {(product.includes?.length > 0 || product.compatibility?.length > 0) && (
        <section className="gutter-x py-14 md:py-20 border-t border-paper/10 grid grid-cols-1 md:grid-cols-2 gap-12">
          {product.includes?.length > 0 && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/65 mb-8">
                Qué incluye
              </p>
              <ul className="flex flex-col gap-3" role="list">
                {product.includes.map(item => (
                  <li key={item} className="flex items-start gap-3 font-sans text-paper/75 text-[14px] leading-relaxed">
                    <span aria-hidden className="text-accent mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.compatibility?.length > 0 && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/65 mb-8">
                Compatibilidad
              </p>
              <ul className="flex flex-wrap gap-2" role="list">
                {product.compatibility.map(tag => (
                  <li key={tag} className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/70 border border-paper/15 px-3 py-2">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* ══ BUNDLE ════════════════════════════════════════════════════════════ */}
      {product.bundleItems?.length > 0 && (
        <section className="gutter-x py-14 md:py-20 border-t border-paper/10">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/65 mb-10">
            Qué trae el bundle
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
            {product.bundleItems.map(item => (
              <li key={item._id}>
                <Link href={`/tienda/${item.slug.current}`} className="group block">
                  <div
                    className="rounded-[1rem] aspect-[4/3] mb-4 overflow-hidden"
                    style={{ background: PRODUCT_GRADIENT[item.type] }}
                  />
                  <h3 className="font-display font-semibold text-paper text-[1rem] leading-tight group-hover:text-accent transition-colors duration-200 mb-1">
                    {item.title}
                  </h3>
                  <p className="font-sans text-paper/55 text-[13px] leading-relaxed line-clamp-2">
                    {item.tagline}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ══ FAQ ═══════════════════════════════════════════════════════════════ */}
      {product.faq?.length > 0 && (
        <section className="gutter-x py-14 md:py-20 border-t border-paper/10">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/65 mb-10">
            Preguntas
          </p>
          <Accordion items={product.faq} />
        </section>
      )}

      {/* ══ CHANGELOG ═════════════════════════════════════════════════════════ */}
      {product.changelog?.length > 0 && (
        <section className="gutter-x py-14 md:py-20 border-t border-paper/10">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/65 mb-10">
            Changelog
          </p>
          <ul className="divide-y divide-paper/10 border-t border-paper/10" role="list">
            {product.changelog.map(entry => (
              <li key={entry._key ?? entry.version} className="flex flex-col sm:flex-row gap-2 sm:gap-10 py-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper w-24 shrink-0">
                  {entry.version}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/45 w-28 shrink-0">
                  {entry.date ? formatDate(entry.date) : ''}
                </span>
                <span className="font-sans text-paper/70 text-[14px] leading-relaxed">
                  {entry.notes}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ══ RELACIONADOS ══════════════════════════════════════════════════════ */}
      {related.length > 0 && (
        <section className="gutter-x py-14 md:py-24 border-t border-paper/10 pb-28 md:pb-24">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/65 mb-10">
            También te puede interesar
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
            {related.map(item => {
              const itemPrice = fromPrice(item)
              return (
                <li key={item._id}>
                  <Link href={`/tienda/${item.slug.current}`} className="group block">
                    <div
                      className="rounded-[1.25rem] aspect-[16/9] mb-4 overflow-hidden"
                      style={{ background: PRODUCT_GRADIENT[item.type] }}
                    />
                    <h3 className="font-display font-semibold text-paper text-[1.05rem] leading-tight group-hover:text-accent transition-colors duration-200 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="font-sans text-paper/55 text-[13px] leading-relaxed line-clamp-2 mb-2">
                      {item.tagline}
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/70">
                      {item.status === 'coming_soon'
                        ? 'Próximamente'
                        : itemPrice !== null ? `Desde ${formatUSD(itemPrice)}` : 'Consultar'}
                    </p>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </main>
  )
}
