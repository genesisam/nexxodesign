/**
 * Una frase por proyecto para el pie de la imagen en /proyectos: qué es y para
 * quién, dicho en simple. El resumen largo del CMS se queda para el caso.
 */
const LINES: Record<string, string> = {
  'nbl':                 'La tienda de una marca de barba que quería verse tan cuidada como sus clientes.',
  'cornish-arquitectos': 'Un estudio de arquitectura con una web tan sobria como sus obras.',
  'solivus':             'Una plataforma para seguir plantas solares sin perderse entre datos.',
  'merxo':               'Un CRM que convierte el caos comercial en ventas predecibles.',
  'nexo-go':             'Una app para seguir y proteger tu bicicleta eléctrica desde el móvil.',
  'greenery-420':        'Una tienda online de CBD premium, hecha en Madrid.',
  'maison-oliva':        'Alta costura en Shopify, sin perder el ritual de comprarla.',
  'mente':               'Una fintech colombiana que adelanta el pago de tus facturas.',
  'tolvia':              'Una IA que conversa con voz natural.',
}

export const lineFor = (slug: string): string | undefined => LINES[slug]
