import type { PTContent } from '@/types/project'

/**
 * Products sold in the store: Framer code components, templates and bundles.
 *
 * Shaped like the Sanity schema from the start, the way projects and posts
 * already are, so the pages can be fed from the fixtures today and from the CMS
 * later without touching a component.
 */

export type ProductType   = 'component' | 'template' | 'bundle'
export type ProductStatus = 'available' | 'coming_soon'

/**
 * A licence tier. `lemonCheckoutUrl` is what decides how the buy button
 * behaves: with it the checkout opens in an overlay, without it the button
 * falls back to the marketplace listing. The store ships before the Lemon
 * Squeezy account is approved, so empty is the normal state, not an error.
 */
export type ProductLicense = {
  _key?:             string
  name:              string
  price:             number
  description:       string
  lemonCheckoutUrl?: string | null
}

export type ProductFeature   = { _key?: string; title: string; description: string; isPro: boolean }
export type FreeVsProRow     = { _key?: string; feature: string; free: string; pro: string }
export type ProductFaqItem   = { _key?: string; question: string; answer: string }
export type ChangelogEntry   = { _key?: string; version: string; date: string; notes: string }
export type ProductGalleryItem = { _key?: string; url: string; alt?: string | null }

/** List view — what a card needs, nothing heavier. */
export type ProductSummary = {
  _id:             string
  title:           string
  slug:            { current: string }
  type:            ProductType
  status:          ProductStatus
  tagline:         string
  cover:           string | null
  /** Short silent loop shown on hover. mp4/webm; no player library involved. */
  demoVideoUrl?:   string | null
  /** Kept for the day the demos move to Mux; nothing reads it yet. */
  muxPlaybackId?:  string | null
  price:           number | null
  compareAtPrice?: number | null
  compatibility:   string[]
  badge?:          string | null
  featured:        boolean
  order:           number
  fallbackBuyUrl:  string
  licenses:        ProductLicense[]
}

export type ProductBundleItem = Pick<
  ProductSummary,
  '_id' | 'title' | 'slug' | 'tagline' | 'cover' | 'type' | 'status' | 'price'
>

export type Product = ProductSummary & {
  description:     PTContent[]
  gallery:         ProductGalleryItem[]
  demoUrl?:        string | null
  freeVersionUrl?: string | null
  features:        ProductFeature[]
  freeVsPro:       FreeVsProRow[]
  includes:        string[]
  faq:             ProductFaqItem[]
  changelog:       ChangelogEntry[]
  bundleItems:     ProductBundleItem[]
}

/**
 * Placeholder behind a card with no cover yet, by product type. Same idea as
 * the journal's COVER_GRADIENT, same palette: ink base into the accent.
 */
export const PRODUCT_GRADIENT: Record<ProductType, string> = {
  component: 'linear-gradient(148deg, #0c0c1e 0%, #12112c 40%, #1c1050 72%, #5B3DF5 100%)',
  template:  'linear-gradient(148deg, #0a1018 0%, #101828 40%, #182840 72%, #2A5F8B 100%)',
  bundle:    'linear-gradient(148deg, #0d0814 0%, #1e0f38 40%, #2e1268 72%, #6B35C8 100%)',
}

export const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
  component: 'Componente',
  template:  'Template',
  bundle:    'Bundle',
}

/**
 * The number a card shows as "desde". Licences are the real prices; `price` is
 * only the fallback for a product that has none yet.
 */
export function fromPrice(product: Pick<ProductSummary, 'price' | 'licenses'>): number | null {
  const prices = (product.licenses ?? []).map(l => l.price).filter(p => typeof p === 'number')
  if (prices.length) return Math.min(...prices)
  return product.price ?? null
}
