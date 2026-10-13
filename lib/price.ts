/**
 * Prices are in US dollars on a Colombian site, so the currency is spelled out
 * (US$29) rather than reduced to a bare $, which here reads as pesos.
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
