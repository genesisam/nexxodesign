/**
 * Prices are in US dollars on a Colombian site, so the currency is spelled out
 * (US$29) rather than reduced to a bare $, which here reads as pesos.
 */
/**
 * What a card or a button shows. Two of the templates are free, and "US$0"
 * reads like a bug where "Gratis" reads like an offer.
 */
export function formatPrice(amount: number): string {
  return amount === 0 ? 'Gratis' : formatUSD(amount)
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
