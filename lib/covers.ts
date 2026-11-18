/**
 * Portadas cinematográficas.
 *
 * Tres capas en cada una: una fotografía de escenario muy desenfocada y
 * oscurecida al fondo, la captura real del proyecto en una ventana, y una o
 * dos piezas de ladrillo construidas en Blender con la paleta y la rejilla de
 * studs del estudio 3D de /nosotros. Así la rejilla se lee como una colección
 * y no como ocho carpetas sueltas.
 *
 * Dos proporciones, porque el sitio usa dos encuadres: 16:9 donde la tarjeta
 * es apaisada y 1:1 donde es cuadrada. El 3:4 se retiró — estiraba la tarjeta
 * en móvil y obligaba a encoger la captura hasta dejarla ilegible.
 *
 * La portada del CMS se mantiene intacta y sigue sirviendo de respaldo para
 * cualquier proyecto que no esté en esta lista.
 */

export type CoverRatio = '16x9' | '1x1'

/** Los proyectos que ya tienen su juego compuesto en `public/images/projects`. */
const CON_PORTADA_CINEMATICA = new Set([
  'cornish-arquitectos',
  'greenery-420',
  'maison-oliva',
  'mente',
  'merxo',
  'nbl',
  'nexo-go',
  'solivus',
])

/**
 * La portada del proyecto en la proporción que pida quien la muestra.
 *
 * Devuelve `null` cuando el proyecto no tiene juego compuesto, para que quien
 * llama caiga en la portada del CMS en lugar de pedir un archivo que no está.
 */
export function coverFor(slug: string | undefined, ratio: CoverRatio): string | null {
  if (!slug || !CON_PORTADA_CINEMATICA.has(slug)) return null
  return `/images/projects/${slug}/cinematic/cover-${ratio}.webp`
}

/** `true` si el proyecto ya tiene portada compuesta. */
export function tienePortadaCinematica(slug: string | undefined): boolean {
  return !!slug && CON_PORTADA_CINEMATICA.has(slug)
}
