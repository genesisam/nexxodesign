import { coverFor } from './covers'

/**
 * Las imágenes que /proyectos enseña de cada caso, en orden. Al pasar el ratón
 * a lo ancho de su fila se recorren de izquierda a derecha.
 */
export function piecesFor(slug: string, cmsCover?: string | null): string[] {
  const pieces = [coverFor(slug, '1x1'), cmsCover, coverFor(slug, '16x9')]
  return [...new Set(pieces.filter((p): p is string => !!p))]
}
