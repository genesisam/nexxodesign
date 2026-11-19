/**
 * Lo mínimo para escribir encima de un color sin que deje de leerse.
 *
 * Vive aquí y no dentro de la vista del caso porque la lámina de paleta se
 * dibuja en cliente —en móvil cada muestra abre una hoja— y un componente de
 * cliente no puede importar de un archivo de servidor sin arrastrarlo entero.
 */

/** `#0B0C13` → `[11, 12, 19]`, para enseñar el valor también en RGB. */
export function aRgb(hex: string) {
  const h = hex.replace('#', '')
  const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  return [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16))
}

/**
 * ¿Es un color lo bastante claro como para escribir encima en negro?
 *
 * El corte está donde el blanco y el negro dan el mismo contraste. Sale de
 * igualar las dos razones de la fórmula de WCAG:
 *
 *   1,05 / (L + 0,05) = (L + 0,05) / 0,05   →   L = 0,179
 *
 * Estuvo puesto en 0,42, que es ojo y no cuenta, y por eso los verdes medios
 * de Merxo (L = 0,36) y Greenery se llevaban texto blanco: 2,5:1 cuando en
 * negro habrían dado 8:1.
 */
const CRUCE = 0.179

export function esClaro(hex: string) {
  const [r, g, b] = aRgb(hex).map(v => v / 255)
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) > CRUCE
}

/**
 * Blanco o negro sobre un color, según su luminancia.
 *
 * El valor tiene que leerse dentro de su propia muestra, y la paleta de un
 * proyecto lleva tonos muy claros y muy oscuros en la misma fila.
 */
export function legibleSobre(hex: string) {
  return esClaro(hex) ? 'rgba(0,0,0,0.86)' : 'rgba(255,255,255,0.97)'
}
