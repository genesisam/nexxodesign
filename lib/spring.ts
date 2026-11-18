/**
 * Curvas de resorte como `ease` de GSAP: el mismo modelo que usan las
 * animaciones de referencia (masa 1, sin rebote salvo que se pida). Devuelve
 * la duración real hasta el reposo para que la curva no se corte.
 */
export function spring({ duration = 0.5, bounce = 0 }: { duration?: number; bounce?: number } = {}) {
  const w = (2 * Math.PI) / duration
  const z = 1 - Math.max(-1, Math.min(bounce, 0.99))
  let f: (t: number) => number
  if (Math.abs(z - 1) < 1e-6) {
    f = t => 1 - (1 + w * t) * Math.exp(-w * t)
  } else if (z < 1) {
    const wd = w * Math.sqrt(1 - z * z)
    f = t => 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t))
  } else {
    const wd = w * Math.sqrt(z * z - 1), a = -z * w + wd, b = -z * w - wd
    f = t => 1 - (b * Math.exp(a * t) - a * Math.exp(b * t)) / (b - a)
  }
  let last = 0
  for (let t = 0; t < duration * 10; t += 1 / 240) if (Math.abs(1 - f(t)) > 5e-4) last = t
  const d = Math.ceil((last + 1 / 240) * 100) / 100
  return { duration: d, ease: (p: number) => (p >= 1 ? 1 : f(p * d)) }
}

export const MOTION = {
  smooth: { duration: 0.5,  bounce: 0 },
  reveal: { duration: 0.55, bounce: 0 },
  hero:   { duration: 0.62, bounce: 0 },
  page:   { duration: 0.42, bounce: 0 },
}
