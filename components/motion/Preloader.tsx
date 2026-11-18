'use client'

import { useEffect, useRef } from 'react'
import { markIntroDone } from '@/lib/intro'
import { spring, MOTION } from '@/lib/spring'

/**
 * First-load curtain: the screen is a row of purple columns, a 2×2 brick is
 * thrown in from the left and bounces across, and each column lifts away the
 * moment the brick passes over its centre.
 *
 * The throw is simulated before it plays: up to 400 random throws are run
 * through a little physics model (gravity, a floor, energy lost per bounce,
 * spin coupled to rolling) and the first one that crosses the screen in 2–2.4s
 * with at least four bounces is kept. That is why it looks a bit different on
 * every visit but always lands in the same time budget.
 *
 * The rules from the previous curtain stay:
 *
 * 1. The markup ships in the server HTML, and an inline script in <body>
 *    decides before paint whether to skip it.
 * 2. A CSS failsafe clears it with no JS involved if anything here breaks.
 * 3. Every exit path resolves the intro promise, so the hero never waits on a
 *    signal that isn't coming.
 *
 * Any key, click, wheel or touch hurries it: the remaining columns lift at
 * once and the brick fades.
 */

const COLS = 8
const C = {
  beat: 0.2,
  gravity: 5,
  bounciness: [0.5, 0.66],
  speed: [0.4, 0.75],
  exit: [2, 2.4],
  minBounces: 4,
  rest: 0.08,
  step: 0.022,
  squash: { duration: 0.34, bounce: 0.32 },
}

const lerp  = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0
    let n = Math.imul(s ^ (s >>> 15), 1 | s)
    n = (n + Math.imul(n ^ (n >>> 7), 61 | n)) ^ n
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296
  }
}

type Throw = { xs: number[]; ys: number[]; rots: number[]; impacts: { t: number; speed: number }[]; exit: number; bounces: number; firstHit: number | null; dt: number }

/** One throw: brick of radius `r` across a screen `W`×`H`, first column `colW` wide. */
function simulate(rand: () => number, W: number, H: number, r: number, colW: number): Throw {
  const g = C.gravity * H
  const floor = H - r
  let x = lerp(-1.6 * r, colW, rand())
  let y = -r - lerp(0.02, 0.22, rand()) * H
  let vx = lerp(C.speed[0], C.speed[1], rand()) * W
  let vy = lerp(0, 0.35, rand()) * H
  let spin = lerp(-6, 6, rand())
  const bounce = lerp(C.bounciness[0], C.bounciness[1], rand())
  const dt = 1 / 240
  const xs: number[] = [], ys: number[] = [], rots: number[] = []
  const impacts: Throw['impacts'] = []
  let rot = rand() * Math.PI * 2, t = 0, resting = false, bounces = 0
  let firstHit: number | null = null

  while (t < 6) {
    if (!resting) vy += g * dt
    x += vx * dt
    y += vy * dt
    rot += spin * dt
    if (!resting && y >= floor && vy > 0) {
      y = floor
      const hit = vy
      if (firstHit === null) firstHit = x
      if (hit < C.rest * Math.sqrt(g * H)) { resting = true; vy = 0 }
      else { vy = -hit * bounce; bounces++ }
      vx = ((vx + 0.4 * spin * r) / 1.4) * 0.985
      spin = vx / r
      impacts.push({ t, speed: hit / Math.sqrt(2 * g * H) })
    }
    if (resting) {
      y = floor
      vx = Math.max(0.15 * W, vx - 0.05 * W * dt)
      spin = vx / r
    }
    xs.push(x); ys.push(y); rots.push(rot)
    t += dt
    if (x - r > W) break
  }
  return { xs, ys, rots, impacts, exit: t, bounces, firstHit, dt }
}

function pickThrow(W: number, H: number, r: number, colW: number): Throw {
  const rand = rng((Math.random() * 2 ** 31) | 0)
  let best: Throw | null = null, score = Infinity
  for (let i = 0; i < 400; i++) {
    const s = simulate(rand, W, H, r, colW)
    if (s.exit >= C.exit[0] && s.exit <= C.exit[1] && s.bounces >= C.minBounces
        && s.firstHit !== null && s.firstHit > 0.1 * W && s.firstHit < 0.55 * W) return s
    const d = Math.abs(s.exit - 2.2) + (s.bounces < C.minBounces ? 1 : 0)
    if (d < score) { score = d; best = s }
  }
  return best!
}

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) { markIntroDone(); return }

    if (document.documentElement.dataset.intro === 'skip') {
      root.style.display = 'none'
      markIntroDone()
      return
    }

    document.body.style.overflow = 'hidden'
    let done = false
    let raf = 0
    const hurryEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const

    const finish = () => {
      if (done) return
      done = true
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
      root.style.display = 'none'
      try { sessionStorage.setItem('nexxo:intro', '1') } catch { /* private mode */ }
      markIntroDone()
    }

    let hurry = () => {}
    const onHurry = () => hurry()
    hurryEvents.forEach(ev => addEventListener(ev, onHurry, { passive: true }))
    const skip = () => hurry()
    root.addEventListener('nexxo:skip', skip)

    const run = () => {
      const W = innerWidth, H = innerHeight
      const cols = ([...root.querySelectorAll('[data-intro-col]')] as HTMLElement[]).filter(c => c.offsetParent !== null)
      const brick  = root.querySelector('[data-intro-brick]') as HTMLElement
      const inner  = brick.firstElementChild as HTMLElement
      const shadow = root.querySelector('[data-intro-shadow]') as HTMLElement
      const spans  = cols.map(c => { const b = c.getBoundingClientRect(); return [b.left, b.right] })
      const centers = spans.map(([l, r]) => (l + r) / 2)

      const size = W / (W <= 767 ? 6 : W <= 991 ? 9 : 12.5)
      const r = size / 2
      brick.style.width = brick.style.height = `${size}px`
      shadow.style.width  = `${size * 1.1}px`
      shadow.style.height = `${size * 0.2}px`

      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
      const sim = reduced ? null : pickThrow(W, H, r, spans[0][1] - spans[0][0])
      // When each column's centre is crossed.
      const due = sim
        ? centers.map(cx => { const k = sim.xs.findIndex(x => x >= cx); return k < 0 ? sim.exit : Math.max(0.08, k * sim.dt) })
        : centers.map((_, i) => 0.1 + i * C.step)
      if (!sim) brick.hidden = shadow.hidden = true

      const lift = spring(MOTION.hero)
      const sq = { v: 0, vel: 0, k: (2 * Math.PI / C.squash.duration) ** 2, c: 4 * Math.PI * (1 - C.squash.bounce) / C.squash.duration }
      const liftedAt = cols.map(() => -1)
      let t = 0, last = performance.now(), nextImpact = 0, hurriedAt = -1

      hurry = () => {
        if (hurriedAt >= 0) return
        let k = 0
        cols.forEach((_, i) => { if (liftedAt[i] < 0) due[i] = t + k++ * C.step })
        hurriedAt = t
      }

      const frame = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        t += dt

        if (sim) {
          const i = Math.min(sim.xs.length - 1, Math.floor(t / sim.dt))
          const x = sim.xs[i], y = sim.ys[i]
          while (nextImpact < sim.impacts.length && sim.impacts[nextImpact].t <= t) {
            sq.v = -Math.min(0.17, 0.22 * sim.impacts[nextImpact++].speed)
            sq.vel = 0
          }
          for (let k = 0; k < 4; k++) {
            const h = dt / 4
            sq.vel += (-sq.k * sq.v - sq.c * sq.vel) * h
            sq.v += sq.vel * h
          }
          brick.style.transform = `translate3d(${x - r}px, ${y - r}px, 0) scale(${1 - sq.v * 0.85}, ${1 + sq.v})`
          inner.style.transform = `rotate(${sim.rots[i]}rad)`
          const near = 1 - clamp((H - r - y) / (H * 0.85), 0, 1)
          shadow.style.transform = `translate3d(${x - size * 0.55}px, ${H - size * 0.12}px, 0) scale(${0.35 + 0.65 * near}, ${0.6 + 0.4 * near})`
          let alpha = y > -r ? near * near : 0
          if (hurriedAt >= 0) {
            const f = clamp((t - hurriedAt) / 0.18, 0, 1)
            brick.style.opacity = String(1 - f)
            alpha *= 1 - f
          }
          shadow.style.opacity = String(alpha)
        }

        let busy = !!sim && hurriedAt < 0 && t < sim.exit
        cols.forEach((c, i) => {
          if (liftedAt[i] < 0 && t >= due[i]) liftedAt[i] = t
          if (liftedAt[i] < 0) { busy = true; return }
          const p = lift.ease(clamp((t - liftedAt[i]) / lift.duration, 0, 1))
          c.style.transform = `translate3d(0, ${-101 * p}%, 0)`
          if (p < 1) busy = true
        })

        if (busy) raf = requestAnimationFrame(frame)
        else finish()
      }
      raf = requestAnimationFrame(frame)
    }

    const fonts = document.fonts?.ready ?? Promise.resolve()
    Promise.race([fonts, new Promise(r => setTimeout(r, 700))]).then(() => setTimeout(() => {
      if (done) return
      try { run() } catch { finish() }
    }, C.beat * 1000))

    return () => {
      hurryEvents.forEach(ev => removeEventListener(ev, onHurry))
      root.removeEventListener('nexxo:skip', skip)
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div ref={rootRef} className="intro">
      <div aria-hidden className="intro-cols">
        {Array.from({ length: COLS }, (_, i) => <i key={i} data-intro-col />)}
      </div>

      <div aria-hidden data-intro-shadow className="intro-shadow" />
      <div aria-hidden data-intro-brick className="intro-brick">
        <div>
          {/* A 2×2 brick seen from above: the studs are what make it read as
              a brick while it spins. */}
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <rect x="3" y="3" width="94" height="94" rx="7" fill="#EFEBE3" />
            <rect x="3" y="3" width="94" height="94" rx="7" fill="none" stroke="#0E0E0E" strokeOpacity=".18" strokeWidth="2" />
            {[[28, 28], [72, 28], [28, 72], [72, 72]].map(([cx, cy]) => (
              <g key={`${cx}-${cy}`}>
                <circle cx={cx + 2} cy={cy + 3} r="15" fill="#0E0E0E" fillOpacity=".16" />
                <circle cx={cx} cy={cy} r="15" fill="#F7F4EE" stroke="#0E0E0E" strokeOpacity=".14" strokeWidth="1.5" />
                <circle cx={cx - 4} cy={cy - 5} r="5" fill="#fff" fillOpacity=".7" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      <button
        type="button"
        onClick={() => rootRef.current?.dispatchEvent(new CustomEvent('nexxo:skip'))}
        className="absolute bottom-[8%] left-1/2 z-10 -translate-x-1/2 border-b border-paper/40 pb-1
                   font-mono text-[10px] uppercase tracking-[0.24em] text-paper/70
                   transition-colors duration-200 hover:border-paper hover:text-paper
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
      >
        Saltar intro
      </button>
    </div>
  )
}
