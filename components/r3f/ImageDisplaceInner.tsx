/**
 * ImageDisplaceInner — escena R3F interna.
 * Importado solo vía dynamic() desde ImageDisplace → nunca SSR.
 *
 * Shaders:
 *  Vertex: snap de UV a centro de celda → todos los vértices de la misma celda
 *          reciben el mismo desplazamiento Z (cubos con techo plano).
 *          Falloff suavizado + step a 3 niveles discretos.
 *  Fragment: UV-snap para muestreo de color plano por celda; brecha entre celdas
 *            fade con uHover; sombra en borde inferior simula cara lateral del cubo.
 *            En uHover=0 muestrea a resolución completa (idéntico al <img> bajo él).
 */

import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// ── GLSL ──────────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */`
uniform vec2  uMouse;
uniform float uHover;
uniform float uStrength;
uniform float uRadius;
uniform float uCells;

varying vec2  vUv;
varying float vDisplace;

void main() {
  vUv = uv;

  // Snap este vértice al centro de su celda.
  // Todos los vértices de la misma celda → mismo disp. Z → cubo de techo plano.
  float cs   = 1.0 / uCells;
  vec2  cell = floor(uv / cs) * cs + cs * 0.5;

  // UV y=0 es bottom; mouse y=0 es top → flip Y
  vec2  m    = vec2(uMouse.x, 1.0 - uMouse.y);
  float dist = distance(cell, m);

  // Falloff suave, luego step a 3 niveles para aspecto de cubo escalonado
  float raw   = 1.0 - smoothstep(0.0, uRadius, dist);
  float steps = floor(raw * 3.0) / 3.0;

  float disp  = steps * uStrength * uHover;
  vDisplace   = disp;

  gl_Position = projectionMatrix * modelViewMatrix
    * vec4(position + vec3(0.0, 0.0, disp), 1.0);
}
`

const fragmentShader = /* glsl */`
uniform sampler2D uTexture;
uniform float     uHover;
uniform float     uCells;

varying vec2  vUv;
varying float vDisplace;

void main() {
  float cs = 1.0 / uCells;

  // A uHover=0 → UV exacto (idéntico al <img> debajo).
  // A uHover=1 → UV snapped al centro de celda (1 color plano por cubo).
  vec2 cellUv   = floor(vUv / cs) * cs + cs * 0.5;
  vec2 sampleUv = mix(vUv, cellUv, uHover);
  vec4 tex      = texture2D(uTexture, sampleUv);

  // Posición local dentro de la celda [0..1]
  vec2  loc = fract(vUv * uCells);
  float gap = 0.07;

  // 1 = dentro de la cara del cubo; 0 = en la brecha
  // La brecha aparece / desaparece con uHover (fade in con hover)
  float face = step(gap, loc.x) * step(gap, loc.y)
             * step(loc.x, 1.0 - gap) * step(loc.y, 1.0 - gap);
  face = mix(1.0, face, uHover);

  // Sombra en borde inferior = cara lateral visible del cubo extruido
  float shade = (1.0 - loc.y) * vDisplace * 7.0;
  shade = clamp(shade, 0.0, 0.5) * uHover;

  vec3 surface  = tex.rgb * (1.0 - shade);
  // Color de la brecha: ink (#0E0E0E ≈ 0.055 en linear)
  vec3 gapColor = vec3(0.055);

  gl_FragColor  = vec4(mix(gapColor, surface, face), tex.a);
}
`

// ── Tipos compartidos ──────────────────────────────────────────────────────────

export type DisplaceSceneProps = {
  src:        string
  mouseRef:   React.MutableRefObject<{ x: number; y: number }>
  hoveredRef: React.MutableRefObject<boolean>
  invalidRef: React.MutableRefObject<() => void>
  cells:      number
  radius:     number
  strength:   number
}

// ── Mesh + shader ──────────────────────────────────────────────────────────────

function DisplaceMesh({ src, mouseRef, hoveredRef, invalidRef, cells, radius, strength }: DisplaceSceneProps) {
  const { viewport, invalidate } = useThree()
  const meshRef = useRef<THREE.Mesh>(null)

  // ── Registrar invalidate en el ref del padre ───────────────────────────
  useEffect(() => {
    invalidRef.current = invalidate
    return () => { invalidRef.current = () => {} }
  }, [invalidate, invalidRef])

  // ── Textura (Suspense-based via drei) ─────────────────────────────────
  const texture = useTexture(src)
  useEffect(() => {
    texture.minFilter  = THREE.LinearFilter
    texture.magFilter  = THREE.LinearFilter
    texture.needsUpdate = true
  }, [texture])

  // ── ShaderMaterial — creado una sola vez (no reconciliado por R3F) ─────
  const mat = useRef<THREE.ShaderMaterial | null>(null)
  if (!mat.current) {
    mat.current = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture:  { value: null },
        uMouse:    { value: new THREE.Vector2(0.5, 0.5) },
        uHover:    { value: 0 },
        uTime:     { value: 0 },
        uStrength: { value: strength },
        uRadius:   { value: radius },
        uCells:    { value: cells },
      },
    })
  }

  // Sincronizar textura y parámetros cuando cambian
  useEffect(() => {
    if (!mat.current) return
    mat.current.uniforms.uTexture.value  = texture
    mat.current.uniforms.uStrength.value = strength
    mat.current.uniforms.uRadius.value   = radius
    mat.current.uniforms.uCells.value    = cells
  }, [texture, strength, radius, cells])

  // ── Mouse lerpeado ─────────────────────────────────────────────────────
  const lerpedMouse = useRef(new THREE.Vector2(0.5, 0.5))

  // ── Frame loop con auto-invalidación ──────────────────────────────────
  useFrame((_, dt) => {
    const m   = mat.current
    if (!m) return

    const target = mouseRef.current
    const lm     = lerpedMouse.current
    lm.x += (target.x - lm.x) * Math.min(1, dt * 8)
    lm.y += (target.y - lm.y) * Math.min(1, dt * 8)

    const targetHover  = hoveredRef.current ? 1 : 0
    const currentHover = m.uniforms.uHover.value as number
    const newHover     = currentHover + (targetHover - currentHover) * Math.min(1, dt * 6)

    m.uniforms.uMouse.value.set(lm.x, lm.y)
    m.uniforms.uHover.value = newHover
    m.uniforms.uTime.value += dt

    // Perpetua el loop mientras haya animación pendiente
    const mouseMoving    = Math.abs(target.x - lm.x) + Math.abs(target.y - lm.y) > 0.001
    const hoverAnimating = Math.abs(newHover - targetHover) > 0.002
    if (hoveredRef.current || mouseMoving || hoverAnimating) {
      invalidate()
    }
  })

  // Viewport-sized plane — se actualiza en resize automáticamente
  const planeW = viewport.width
  const planeH = viewport.height

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeW, planeH, 64, 64]} />
      <primitive object={mat.current} attach="material" />
    </mesh>
  )
}

// ── Canvas wrapper ─────────────────────────────────────────────────────────────

export default function ImageDisplaceInner(props: DisplaceSceneProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 1], near: 0.01, far: 10 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <DisplaceMesh {...props} />
      </Suspense>
    </Canvas>
  )
}
