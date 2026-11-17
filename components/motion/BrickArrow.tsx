'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Flecha hecha de piezas 1x1 con stud (el lenguaje del estudio 3D "Built by ideas").
 * Recorre el hueco entre el titular y el párrafo: avanza hacia la derecha, baja en
 * escalera y termina en una punta violeta que señala el texto.
 *
 * Entra pieza a pieza cuando el titular ya ha terminado de llegar. Como el resto de
 * entradas del sitio: el estado oculto lo pone JS y un temporizador la muestra
 * siempre, pase lo que pase con la animación.
 */

const CELL = 18                          // tamaño de una pieza en px
// [columna, fila] en orden de montaje
// sale arriba a la izquierda, baja en curva escalonada y termina en horizontal:
// la punta mira a la derecha, a la primera línea del párrafo
const SHAFT: [number, number][] = [
  [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
  [5, 1], [6, 1],
  [7, 2],
  [8, 3],
  [9, 4], [10, 4], [11, 4], [12, 4],
]
const HEAD: [number, number][] = [
  [13, 2], [13, 3], [13, 4], [13, 5], [13, 6],
  [14, 3], [14, 4], [14, 5],
  [15, 4],
]
const COLS = 16
const ROWS = 7

function Brick({ x, y, head }: { x: number; y: number; head?: boolean }) {
  const s = CELL - 2
  return (
    // la posición va en el grupo exterior; GSAP anima solo el interior (si no, su `y`
    // sustituiría al translate y todas las piezas acabarían en la misma fila)
    <g transform={`translate(${x * CELL + 1} ${y * CELL + 1})`}>
    <g data-brick>
      <rect width={s} height={s} rx={2.5}
        fill={head ? '#A694E8' : 'rgb(var(--color-paper-rgb) / 0.82)'} />
      {/* canto inferior: da volumen de pieza */}
      <rect y={s - 3} width={s} height={3} rx={1.5}
        fill={head ? '#7E6CC4' : 'rgb(var(--color-paper-rgb) / 0.5)'} />
      {/* stud */}
      <circle cx={s / 2} cy={s / 2 - 0.5} r={s * 0.27}
        fill={head ? '#B9AAF0' : 'rgb(var(--color-paper-rgb) / 1)'}
        stroke={head ? '#7E6CC4' : 'rgb(var(--color-ink-rgb) / 0.18)'} strokeWidth={1} />
    </g>
    </g>
  )
}

export function BrickArrow({ delay = 1.05, className = '' }: { delay?: number; className?: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const groups = Array.from(svg.querySelectorAll<SVGGElement>('[data-brick]'))
    const ctx = gsap.context(() => {
      gsap.set(groups, { opacity: 0, y: -14, scale: 0.6, transformOrigin: '50% 50%', transformBox: 'fill-box' })
      gsap.to(groups, {
        opacity: 1, y: 0, scale: 1, duration: 0.42, ease: 'back.out(2.2)',
        stagger: 0.045, delay,
      })
      // la punta "llama" con un pequeño golpe hacia el párrafo, de vez en cuando
      gsap.to(svg.querySelector('[data-head]'), {
        x: 5, duration: 0.35, ease: 'power2.out', yoyo: true, repeat: -1, repeatDelay: 2.6,
        delay: delay + 0.045 * groups.length + 0.6,
      })
    }, svg)
    // vigilante: visible pase lo que pase
    const t = window.setTimeout(() => gsap.set(groups, { opacity: 1, y: 0, scale: 1 }), (delay + 2.5) * 1000)
    return () => { window.clearTimeout(t); ctx.revert() }
  }, [delay])

  return (
    <svg
      ref={ref}
      aria-hidden
      width={COLS * CELL}
      height={ROWS * CELL}
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      className={className}
    >
      {SHAFT.map(([x, y], i) => <Brick key={`s${i}`} x={x} y={y} />)}
      <g data-head>
        {HEAD.map(([x, y], i) => <Brick key={`h${i}`} x={x} y={y} head />)}
      </g>
    </svg>
  )
}
