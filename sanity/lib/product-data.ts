import { MOCK_PRODUCTS } from '@/sanity/mock/products'
import { sanityClient } from '@/sanity/lib/client'
import { productsQuery, productBySlugQuery, allProductSlugsQuery } from '@/sanity/lib/queries'
import type { Product, ProductSummary } from '@/types/product'

/**
 * Same contract as post-data and project-data: try the CMS, fall back to the
 * fixtures. The store ships with no documents in Sanity at all, so here the
 * fallback is not a safety net — it is what renders the pages today.
 *
 * Ordering is decided here rather than trusted from either source, so the two
 * paths can never disagree about what comes first.
 */

const byOrder = (a: { order: number }, b: { order: number }) => (a.order ?? 0) - (b.order ?? 0)

const mockSummaries = (): ProductSummary[] =>
  MOCK_PRODUCTS.map(({
    description: _d, gallery: _g, features: _f, freeVsPro: _v,
    includes: _i, faq: _q, changelog: _c, bundleItems: _b, ...summary
  }) => summary).sort(byOrder)

export async function getAllProducts(): Promise<ProductSummary[]> {
  try {
    const rows = await sanityClient.fetch<ProductSummary[]>(productsQuery)
    if (rows?.length) return [...rows].sort(byOrder)
  } catch {
    // CMS unreachable — the fixtures still cover every rendered page.
  }
  return mockSummaries()
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const row = await sanityClient.fetch<Product | null>(productBySlugQuery, { slug })
    if (row) return row
  } catch {
    // fall through
  }
  return MOCK_PRODUCTS.find(p => p.slug.current === slug) ?? null
}

/**
 * Union of both sources, deduped, so a fixture-only product is still
 * prerendered and listed in the sitemap.
 */
export async function getAllProductSlugs(): Promise<string[]> {
  const mock = MOCK_PRODUCTS.map(p => p.slug.current)

  let cms: string[] = []
  try {
    const rows = await sanityClient.fetch<{ slug: string }[]>(allProductSlugsQuery)
    cms = rows?.map(r => r.slug).filter(Boolean) ?? []
  } catch {
    // fall through
  }

  return [...new Set([...cms, ...mock])]
}
