/**
 * El color de marca de cada proyecto: rellena su fila al pasar el ratón en
 * /proyectos y pinta las columnas de la transición al abrirlo. Sacados de la
 * propia marca (botones, acentos de la interfaz, señalética), no de la foto.
 */
const TONES: Record<string, string> = {
  'cornish-arquitectos': '#e6e3dc', // blanco piedra de su web en blanco y negro
  'greenery-420':        '#fccc3c', // amarillo de la tienda
  'maison-oliva':        '#d9442b', // rojo de la campaña
  'mente':               '#3d4af5', // azul de sus botones
  'merxo':               '#b4e6c9', // verde menta del dashboard
  'nbl':                 '#1e3264', // azul marino de la marca
  'nexo-go':             '#e2fb52', // lima de los botones de la app
  'solivus':             '#f97316', // naranja solar de la marca
}

/** Morado de Nexxo, para los proyectos sin color propio. */
export const DEFAULT_TONE = '#5b3df5'

export const toneFor = (slug: string) => TONES[slug] ?? DEFAULT_TONE

/** Texto que se lee encima de `hex`: tinta en los colores claros, papel en los oscuros. */
export function inkFor(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  const L = 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
  return L > 0.3 ? '#0E0E0E' : '#EFEBE3'
}
