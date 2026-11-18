'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/**
 * The card image, drawn with WebGL so the cursor can push its pixels around.
 *
 * A 64×64 float texture holds an offset per cell. Each frame every offset
 * decays by 5%, and the cells within ~9 cells of the cursor get a kick in the
 * direction the cursor moved, strongest at the centre. The fragment shader
 * samples the image at `uv - 0.02 * offset`; nearest filtering is what turns
 * the smear into hard square blocks.
 *
 * The canvas is 110% of the frame's height so the parent can run a parallax
 * on it without exposing an edge. If WebGL is unavailable the plain <img>
 * underneath stays visible.
 */

const GRID   = 64
const RADIUS = 8.96
const R_SQ   = 80.2816
const DECAY  = 0.95
const FORCE  = 80
const DAMP   = 0.8

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const fragmentShader = /* glsl */ `
uniform sampler2D uTexture;
uniform sampler2D uDataTexture;
uniform vec4 resolution; // xy = quad size, zw = image size
varying vec2 vUv;

void main() {
  float quadAspect  = resolution.x / resolution.y;
  float imageAspect = resolution.z / resolution.w;
  vec2 ratio = quadAspect < imageAspect
    ? vec2(quadAspect / imageAspect, 1.0)
    : vec2(1.0, imageAspect / quadAspect);
  vec2 coverUV = (vUv - 0.5) * ratio + 0.5;
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, coverUV - 0.02 * offset.rg);
}`

type Props = {
  src: string
  /** The frame the cursor is measured against (the clipped image box). */
  frameRef: React.RefObject<HTMLElement | null>
}

/**
 * Through Next's image optimizer: same origin, so WebGL may read the pixels
 * (the Sanity CDN only answers CORS for the production domain), and resized.
 */
const optimized = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=1920&q=80`

export function PixelDistortion({ src: raw, frameRef }: Props) {
  const src  = optimized(raw)
  const host = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const frame = frameRef.current
    const el    = host.current
    if (!frame || !el) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return // no WebGL: the <img> fallback stays
    }
    renderer.setPixelRatio(2)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width   = '100%'
    renderer.domElement.style.height  = '100%'
    el.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1000, 1000)
    camera.position.z = 2

    const data = new Float32Array(GRID * GRID * 4)
    const dataTex = new THREE.DataTexture(data, GRID, GRID, THREE.RGBAFormat, THREE.FloatType)
    dataTex.magFilter = dataTex.minFilter = THREE.NearestFilter
    dataTex.needsUpdate = true

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture:     { value: null },
        uDataTexture: { value: dataTex },
        resolution:   { value: new THREE.Vector4() },
      },
      vertexShader,
      fragmentShader,
      precision: 'mediump',
    })
    const geometry = new THREE.PlaneGeometry(1, 1)
    scene.add(new THREE.Mesh(geometry, material))

    let imgW = 0, imgH = 0
    const resize = () => {
      const r = frame.getBoundingClientRect()
      const w = r.width, h = r.height * 1.1
      renderer.setSize(w, h, false)
      material.uniforms.resolution.value.set(w, h, imgW || w, imgH || h)
    }

    let texture: THREE.Texture | null = null
    let disposed = false
    new THREE.TextureLoader().setCrossOrigin('anonymous').load(src, tex => {
      if (disposed) { tex.dispose(); return }
      texture = tex
      imgW = (tex.image as HTMLImageElement).width
      imgH = (tex.image as HTMLImageElement).height
      material.uniforms.uTexture.value = tex
      resize()
      renderer.render(scene, camera)
      setReady(true)
      start()
    })

    // Cursor, sampled once per frame
    const P = { x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5, vX: 0, vY: 0 }
    let queued = false
    const onMove = (e: MouseEvent) => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        const r = frame.getBoundingClientRect()
        P.x = (e.clientX - r.left) / r.width
        P.y = (e.clientY - r.top) / r.height
        P.vX = P.x - P.prevX
        P.vY = P.y - P.prevY
        P.prevX = P.x
        P.prevY = P.y
      })
    }
    frame.addEventListener('mousemove', onMove, { passive: true })

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      for (let i = 0; i < data.length; i += 4) {
        data[i]     *= DECAY
        data[i + 1] *= DECAY
      }
      const gx = GRID * P.x
      const gy = GRID * (1 - P.y)
      for (let x = 0; x < GRID; x++) {
        const dx = gx - x
        for (let y = 0; y < GRID; y++) {
          const dy = gy - y
          const d2 = dx * dx + dy * dy
          if (d2 < R_SQ) {
            const idx = 4 * (x + GRID * y)
            const s = ((RADIUS - Math.sqrt(d2)) / RADIUS) * FORCE
            data[idx]     += s * P.vX
            data[idx + 1] -= s * P.vY
          }
        }
      }
      P.vX *= DAMP
      P.vY *= DAMP
      dataTex.needsUpdate = true
      renderer.render(scene, camera)
    }

    let visible = false
    const start = () => { if (!raf && visible && texture && !document.hidden) raf = requestAnimationFrame(tick) }
    const stop  = () => { cancelAnimationFrame(raf); raf = 0 }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start(); else stop()
    }, { rootMargin: '100px 0px', threshold: 0 })
    io.observe(frame)

    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)

    const ro = new ResizeObserver(resize)
    ro.observe(frame)

    return () => {
      disposed = true
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      frame.removeEventListener('mousemove', onMove)
      texture?.dispose()
      dataTex.dispose()
      material.dispose()
      geometry.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [src, frameRef])

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: ready ? 0 : 1 }}
      />
      <div ref={host} className="absolute inset-0" />
    </>
  )
}
