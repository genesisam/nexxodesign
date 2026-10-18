/**
 * Lemon Squeezy checkout, loaded only where something can be bought.
 *
 * The store is published before the Lemon Squeezy account is approved, so every
 * piece here is optional by design: a licence without a checkout URL sends the
 * buyer to the marketplace listing instead, and lemon.js is never loaded on a
 * page that has no checkout to open.
 */

export type LemonSqueezyCheckoutEvent = {
  event: string
  data?: Record<string, unknown>
}

type LemonSqueezySetup = {
  eventHandler?: (event: LemonSqueezyCheckoutEvent) => void
}

/**
 * Typed instead of `any`: lemon.js attaches these to window, and the overlay is
 * opened through Url.Open.
 */
declare global {
  interface Window {
    createLemonSqueezy?: () => void
    LemonSqueezy?: {
      Setup?: (options: LemonSqueezySetup) => void
      Url: { Open: (url: string) => void; Close?: () => void }
      Refresh?: () => void
    }
  }
}

export const LEMON_SCRIPT_SRC = 'https://app.lemonsqueezy.com/js/lemon.js'

/**
 * The checkout URL with what the overlay and the webhook need:
 * `embed=1` keeps the buyer on the page, and the custom field is what ties an
 * order back to a product when the webhook arrives.
 */
export function buildCheckoutUrl(checkoutUrl: string, productSlug: string, licenseName?: string): string {
  try {
    const url = new URL(checkoutUrl)
    url.searchParams.set('embed', '1')
    url.searchParams.set('checkout[custom][product_slug]', productSlug)
    if (licenseName) url.searchParams.set('checkout[custom][license]', licenseName)
    return url.toString()
  } catch {
    // A malformed URL in the CMS must not take the button down with it; the
    // caller opens it in a new tab, where the browser reports the problem.
    return checkoutUrl
  }
}

/** True when a licence can actually be bought here rather than on Framer. */
export function hasCheckout(license: { lemonCheckoutUrl?: string | null } | null | undefined): boolean {
  return !!license?.lemonCheckoutUrl?.trim()
}
