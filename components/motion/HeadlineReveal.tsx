'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

if (typeof window !== 'undefined') gsap.registerPlugin(SplitText)

/**
 * La misma entrada que los titulares de los casos (ProjectMotion): palabra a
 * palabra, subiendo desde una máscara. Se activa con atributos, sin envolver nada:
 *
 *   data-words      el titular entra palabra a palabra
 *   data-rise       entra con un fundido corto hacia arriba (subtítulos, eyebrows)
 *   data-delay="s"  retraso opcional en segundos
 *
 * Como en ProjectMotion: el estado oculto lo pone JS (nunca CSS) y cada elemento
 * tiene un vigilante; si a 1,5 s de estar en pantalla no se animó, se muestra igual.
 */
function whenSeen(el: Element, run: () => void, settle: () => void) {
  let timer = 0
  // Lo que ya está en pantalla al cargar (el titular de arriba) arranca sin esperar
  // al observador, y su vigilante es un temporizador: nunca depende de un evento.
  const r = el.getBoundingClientRect()
  if (r.top < window.innerHeight && r.bottom > 0) {
    const start = window.setTimeout(run, 0)
    timer = window.setTimeout(settle, 2600)
    return () => { window.clearTimeout(start); window.clearTimeout(timer) }
  }
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    io.disconnect()
    run()
    timer = window.setTimeout(settle, 1500)
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' })
  io.observe(el)
  return () => { io.disconnect(); window.clearTimeout(timer) }
}

export function HeadlineReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const main = document.querySelector('main')
    if (!main) return

    const stops: (() => void)[] = []
    const ctx = gsap.context(() => {})
    const seen = new WeakSet<Element>()

    const collect = () => {
      main.querySelectorAll<HTMLElement>('[data-words]').forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        const delay = parseFloat(el.dataset.delay ?? '0') || 0
        ctx.add(() => {
          let split: SplitText | undefined
          try {
            // líneas como máscara + palabras dentro: suben "desde debajo de la línea"
            split = new SplitText(el, { type: 'lines,words', linesClass: 'overflow-hidden pb-[0.08em] -mb-[0.08em]' })
          } catch {
            return
          }
          const words = split.words
          gsap.set(words, { yPercent: 110, opacity: 0 })
          const settle = () => { split?.revert() }
          stops.push(whenSeen(el, () => {
            gsap.to(words, {
              yPercent: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
              stagger: 0.055, delay, onComplete: settle,
            })
          }, settle))
        })
      })

      main.querySelectorAll<HTMLElement>('[data-rise]').forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        const delay = parseFloat(el.dataset.delay ?? '0') || 0
        ctx.add(() => {
          gsap.set(el, { y: 16, opacity: 0 })
          const settle = () => gsap.set(el, { opacity: 1, clearProps: 'transform' })
          stops.push(whenSeen(el, () => {
            gsap.to(el, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay, onComplete: settle })
          }, settle))
        })
      })
    }

    collect()
    const mo = new MutationObserver(collect)
    mo.observe(main, { childList: true, subtree: true })
    return () => {
      mo.disconnect()
      stops.forEach((s) => s())
      ctx.revert()
    }
  }, [])

  return null
}
