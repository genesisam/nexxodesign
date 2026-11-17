'use client'

/**
 * Escena 3D del estudio Nexxo — "Built by ideas".
 *
 * Recursos en /public/3d (generados desde el proyecto Blender nexxo-built-by-ideas):
 *  - nexxo_studio.glb          nodos individuales + clips de interacción (desktop)
 *  - nexxo_studio_static.glb   reposo fusionado por material (móvil / movimiento reducido)
 *  - nexxo_intro_tracks.json   intro de montaje pieza a pieza (espacio local, glTF Y-up)
 *  - nexxo_manifest.json       cámaras, interacciones, luces de referencia
 *
 * El componente no pinta texto: la capa HTML (NexxoEstudio) recibe el estado por callbacks.
 */
import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

export type EstudioId = 'notebook' | 'computer' | 'bricks' | 'lamp'
export type EstudioPhase = 'loading' | 'intro' | 'home' | 'opening' | 'open' | 'returning'

type Pose = { eye: THREE.Vector3; target: THREE.Vector3; lens: number }
type Interactive = { collider: string; camera: string; root: string; open: string; close: string }
type Manifest = {
  cameras: Record<string, { eye_gltf: number[]; poi_gltf: number[]; lens_mm: number }>
  interactive: Record<string, Interactive>
}
type IntroKey = { f: number; p: number[]; q: number[]; s?: number[]; ease: string }
type IntroData = {
  fps: number
  frames: number
  camera: { hold: number[]; move: number[]; from: { eye: number[]; target: number[] }; to: { eye: number[]; target: number[] } }
  tracks: { node: string; keys: IntroKey[] }[]
}

const KEY: Record<EstudioId, string> = {
  notebook: 'INTERACTIVE_NOTEBOOK',
  computer: 'INTERACTIVE_COMPUTER',
  bricks: 'INTERACTIVE_BRICKS',
  lamp: 'INTERACTIVE_LAMP',
}
const ID_OF: Record<string, EstudioId> = Object.fromEntries(
  Object.entries(KEY).map(([k, v]) => [v, k as EstudioId]),
)
const BG = '#0E0E0E'
const DRACO = '/3d/draco/'

export type SceneProps = {
  src: string
  manifest: Manifest
  intro: IntroData | null          // null = sin intro (móvil / movimiento reducido)
  request: { id: EstudioId | null; n: number }   // petición de la capa HTML
  replay: number
  reducedMotion: boolean
  onPhase: (phase: EstudioPhase, id: EstudioId | null) => void
  onHover: (id: EstudioId | null) => void
  phase: EstudioPhase
  hoverExternal: EstudioId | null    // hover sobre los botones HTML -> eleva el objeto
  visited: EstudioId[]
  hint: string | null                // "Empieza aquí" sobre el primer objeto
  labels: Record<EstudioId, string>
  freeLook: boolean                  // parallax + arrastre limitado (solo desktop)
}

const ORDER: EstudioId[] = ['notebook', 'computer', 'bricks', 'lamp']

/* ─────────────────────────────── utilidades ─────────────────────────────── */
function lensToVFov(lens: number, aspect: number) {
  // Blender: sensor 36 mm con ajuste automático al lado mayor
  if (aspect >= 1) {
    const h = 2 * Math.atan(18 / lens)
    return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(h / 2) / aspect))
  }
  return THREE.MathUtils.radToDeg(2 * Math.atan(18 / lens))
}

function poseOf(manifest: Manifest, name: string, portrait: boolean): Pose {
  const c = manifest.cameras[portrait ? `${name}_MOBILE` : name] ?? manifest.cameras[name]
  return {
    eye: new THREE.Vector3(...(c.eye_gltf as [number, number, number])),
    target: new THREE.Vector3(...(c.poi_gltf as [number, number, number])),
    lens: c.lens_mm,
  }
}

/* ─────────────────────────────── escena ─────────────────────────────────── */
function Studio(props: SceneProps) {
  const { src, manifest, intro, request, replay, reducedMotion, onPhase, onHover, phase, hoverExternal, visited, hint, labels, freeLook } = props
  const gltf = useGLTF(src, DRACO)
  const { camera, size, gl } = useThree()
  const persp = camera as THREE.PerspectiveCamera
  const portrait = size.width < size.height

  const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), [gltf.scene])
  const clips = useMemo(
    () => Object.fromEntries(gltf.animations.map((c) => [c.name, c])),
    [gltf.animations],
  )

  // nodos clave
  const nodes = useMemo(() => {
    const colliders: THREE.Mesh[] = []
    const ink: THREE.Object3D[] = []
    gltf.scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        if (o.name.startsWith('COLLIDER_') || o.userData.nx_collider) {
          m.material = new THREE.MeshBasicMaterial({ visible: false })
          colliders.push(m)
        } else if (o.name === 'ENV_GROUND') {
          // suelo exterior = captador de sombras: el fondo de la página se ve a través
          m.material = new THREE.ShadowMaterial({ opacity: 0.45 })
          m.receiveShadow = true
          m.castShadow = false
        } else {
          m.castShadow = true
          m.receiveShadow = true
        }
      }
      if (o.name.startsWith('NB_SK_') && o.userData.nx_style && o.userData.nx_style !== 'guide') ink.push(o)
    })
    ink.sort((a, b) => a.name.localeCompare(b.name))
    const roots = Object.fromEntries(
      Object.entries(manifest.interactive).map(([k, v]) => [k, gltf.scene.getObjectByName(v.root) ?? null]),
    ) as Record<string, THREE.Object3D | null>
    const rootY = Object.fromEntries(Object.entries(roots).map(([k, r]) => [k, r?.position.y ?? 0]))
    const screen = gltf.scene.getObjectByName('SCREEN_SURFACE') as THREE.Mesh | undefined
    const bulb = gltf.scene.getObjectByName('LAMP_BULB')
    // anclas de los marcadores: sobre el centro superior de cada collider (reposo)
    gltf.scene.updateMatrixWorld(true)
    const anchors = {} as Record<EstudioId, THREE.Vector3>
    for (const m of colliders) {
      const key = Object.entries(manifest.interactive).find(([, v]) => v.collider === m.name)?.[0]
      const id = key ? ID_OF[key] : undefined
      if (!id) continue
      const box = new THREE.Box3().setFromObject(m)
      const c = box.getCenter(new THREE.Vector3())
      // el cuaderno es plano: su marcador va pegado a las páginas y un poco hacia delante
      anchors[id] = id === 'notebook'
        ? new THREE.Vector3(c.x, box.max.y + 0.02, c.z + 0.15)
        : new THREE.Vector3(c.x, box.max.y + 0.18, c.z)
    }
    return { colliders, ink, roots, rootY, screen, bulb, anchors }
  }, [gltf.scene, manifest])

  // pantalla: emisiva marfil, apagada en reposo (el frontend puede poner un vídeo aquí)
  useEffect(() => {
    const m = nodes.screen?.material as THREE.MeshStandardMaterial | undefined
    if (!m) return
    m.emissive = new THREE.Color('#EFEBE3')
    m.emissiveIntensity = 0
  }, [nodes.screen])

  // tinta oculta en reposo
  useEffect(() => { nodes.ink.forEach((o) => { o.visible = false }) }, [nodes.ink])

  // foco de la lámpara colgado de la bombilla
  const lampRef = useRef<THREE.SpotLight>(null)
  const lampTarget = useMemo(() => new THREE.Object3D(), [])
  useEffect(() => {
    const L = lampRef.current
    if (!L || !nodes.bulb) return
    nodes.bulb.add(L)
    L.position.set(0, 0, 0)
    L.target = lampTarget
    return () => { nodes.bulb?.remove(L) }
  }, [nodes.bulb, lampTarget])

  /* ── estado del controlador ── */
  const ctl = useRef({
    phase: 'loading' as EstudioPhase,
    active: null as EstudioId | null,
    hover: null as EstudioId | null,
    tween: null as null | { a: Pose; b: Pose; t: number; dur: number },
    pose: poseOf(manifest, 'CAM_HOME', portrait),
    introT: -1,               // segundos de intro; -1 = inactiva
    action: null as THREE.AnimationAction | null,
    timers: [] as ReturnType<typeof setTimeout>[],
    queued: null as EstudioId | null,   // historia siguiente (botón Siguiente)
  })

  const setPhase = (p: EstudioPhase, id: EstudioId | null = ctl.current.active) => {
    ctl.current.phase = p
    onPhase(p, id)
  }

  const applyPose = (p: Pose) => {
    persp.position.copy(p.eye)
    persp.lookAt(p.target)
    persp.fov = lensToVFov(p.lens, size.width / size.height)
    persp.updateProjectionMatrix()
    ctl.current.pose = p
  }

  const goTo = (name: string, dur: number) => {
    const b = poseOf(manifest, name, portrait)
    if (!portrait && name !== 'CAM_HOME') {
      // desktop: el objeto a la derecha del encuadre, el texto HTML a la izquierda
      const aspect = size.width / size.height
      b.eye.sub(b.target).multiplyScalar(1.35).add(b.target)   // más aire en la franja panorámica
      const fwd = b.target.clone().sub(b.eye)
      const dist = fwd.length()
      const right = fwd.normalize().cross(new THREE.Vector3(0, 1, 0)).normalize()
      const halfW = dist * Math.tan(THREE.MathUtils.degToRad(lensToVFov(b.lens, aspect)) / 2) * aspect
      const shift = right.multiplyScalar(-halfW * 0.32)
      b.eye.add(shift)
      b.target.add(shift)
    } else if (portrait && name !== 'CAM_HOME') {
      // móvil: el panel HTML va abajo, el objeto sube al tercio superior
      const fwd = b.target.clone().sub(b.eye)
      const dist = fwd.length()
      const right = fwd.clone().normalize().cross(new THREE.Vector3(0, 1, 0)).normalize()
      const up = right.clone().cross(fwd.normalize()).normalize()
      const halfH = dist * Math.tan(THREE.MathUtils.degToRad(lensToVFov(b.lens, size.width / size.height)) / 2)
      const shift = up.multiplyScalar(-halfH * 0.38)
      b.eye.add(shift)
      b.target.add(shift)
    }
    if (reducedMotion) { applyPose(b); return }
    ctl.current.tween = { a: { ...ctl.current.pose, eye: ctl.current.pose.eye.clone(), target: ctl.current.pose.target.clone() }, b, t: 0, dur }
  }

  const play = (name: string) => {
    const clip = clips[name]
    if (!clip) return 0
    const next = mixer.clipAction(clip)
    next.reset()
    next.setLoop(THREE.LoopOnce, 1)
    next.clampWhenFinished = true
    if (reducedMotion) next.time = clip.duration
    next.play()
    if (ctl.current.action && ctl.current.action !== next) ctl.current.action.stop()
    ctl.current.action = next
    return reducedMotion ? 0 : clip.duration
  }

  const clearTimers = () => { ctl.current.timers.forEach(clearTimeout); ctl.current.timers = [] }
  const later = (ms: number, fn: () => void) => { ctl.current.timers.push(setTimeout(fn, ms)) }

  const screenTo = (v: number, dur: number) => {
    const m = nodes.screen?.material as THREE.MeshStandardMaterial | undefined
    if (m) gsap.to(m, { emissiveIntensity: v, duration: reducedMotion ? 0 : dur, ease: 'sine.inOut' })
  }

  const open = (id: EstudioId) => {
    const c = ctl.current
    if ((c.phase === 'open' || c.phase === 'opening') && c.active && c.active !== id) {
      c.queued = id            // cerrar la actual y abrir la siguiente
      close()
      return
    }
    if (c.phase !== 'home') return
    resetOrbit()               // el viaje parte de la vista actual; la órbita vuelve a cero
    const it = manifest.interactive[KEY[id]]
    clearTimers()
    c.active = id
    setPhase('opening', id)
    goTo(it.camera, 1.6)
    const d = play(it.open)
    if (id === 'notebook') {
      const n = nodes.ink.length
      nodes.ink.forEach((o, i) => later(reducedMotion ? 0 : 730 + (i * 1650) / n, () => { o.visible = true }))
    }
    if (id === 'computer') screenTo(1, 0.6)
    if (id === 'lamp' && lampRef.current) gsap.to(lampRef.current, { intensity: LAMP_I * 1.35, duration: reducedMotion ? 0 : 2 })
    later(Math.max(d, 1.6) * 1000, () => setPhase('open', id))
  }

  const close = () => {
    const c = ctl.current
    if (!c.active || (c.phase !== 'open' && c.phase !== 'opening')) return
    const id = c.active
    const it = manifest.interactive[KEY[id]]
    clearTimers()
    setPhase('returning', id)
    const d = play(it.close)
    goTo('CAM_HOME', 1.3)
    if (id === 'notebook') later(reducedMotion ? 0 : 450, () => nodes.ink.forEach((o) => { o.visible = false }))
    if (id === 'computer') later(reducedMotion ? 0 : 800, () => screenTo(0, 0.5))
    if (id === 'lamp' && lampRef.current) gsap.to(lampRef.current, { intensity: LAMP_I, duration: reducedMotion ? 0 : 1.2 })
    const chained = !!c.queued
    later(Math.max(d, chained ? 0.9 : 1.3) * 1000, () => {
      c.active = null
      setPhase('home', null)
      const q = c.queued
      c.queued = null
      if (q) open(q)
    })
  }

  /* ── intro ── */
  const introRT = useMemo(() => {
    if (!intro) return null
    const tracks = intro.tracks
      .map((t) => {
        const node = gltf.scene.getObjectByName(t.node)
        if (!node) return null
        // el JSON solo trae la escala cuando difiere de 1: si alguna clave la trae, el resto vale 1
        const scaled = t.keys.some((k) => k.s)
        return {
          node,
          keys: t.keys.map((k) => ({
            f: k.f,
            p: new THREE.Vector3(...(k.p as [number, number, number])),
            q: new THREE.Quaternion(...(k.q as [number, number, number, number])),
            s: k.s ? new THREE.Vector3(...(k.s as [number, number, number])) : scaled ? new THREE.Vector3(1, 1, 1) : null,
            ease: gsap.parseEase(k.ease === 'steps(1)' ? 'steps(1)' : k.ease) ?? ((x: number) => x),
          })),
        }
      })
      .filter(Boolean) as { node: THREE.Object3D; keys: { f: number; p: THREE.Vector3; q: THREE.Quaternion; s: THREE.Vector3 | null; ease: (x: number) => number }[] }[]
    const cam = intro.camera
    const v = (a: number[]) => new THREE.Vector3(...(a as [number, number, number]))
    return {
      tracks,
      frames: intro.frames,
      fps: intro.fps,
      cam: { hold: cam.hold, move: cam.move, from: { eye: v(cam.from.eye), target: v(cam.from.target) }, to: { eye: v(cam.to.eye), target: v(cam.to.target) } },
    }
  }, [intro, gltf.scene])

  const evalIntro = (frame: number) => {
    if (!introRT) return
    for (const tr of introRT.tracks) {
      const ks = tr.keys
      let i = ks.length - 1
      while (i > 0 && ks[i].f > frame) i--
      const a = ks[i]
      const b = ks[Math.min(i + 1, ks.length - 1)]
      const span = Math.max(1, b.f - a.f)
      const u = a === b ? 1 : a.ease(THREE.MathUtils.clamp((frame - a.f) / span, 0, 1))
      tr.node.position.lerpVectors(a.p, b.p, frame <= ks[0].f ? 0 : u)
      tr.node.quaternion.slerpQuaternions(a.q, b.q, frame <= ks[0].f ? 0 : u)
      if (a.s && b.s) tr.node.scale.lerpVectors(a.s, b.s, u)
    }
    // cámara
    const c = introRT.cam
    const k = THREE.MathUtils.clamp((frame - c.move[0]) / (c.move[1] - c.move[0]), 0, 1)
    const e = gsap.parseEase('sine.inOut')(k)
    const home = poseOf(manifest, 'CAM_HOME', portrait)
    const eye = new THREE.Vector3().lerpVectors(portrait ? home.eye.clone().lerp(home.target, 0.28) : c.from.eye, home.eye, e)
    const tgt = new THREE.Vector3().lerpVectors(portrait ? home.target : c.from.target, home.target, e)
    applyPose({ eye, target: tgt, lens: home.lens })
    // luces: la lámpara primero, el ambiente después
    const lampK = THREE.MathUtils.clamp(frame / 43, 0, 1)
    const ambK = THREE.MathUtils.clamp((frame - 25) / 96, 0, 1)
    if (lampRef.current) lampRef.current.intensity = LAMP_I * gsap.parseEase('sine.inOut')(lampK)
    setAmbient(gsap.parseEase('sine.inOut')(ambK))
  }

  const startIntro = () => {
    clearTimers()
    mixer.stopAllAction()
    ctl.current.active = null
    nodes.ink.forEach((o) => { o.visible = false })
    screenTo(0, 0)
    if (!introRT || reducedMotion) {
      applyPose(poseOf(manifest, 'CAM_HOME', portrait))
      setAmbient(1)
      if (lampRef.current) lampRef.current.intensity = LAMP_I
      setPhase('home', null)
      return
    }
    ctl.current.introT = 0
    evalIntro(1)
    setPhase('intro', null)
  }

  /* ── luces ── */
  const amb = useRef<{ hemi: THREE.HemisphereLight | null; key: THREE.DirectionalLight | null; rim: THREE.DirectionalLight | null; alcove: THREE.PointLight | null }>({ hemi: null, key: null, rim: null, alcove: null })
  const setAmbient = (k: number) => {
    const a = amb.current
    if (a.hemi) a.hemi.intensity = 0.55 * k
    if (a.key) a.key.intensity = 2.1 * k
    if (a.rim) a.rim.intensity = 1.1 * k
    if (a.alcove) a.alcove.intensity = 9 * k
  }

  // arranque: la escena ya está cargada
  useEffect(() => {
    applyPose(poseOf(manifest, 'CAM_HOME', portrait))
    startIntro()
    return () => { clearTimers(); mixer.stopAllAction() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf.scene, replay])

  // peticiones desde el HTML
  useEffect(() => {
    if (request.n === 0) return
    if (request.id) open(request.id)
    else close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request.n])

  // reencuadre al cambiar de tamaño (desktop <-> móvil)
  useEffect(() => {
    if (ctl.current.phase === 'home') applyPose(poseOf(manifest, 'CAM_HOME', portrait))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portrait, size.width, size.height])

  /* ── mirada libre: parallax con el ratón + arrastre limitado ── */
  const orbit = useRef({
    nx: 0, ny: 0, inside: false,            // cursor normalizado sobre el lienzo (-1..1)
    dragging: false, lastX: 0, lastY: 0, moved: 0, release: 0,
    dragYaw: 0, dragPitch: 0,               // giro acumulado por arrastre
    yaw: 0, pitch: 0,                        // giro aplicado (suavizado)
  })
  useEffect(() => {
    if (!freeLook) return
    const el = gl.domElement
    const o = orbit.current
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      o.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      o.nx = THREE.MathUtils.clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1)
      o.ny = THREE.MathUtils.clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1)
      if (o.dragging) {
        const dx = e.clientX - o.lastX
        const dy = e.clientY - o.lastY
        o.lastX = e.clientX
        o.lastY = e.clientY
        o.moved += Math.abs(dx) + Math.abs(dy)
        o.dragYaw = THREE.MathUtils.clamp(o.dragYaw - dx * 0.0042, -ORBIT.yaw, ORBIT.yaw)
        o.dragPitch = THREE.MathUtils.clamp(o.dragPitch - dy * 0.003, ORBIT.pitchUp, ORBIT.pitchDown)
      }
    }
    const onDown = (e: PointerEvent) => {
      if (ctl.current.phase !== 'home' || e.button !== 0) return
      o.dragging = true
      o.moved = 0
      o.lastX = e.clientX
      o.lastY = e.clientY
      el.style.cursor = 'grabbing'
    }
    const onUp = () => {
      if (!o.dragging) return
      o.dragging = false
      o.release = performance.now()
      el.style.cursor = ''
    }
    const onLeave = () => { o.inside = false }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [gl, freeLook])

  const resetOrbit = () => {
    const o = orbit.current
    o.dragYaw = o.dragPitch = o.yaw = o.pitch = 0
    o.dragging = false
  }

  /* ── bucle ── */
  useFrame((_, dt) => {
    const c = ctl.current
    if (c.introT >= 0 && introRT) {
      c.introT += dt
      const frame = 1 + c.introT * introRT.fps
      evalIntro(Math.min(frame, introRT.frames))
      if (frame >= introRT.frames) {
        c.introT = -1
        setPhase('home', null)
      }
    }
    mixer.update(dt)
    if (c.tween) {
      c.tween.t = Math.min(1, c.tween.t + dt / c.tween.dur)
      const k = gsap.parseEase('power3.inOut')(c.tween.t)
      applyPose({
        eye: new THREE.Vector3().lerpVectors(c.tween.a.eye, c.tween.b.eye, k),
        target: new THREE.Vector3().lerpVectors(c.tween.a.target, c.tween.b.target, k),
        lens: THREE.MathUtils.lerp(c.tween.a.lens, c.tween.b.lens, k),
      })
      if (c.tween.t >= 1) c.tween = null
    }
    // mirada libre en el plano general
    if (freeLook && c.phase === 'home' && !c.tween && c.introT < 0) {
      const o = orbit.current
      if (!o.dragging && performance.now() - o.release > ORBIT.returnMs) {
        const k = 1 - Math.exp(-dt * 1.8)          // vuelta suave al encuadre
        o.dragYaw += (0 - o.dragYaw) * k
        o.dragPitch += (0 - o.dragPitch) * k
      }
      const px = o.inside ? o.nx : 0
      const py = o.inside ? o.ny : 0
      const wantYaw = THREE.MathUtils.clamp(o.dragYaw + px * ORBIT.parallaxYaw, -ORBIT.yaw, ORBIT.yaw)
      const wantPitch = THREE.MathUtils.clamp(o.dragPitch + py * ORBIT.parallaxPitch, ORBIT.pitchUp, ORBIT.pitchDown)
      const k = 1 - Math.exp(-dt * 5)
      o.yaw += (wantYaw - o.yaw) * k
      o.pitch += (wantPitch - o.pitch) * k
      const home = poseOf(manifest, 'CAM_HOME', portrait)
      const off = home.eye.clone().sub(home.target)
      off.applyAxisAngle(UP, o.yaw)
      const right = new THREE.Vector3().crossVectors(UP, off).normalize()
      off.applyAxisAngle(right, o.pitch)
      applyPose({ eye: home.target.clone().add(off), target: home.target, lens: home.lens })
      if (!o.dragging) gl.domElement.style.cursor = o.inside && !c.hover ? 'grab' : ''
    }
    // elevación sutil en hover
    for (const [key, root] of Object.entries(nodes.roots)) {
      if (!root) continue
      const h = c.hover ?? hoverExternal
      const lift = c.phase === 'home' && h && KEY[h] === key ? 0.035 : 0
      root.position.y = THREE.MathUtils.lerp(root.position.y, nodes.rootY[key] + lift, 1 - Math.exp(-dt * 12))
    }
    // foco orientado como el cabezal
    if (nodes.bulb && lampRef.current) {
      const q = nodes.bulb.getWorldQuaternion(new THREE.Quaternion())
      const p = nodes.bulb.getWorldPosition(new THREE.Vector3())
      lampTarget.position.copy(p).add(new THREE.Vector3(0, 0, -1).applyQuaternion(q).multiplyScalar(3))
      lampTarget.updateMatrixWorld()
    }
  })

  /* ── puntero ── */
  const pick = (e: { object: THREE.Object3D }) => ID_OF[(e.object.userData.nx_interactive as string) ?? ''] ??
    ID_OF[Object.entries(manifest.interactive).find(([, v]) => v.collider === e.object.name)?.[0] ?? ''] ?? null

  return (
    <>
      <color attach="background" args={[BG]} />
      <hemisphereLight ref={(l) => { amb.current.hemi = l }} args={['#fff1e0', '#1a1816', 0.55]} />
      <directionalLight
        ref={(l) => { amb.current.key = l }}
        position={[3.0, 8.5, 6.5]}
        intensity={2.1}
        color="#ffdcb3"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight ref={(l) => { amb.current.rim = l }} position={[-6, 6, -3]} intensity={1.1} color="#ffe2c4" />
      <pointLight ref={(l) => { amb.current.alcove = l }} position={[0.95, 3.6, -2.0]} intensity={9} distance={5} color="#ffb877" />
      <spotLight ref={lampRef} intensity={LAMP_I} distance={7} angle={0.68} penumbra={0.75} decay={1.6} color="#ffc285" castShadow={false} />
      <primitive object={gltf.scene} />
      {phase === 'home' && ORDER.map((id, i) => nodes.anchors[id] && (
        <Html key={id} position={nodes.anchors[id]} center zIndexRange={id === 'notebook' ? [60, 40] : [30, 0]}>
          <button
            type="button"
            onClick={() => open(id)}
            onPointerEnter={() => { ctl.current.hover = id; onHover(id) }}
            onPointerLeave={() => { ctl.current.hover = null; onHover(null) }}
            aria-label={`${String(i + 1).padStart(2, '0')} ${labels[id]}`}
            className="group relative flex items-center gap-2 select-none"
          >
            <span className="relative flex h-7 w-7 items-center justify-center">
              {hint && id === 'notebook' && !visited.length && (
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 pointer-events-none">
                {/* al lado del 01 (no encima): no tapa otros marcadores ni el logo, también en móvil */}
                <span className="block whitespace-nowrap font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-ink bg-paper px-2.5 py-1 md:px-3 md:py-1.5 shadow-lg animate-pulse" style={{ animationDuration: '1.8s' }}>
                  ← {hint}
                </span>
              </span>
              )}
              {!visited.includes(id) && (
                <span className="absolute inset-0 rounded-full bg-paper/40 animate-ping" style={{ animationDuration: '2.4s' }} />
              )}
              <span className={`relative flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[10px] tracking-[0.05em] transition-colors duration-200 ${visited.includes(id) ? 'border-paper/40 bg-ink/70 text-paper/70' : 'border-paper bg-paper text-ink'} group-hover:bg-accent group-hover:border-accent group-hover:text-paper`}>
                {visited.includes(id) ? '✓' : String(i + 1).padStart(2, '0')}
              </span>
            </span>
            <span className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.22em] text-paper bg-ink/75 px-2 py-1 transition-opacity duration-200 ${hint && id === 'notebook' && !visited.length ? 'hidden' : (hoverExternal === id || ctl.current.hover === id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              {labels[id]}
            </span>
          </button>
        </Html>
      ))}
      {nodes.colliders.map((m) => (
        <primitive
          key={m.uuid}
          object={m}
          onPointerOver={(e: { stopPropagation: () => void; object: THREE.Object3D }) => {
            e.stopPropagation()
            const id = pick(e)
            ctl.current.hover = id
            onHover(ctl.current.phase === 'home' ? id : null)
            document.body.style.cursor = ctl.current.phase === 'home' && id ? 'pointer' : ''
          }}
          onPointerOut={() => {
            ctl.current.hover = null
            onHover(null)
            document.body.style.cursor = ''
          }}
          onClick={(e: { stopPropagation: () => void; object: THREE.Object3D }) => {
            e.stopPropagation()
            const id = pick(e)
            if (orbit.current.moved > 6) { orbit.current.moved = 0; return }   // fue un arrastre
            if (id) open(id)
          }}
        />
      ))}
    </>
  )
}

const LAMP_I = 26
const UP = new THREE.Vector3(0, 1, 0)
const D = THREE.MathUtils.degToRad
const ORBIT = {
  yaw: D(25),            // giro horizontal máximo (izq./der.)
  pitchUp: D(-10),       // subir la cámara (negativo = más alta)
  pitchDown: D(5),       // bajarla
  parallaxYaw: D(6),
  parallaxPitch: D(3),
  returnMs: 2500,        // tras soltar, vuelve sola al plano general
}

export default function EstudioScene(props: SceneProps & { active: boolean; lowPower: boolean }) {
  return (
    <Canvas
      frameloop={props.active ? 'always' : 'never'}
      dpr={props.lowPower ? [1, 1.5] : [1, 2]}
      shadows={!props.lowPower}
      gl={{ antialias: true, toneMapping: THREE.AgXToneMapping, powerPreference: 'high-performance' }}
      camera={{ fov: 30, near: 0.1, far: 200, position: [0, 4, 15] }}
      onPointerMissed={() => { document.body.style.cursor = '' }}
    >
      <Studio {...props} />
    </Canvas>
  )
}
