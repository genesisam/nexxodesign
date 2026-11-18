'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { spring, MOTION } from '@/lib/spring'

/**
 * The image to the left of the /proyectos index, drawn with one WebGL quad.
 *
 * A new project rises in as STEPS columns, each climbing from the bottom with
 * a small delay from right to left, so for a moment the edge is a staircase of
 * blocks. Switching image *within* a project uses the same mechanism with
 * every column at once: a plain wipe up.
 *
 * Unlike the home cards there is no pixel push under the pointer here: with
 * the list, the tone rows and the "Ver" tag, it was one effect too many.
 *
 * Without WebGL a plain <img> of the current piece stays visible.
 */

const STEPS = 5

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const fragmentShader = /* glsl */ `
uniform sampler2D uPrev;
uniform sampler2D uNext;
uniform vec2  uQuad;
uniform vec2  uPrevSize;
uniform vec2  uNextSize;
uniform float uSteps[${STEPS}];
uniform float uScale;
uniform float uHasPrev;
varying vec2 vUv;

vec2 cover(vec2 uv, vec2 img) {
  float qa = uQuad.x / uQuad.y;
  float ia = img.x / img.y;
  vec2 r = qa < ia ? vec2(qa / ia, 1.0) : vec2(1.0, ia / qa);
  return (uv - 0.5) * r + 0.5;
}

void main() {
  vec2 uv = vUv;

  int col = int(clamp(floor(vUv.x * ${STEPS}.0), 0.0, ${STEPS - 1}.0));
  float s = 0.0;
  for (int i = 0; i < ${STEPS}; i++) { if (i == col) s = uSteps[i]; }

  if (vUv.y < s) {
    vec2 n = (cover(uv, uNextSize) - 0.5) / uScale + 0.5;
    gl_FragColor = texture2D(uNext, n);
  } else if (uHasPrev > 0.5) {
    gl_FragColor = texture2D(uPrev, cover(uv, uPrevSize));
  } else {
    gl_FragColor = vec4(0.0);
  }
}`

/** Same-origin and resized, so WebGL may read the pixels. */
const optimized = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=1200&q=80`

export type StageChange = 'steps' | 'wipe' | 'instant'

type Props = {
  src: string
  /** How `src` arrives when it changes. */
  change: StageChange
}

export function WorkStage({ src, change }: Props) {
  const host   = useRef<HTMLDivElement>(null)
  const api    = useRef<{ show: (src: string, change: StageChange) => void } | null>(null)
  const [gl, setGl] = useState<boolean | null>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' })
    } catch {
      setGl(false)
      return
    }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    Object.assign(renderer.domElement.style, { display: 'block', width: '100%', height: '100%' })
    el.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10, 10)
    camera.position.z = 1

    const steps = new Array(STEPS).fill(1)
    const u = {
      uPrev:     { value: null as THREE.Texture | null },
      uNext:     { value: null as THREE.Texture | null },
      uQuad:     { value: new THREE.Vector2(1, 1) },
      uPrevSize: { value: new THREE.Vector2(1, 1) },
      uNextSize: { value: new THREE.Vector2(1, 1) },
      uSteps:    { value: steps },
      uScale:    { value: 1 },
      uHasPrev:  { value: 0 },
    }
    const material = new THREE.ShaderMaterial({ uniforms: u, vertexShader, fragmentShader })
    const geometry = new THREE.PlaneGeometry(1, 1)
    scene.add(new THREE.Mesh(geometry, material))

    const resize = () => {
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return
      renderer.setSize(r.width, r.height, false)
      u.uQuad.value.set(r.width, r.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    // ── Textures, loaded once each ──────────────────────────────────────────
    const loader = new THREE.TextureLoader()
    const cache  = new Map<string, Promise<THREE.Texture>>()
    const load = (url: string) => {
      let p = cache.get(url)
      if (!p) {
        // Left as raw sRGB on purpose: the custom shader writes the sampled
        // values straight out, so tagging the texture sRGB would decode it to
        // linear and the picture would come out darker than the file.
        p = new Promise((resolve, reject) => loader.load(optimized(url), resolve, undefined, reject))
        cache.set(url, p)
      }
      return p
    }
    const sizeOf = (t: THREE.Texture) => {
      const img = t.image as HTMLImageElement
      return new THREE.Vector2(img.width || 1, img.height || 1)
    }

    const reveal = spring(MOTION.reveal)
    const hero   = spring(MOTION.hero)
    const wipe   = spring(MOTION.smooth)
    let token = 0
    let tweens: gsap.core.Tween[] = []

    const show = async (url: string, how: StageChange) => {
      const mine = ++token
      let tex: THREE.Texture
      try { tex = await load(url) } catch { return }
      if (mine !== token || disposed) return

      tweens.forEach(t => t.kill())
      tweens = []

      // Whatever was arriving becomes the floor the new image climbs over.
      if (u.uNext.value) {
        u.uPrev.value = u.uNext.value
        u.uPrevSize.value.copy(u.uNextSize.value)
        u.uHasPrev.value = 1
      }
      u.uNext.value = tex
      u.uNextSize.value.copy(sizeOf(tex))
      setGl(true)

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (how === 'instant' || reduced) {
        steps.fill(1)
        u.uScale.value = 1
        return
      }

      steps.fill(0)
      if (how === 'wipe') {
        const p = { v: 0 }
        tweens.push(gsap.to(p, { v: 1, duration: wipe.duration, ease: wipe.ease, onUpdate: () => steps.fill(p.v) }))
        return
      }

      steps.forEach((_, i) => {
        const p = { v: 0 }
        tweens.push(gsap.to(p, {
          v: 1,
          delay: (STEPS - 1 - i) * 0.04,
          duration: reveal.duration,
          ease: reveal.ease,
          onUpdate: () => { steps[i] = p.v },
        }))
      })
      const s = { v: 1.06 }
      tweens.push(gsap.to(s, { v: 1, duration: 1.1, ease: hero.ease, onUpdate: () => { u.uScale.value = s.v } }))
      u.uScale.value = 1.06
    }
    api.current = { show }

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      renderer.render(scene, camera)
    }

    let visible = false
    let disposed = false
    const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick) }
    const stop  = () => { cancelAnimationFrame(raf); raf = 0 }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start(); else stop()
    }, { rootMargin: '100px 0px' })
    io.observe(el)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)

    return () => {
      disposed = true
      api.current = null
      stop()
      tweens.forEach(t => t.kill())
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      cache.forEach(p => p.then(t => t.dispose(), () => {}))
      material.dispose()
      geometry.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  useEffect(() => {
    api.current?.show(src, change)
    // `change` describes how this src arrives; it never triggers on its own.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  return (
    <>
      {gl !== true && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={optimized(src)} alt="" aria-hidden draggable={false}
             className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div ref={host} className="absolute inset-0" />
    </>
  )
}
