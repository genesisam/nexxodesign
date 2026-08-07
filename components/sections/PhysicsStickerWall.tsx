'use client'

import Matter from 'matter-js'
import { useEffect, useRef, useState } from 'react'

type Sticker = {
  id: number
  src: string
  width: number
  height: number
}

export type PhysicsStickerWallProps = {
  /** Up to ten image URLs. Repeated images are used when more stickers are requested. */
  imageUrls: string[]
  backgroundColor?: string
  stickerCount?: number
  stickerSize?: number
  sizeRandomness?: number
  gravity?: number
  restitution?: number
  friction?: number
  throwPower?: number
  borderRadius?: number
  className?: string
}

const WALL_THICKNESS = 120
const MAX_IMAGES = 10

function limit(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function PhysicsStickerWall({
  imageUrls,
  backgroundColor = 'var(--color-ink)',
  stickerCount = 9,
  stickerSize = 154,
  sizeRandomness = 0.28,
  gravity = 1.35,
  restitution = 0.42,
  friction = 0.16,
  throwPower = 1,
  borderRadius = 18,
  className = '',
}: PhysicsStickerWallProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const elementRefs = useRef(new Map<number, HTMLDivElement>())
  const [stickers, setStickers] = useState<Sticker[]>([])

  useEffect(() => {
    const frame = frameRef.current
    const sources = imageUrls.filter(Boolean).slice(0, MAX_IMAGES)
    if (!frame || sources.length === 0) return

    const { Engine, Bodies, Body, Composite, Query, Sleeping } = Matter
    const engine = Engine.create({ enableSleeping: false })
    engine.gravity.y = limit(gravity, 0, 2)
    engine.gravity.scale = 0.001

    const bodies: Matter.Body[] = []
    const metadata = new Map<number, Sticker>()
    let walls: Matter.Body[] = []
    let animationFrame = 0
    let lastTime = performance.now()
    let dragging: { body: Matter.Body; samples: { x: number; y: number; time: number }[] } | null = null

    const createWalls = () => {
      Composite.remove(engine.world, walls)
      const { width, height } = frame.getBoundingClientRect()
      walls = [
        Bodies.rectangle(width / 2, height + WALL_THICKNESS / 2, width + WALL_THICKNESS * 2, WALL_THICKNESS, { isStatic: true }),
        Bodies.rectangle(-WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height * 2, { isStatic: true }),
        Bodies.rectangle(width + WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height * 2, { isStatic: true }),
      ]
      Composite.add(engine.world, walls)
    }

    const spawnStickers = () => {
      const { width } = frame.getBoundingClientRect()
      const count = limit(Math.round(stickerCount), 1, 40)
      const baseSize = limit(stickerSize, 48, 360)
      const variance = limit(sizeRandomness, 0, 0.75)
      const next: Sticker[] = []

      for (let index = 0; index < count; index += 1) {
        const scale = 1 + (Math.random() * 2 - 1) * variance
        const itemWidth = Math.round(baseSize * scale)
        const itemHeight = Math.round(itemWidth * (0.72 + Math.random() * 0.22))
        const body = Bodies.rectangle(
          width * (0.1 + Math.random() * 0.8),
          -itemHeight * (index + 1) * 0.72,
          itemWidth,
          itemHeight,
          {
            angle: (Math.random() - 0.5) * 0.5,
            restitution: limit(restitution, 0, 0.95),
            friction: limit(friction, 0, 1),
            frictionAir: 0.018,
            density: 0.0014,
          },
        )
        bodies.push(body)
        metadata.set(body.id, {
          id: body.id,
          src: sources[index % sources.length],
          width: itemWidth,
          height: itemHeight,
        })
      }
      Composite.add(engine.world, bodies)
      setStickers(Array.from(metadata.values()))
    }

    const pointForEvent = (event: PointerEvent) => {
      const bounds = frame.getBoundingClientRect()
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    }

    const onPointerDown = (event: PointerEvent) => {
      const point = pointForEvent(event)
      const body = Query.point(bodies, point)[0]
      if (!body) return
      event.preventDefault()
      frame.setPointerCapture(event.pointerId)
      Sleeping.set(body, false)
      Body.setStatic(body, true)
      dragging = { body, samples: [{ ...point, time: performance.now() }] }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return
      const point = pointForEvent(event)
      Body.setPosition(dragging.body, point)
      Body.setVelocity(dragging.body, { x: 0, y: 0 })
      dragging.samples.push({ ...point, time: performance.now() })
      if (dragging.samples.length > 5) dragging.samples.shift()
    }

    const releaseSticker = () => {
      if (!dragging) return
      const { body, samples } = dragging
      const first = samples[0]
      const last = samples[samples.length - 1]
      const elapsed = Math.max(last.time - first.time, 16)
      const multiplier = limit(throwPower, 0.1, 2.5) * 16.67
      const velocity = {
        x: limit(((last.x - first.x) / elapsed) * multiplier, -30, 30),
        y: limit(((last.y - first.y) / elapsed) * multiplier, -30, 30),
      }
      Body.setStatic(body, false)
      Sleeping.set(body, false)
      Body.setVelocity(body, velocity)
      dragging = null
    }

    const onPointerUp = (event: PointerEvent) => {
      if (frame.hasPointerCapture(event.pointerId)) frame.releasePointerCapture(event.pointerId)
      releaseSticker()
    }

    const render = (time: number) => {
      const delta = Math.min(Math.max(time - lastTime, 8), 33)
      lastTime = time
      Engine.update(engine, delta)
      bodies.forEach(body => {
        const element = elementRefs.current.get(body.id)
        if (element) {
          const item = metadata.get(body.id)
          if (item) {
            element.style.transform = `translate3d(${body.position.x - item.width / 2}px, ${body.position.y - item.height / 2}px, 0) rotate(${body.angle}rad)`
          }
        }
      })
      animationFrame = requestAnimationFrame(render)
    }

    createWalls()
    spawnStickers()
    const resizeObserver = new ResizeObserver(createWalls)
    resizeObserver.observe(frame)
    frame.addEventListener('pointerdown', onPointerDown)
    frame.addEventListener('pointermove', onPointerMove)
    frame.addEventListener('pointerup', onPointerUp)
    frame.addEventListener('pointercancel', releaseSticker)
    frame.addEventListener('lostpointercapture', releaseSticker)
    window.addEventListener('pointerup', releaseSticker)
    animationFrame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      frame.removeEventListener('pointerdown', onPointerDown)
      frame.removeEventListener('pointermove', onPointerMove)
      frame.removeEventListener('pointerup', onPointerUp)
      frame.removeEventListener('pointercancel', releaseSticker)
      frame.removeEventListener('lostpointercapture', releaseSticker)
      window.removeEventListener('pointerup', releaseSticker)
      Composite.clear(engine.world, false)
      Engine.clear(engine)
      elementRefs.current.clear()
    }
  }, [backgroundColor, borderRadius, friction, gravity, imageUrls, restitution, sizeRandomness, stickerCount, stickerSize, throwPower])

  return (
    <div
      ref={frameRef}
      aria-label="Muro interactivo de stickers"
      className={`absolute inset-0 overflow-hidden touch-none ${className}`}
      style={{ backgroundColor }}
    >
      {stickers.map(sticker => (
        <div
          key={sticker.id}
          ref={element => {
            if (element) elementRefs.current.set(sticker.id, element)
            else elementRefs.current.delete(sticker.id)
          }}
          className="absolute left-0 top-0 select-none overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.28)] will-change-transform"
          style={{ width: sticker.width, height: sticker.height, borderRadius }}
        >
          <img src={sticker.src} alt="" draggable={false} className="h-full w-full object-cover pointer-events-none" />
        </div>
      ))}
    </div>
  )
}
