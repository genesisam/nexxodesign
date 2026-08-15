/**
 * One signal between the curtain and whatever animates underneath it.
 *
 * The hero types itself in on mount. Without this the typing would happen
 * behind the curtain and the visitor would lift it onto a finished headline —
 * the animation paid for and never seen.
 *
 * `whenIntroDone` always settles. It resolves on the curtain's own completion,
 * on its error path, and on a hard timeout, because a promise that can hang is
 * a headline that can stay invisible.
 */

let done = false
let resolveIntro: (() => void) | null = null

const introPromise = new Promise<void>(resolve => { resolveIntro = resolve })

export function markIntroDone(): void {
  if (done) return
  done = true
  resolveIntro?.()
}

/** Longest the curtain can hold before consumers give up and animate anyway. */
const SAFETY_MS = 3200

export function whenIntroDone(): Promise<void> {
  if (done) return Promise.resolve()
  return Promise.race([
    introPromise,
    new Promise<void>(resolve => setTimeout(resolve, SAFETY_MS)),
  ])
}
