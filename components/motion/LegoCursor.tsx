'use client'

import { useEffect } from 'react'

/**
 * Cursor "mano LEGO" hecho de partículas.
 *
 * La mano es una retícula de bloquecitos (la misma de la mano modelada en Blender:
 * marfil por dentro, contorno grafito). Cada bloque persigue su sitio con un resorte
 * propio: los cercanos a la punta del índice van pegados al puntero y los de la muñeca
 * se retrasan, así que al mover el ratón la mano se desarma en una estela que persigue
 * y, al parar, los resortes se asientan y se vuelve a armar sola.
 *
 * - Un único <canvas> fijo, sin eventos de puntero: nunca roba un clic.
 * - El cursor nativo ya lo oculta CustomCursor (data-cursor="on"); aquí solo se dibuja.
 * - Solo con puntero fino. Con movimiento reducido no se desarma (resorte rígido).
 * - El bucle se detiene cuando todo está en reposo y vuelve con el siguiente movimiento.
 */

// ── retícula de la mano (fila 0 = arriba) ───────────────────────────────────
function handCells() {
  const fill = new Set<string>()
  const add = (c: number, r: number) => fill.add(`${c},${r}`)
  for (let r = 1; r < 9; r++) { add(5, r); add(6, r) }          // índice
  for (let r = 5; r < 9; r++) { add(8, r); add(9, r) }          // corazón
  for (let r = 6; r < 9; r++) { add(11, r); add(12, r) }        // anular
  for (let r = 9; r < 14; r++) for (let c = 4; c < 13; c++) add(c, r)   // palma
  for (const r of [14, 15]) for (let c = 5; c < 12; c++) add(c, r)    // muñeca
  ;[[2, 9], [3, 9], [2, 10], [3, 10], [3, 11], [7, 8], [10, 8]].forEach(([c, r]) => add(c, r))

  const outline = new Set<string>()
  fill.forEach((k) => {
    const [c, r] = k.split(',').map(Number)
    ;[[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dc, dr]) => {
      const n = `${c + dc},${r + dr}`
      if (!fill.has(n)) outline.add(n)
    })
  })
  for (let r = 5; r < 8; r++) outline.add(`7,${r}`)            // separadores entre dedos
  for (let r = 6; r < 8; r++) outline.add(`10,${r}`)
  outline.forEach((k) => fill.delete(k))

  const cells: { c: number; r: number; dark: boolean }[] = []
  fill.forEach((k) => { const [c, r] = k.split(',').map(Number); cells.push({ c, r, dark: false }) })
  outline.forEach((k) => { const [c, r] = k.split(',').map(Number); cells.push({ c, r, dark: true }) })
  return cells
}

const S = 3.5                 // lado de un bloque (px CSS) — mano de ~53x61 px
const DEPTH = 1.35            // canto visible (volumen) hacia abajo-derecha
const TIP = { c: 5.5, r: 0.6 } // punta del índice = punto activo
const COLORS = {
  ivory: { face: '#EEE9DF', side: '#B9B1A4', stud: '#FFFFFF' },
  dark: { face: '#2A292D', side: '#0E0E10', stud: '#4A484E' },
}
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary, [data-cursor-hover]'

export function LegoCursor() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    if (!fine.matches) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    Object.assign(canvas.style, {
      position: 'fixed', inset: '0', width: '100vw', height: '100vh',
      pointerEvents: 'none', zIndex: '96',
    } as CSSStyleDeclaration)
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')!

    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
    }
    resize()

    // partículas: desplazamiento respecto a la punta, rigidez según distancia a la punta
    const parts = handCells().map((cell) => {
      const ox = (cell.c - TIP.c) * S
      const oy = (cell.r - TIP.r) * S
      const dist = Math.hypot(cell.c - TIP.c, cell.r - TIP.r)
      const t = Math.min(1, dist / 16)
      return {
        ...cell, ox, oy,
        x: -100, y: -100, vx: 0, vy: 0, rot: 0,
        // cerca de la punta: rígido; lejos: blando y con más amortiguación -> estela
        k: reduced ? 1 : 0.34 - t * 0.24 + Math.random() * 0.05,
        d: reduced ? 0 : 0.62 + t * 0.12 + Math.random() * 0.06,
        index: cell.c >= 4 && cell.c <= 7 && cell.r <= 8,
      }
    })
    // dibujar primero los de abajo-derecha para que el canto no tape caras vecinas
    parts.sort((a, b) => (a.r + a.c * 0.01) - (b.r + b.c * 0.01))

    const pointer = { x: -100, y: -100, seen: false, visible: true }
    let scale = 1, scaleTarget = 1, press = 0
    let raf = 0
    let sleeping = true
    let last = 0
    let acc = 0          // acumulador de subpasos de 60 Hz

    const wake = () => {
      if (sleeping) { sleeping = false; last = performance.now(); raf = requestAnimationFrame(tick) }
    }

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      if (!pointer.seen) {
        pointer.seen = true
        parts.forEach((p) => { p.x = pointer.x + p.ox; p.y = pointer.y + p.oy })
      }
      pointer.visible = true
      wake()
    }
    const onOver = (e: Event) => {
      const hit = (e.target as Element)?.closest?.(INTERACTIVE)
      scaleTarget = hit ? 1.12 : 1
      if ((e.target as Element)?.tagName === 'IFRAME') pointer.visible = false
      wake()
    }
    const onDown = () => { press = 1; wake() }
    const onLeave = () => { pointer.visible = false; wake() }
    const onEnter = () => { pointer.visible = true; wake() }

    function tick(now: number) {
      raf = 0
      // física por tiempo, no por fotograma: igual a 60, 120 o 144 Hz
      const f = Math.min(3, Math.max(0.25, (now - last) / 16.67))
      last = now
      acc += f
      const steps = Math.floor(acc)
      acc -= steps
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      scale += (scaleTarget - scale) * Math.min(1, 0.2 * f)
      press *= Math.pow(0.82, f)
      let energy = Math.abs(scaleTarget - scale) + press

      if (pointer.visible && pointer.seen) {
        for (const p of parts) {
          const tx = pointer.x + p.ox * scale
          const ty = pointer.y + p.oy * scale + (p.index ? press * 2.2 : 0)
          if (reduced) { p.x = tx; p.y = ty; p.vx = p.vy = 0 } else {
            // subpasos de 60 Hz: estable a cualquier frecuencia de pantalla
            for (let s = 0; s < steps; s++) {
              p.vx = (p.vx + (tx - p.x) * p.k) * p.d
              p.vy = (p.vy + (ty - p.y) * p.k) * p.d
              p.x += p.vx
              p.y += p.vy
            }
          }
          // cada bloque gira un poco según su velocidad: se nota que vuela suelto
          p.rot += ((reduced ? 0 : Math.max(-0.9, Math.min(0.9, p.vx * 0.06))) - p.rot) * 0.3
          energy += Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(tx - p.x) * 0.1 + Math.abs(ty - p.y) * 0.1

          const col = p.dark ? COLORS.dark : COLORS.ivory
          const s = S * scale
          ctx.save()
          ctx.translate(p.x, p.y)
          if (p.rot) ctx.rotate(p.rot)
          // canto (volumen)
          ctx.fillStyle = col.side
          ctx.fillRect(-s / 2 + DEPTH * 0.6, -s / 2 + DEPTH, s, s)
          // cara
          ctx.fillStyle = col.face
          ctx.fillRect(-s / 2, -s / 2, s - 0.4, s - 0.4)
          // stud
          ctx.fillStyle = col.stud
          ctx.beginPath()
          ctx.arc(-0.2, -0.3, s * 0.2, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }
      // en reposo total se duerme; el próximo evento lo despierta
      if (energy > 0.05 || !pointer.seen) raf = requestAnimationFrame(tick)
      else sleeping = true
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    window.addEventListener('blur', onLeave)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      window.removeEventListener('blur', onLeave)
      window.removeEventListener('resize', resize)
      canvas.remove()
    }
  }, [])

  return null
}
