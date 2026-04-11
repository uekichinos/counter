import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initCounters } from '../init-counters'

// --- rAF / performance mock -------------------------------------------

let rafCallbacks: Array<FrameRequestCallback> = []
let now = 0

beforeEach(() => {
  rafCallbacks = []
  now = 0

  vi.stubGlobal('performance', { now: () => now })
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    rafCallbacks.push(cb)
    return rafCallbacks.length
  })

  vi.stubGlobal('window', {
    ...window,
    matchMedia: () => ({ matches: false }),
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

function flush(ms = 2100) {
  now += ms
  while (rafCallbacks.length > 0) {
    const cbs = [...rafCallbacks]
    rafCallbacks = []
    cbs.forEach((cb) => cb(now))
  }
}

// --- IntersectionObserver mock ----------------------------------------

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void
let observers: Array<{ cb: ObserverCallback }> = []

beforeEach(() => {
  observers = []
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      cb: ObserverCallback
      constructor(cb: ObserverCallback) {
        this.cb = cb
        observers.push({ cb })
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})

function triggerIntersect(isIntersecting = true) {
  observers.forEach(({ cb }) => cb([{ isIntersecting } as never]))
}

// --- Tests -----------------------------------------------------------

describe('initCounters', () => {
  it('animates all matching elements', () => {
    document.body.innerHTML = `
      <span data-counter>55</span>
      <span data-counter>100</span>
    `
    initCounters('[data-counter]', { trigger: 'immediate', duration: 2000 })
    flush()
    const spans = document.querySelectorAll('[data-counter]')
    expect(spans[0].textContent).toBe('55')
    expect(spans[1].textContent).toBe('100')
  })

  it('does nothing when no elements match', () => {
    initCounters('[data-counter]', { trigger: 'immediate' })
    expect(rafCallbacks).toHaveLength(0)
  })

  it('applies data-counter-duration override', () => {
    document.body.innerHTML = `<span data-counter data-counter-duration="500">100</span>`
    const onComplete = vi.fn()
    initCounters('[data-counter]', { trigger: 'immediate', easing: 'linear', onComplete })
    now += 250
    const pending = [...rafCallbacks]
    rafCallbacks = []
    pending.forEach((cb) => cb(now))
    // halfway through 500ms duration with linear easing → value should be ~50
    expect(document.querySelector('[data-counter]')!.textContent).toBe('50')
  })

  it('ignores invalid data-counter-duration and uses global duration', () => {
    document.body.innerHTML = `<span data-counter data-counter-duration="abc">100</span>`
    initCounters('[data-counter]', { trigger: 'immediate', duration: 2000, easing: 'linear' })
    now += 1000
    const pending = [...rafCallbacks]
    rafCallbacks = []
    pending.forEach((cb) => cb(now))
    // halfway through 2000ms → value should be ~50
    expect(document.querySelector('[data-counter]')!.textContent).toBe('50')
  })

  it('applies data-counter-trigger="immediate" override', () => {
    document.body.innerHTML = `<span data-counter data-counter-trigger="immediate">42</span>`
    initCounters('[data-counter]', { trigger: 'scroll', duration: 2000 })
    // should start without intersection
    expect(rafCallbacks.length).toBeGreaterThan(0)
  })

  it('applies data-counter-trigger="scroll" override', () => {
    document.body.innerHTML = `<span data-counter data-counter-trigger="scroll">42</span>`
    initCounters('[data-counter]', { trigger: 'immediate', duration: 2000 })
    // should not start until intersection
    expect(rafCallbacks).toHaveLength(0)
    triggerIntersect(true)
    flush()
    expect(document.querySelector('[data-counter]')!.textContent).toBe('42')
  })

  it('applies data-counter-repeat="true" override', async () => {
    document.body.innerHTML = `<span data-counter data-counter-repeat="true">10</span>`
    initCounters('[data-counter]', { trigger: 'scroll', duration: 2000 })
    triggerIntersect(true)
    flush()
    await Promise.resolve()
    triggerIntersect(true)
    expect(rafCallbacks.length).toBeGreaterThan(0)
  })

  it('ignores invalid data-counter-trigger value', () => {
    document.body.innerHTML = `<span data-counter data-counter-trigger="hover">42</span>`
    // should fall back to global trigger (immediate), not crash
    expect(() =>
      initCounters('[data-counter]', { trigger: 'immediate', duration: 2000 }),
    ).not.toThrow()
  })

  it('applies data-counter-repeat="false" override (animates on first intersection)', () => {
    document.body.innerHTML = `<span data-counter data-counter-repeat="false">10</span>`
    initCounters('[data-counter]', { trigger: 'scroll', duration: 2000, repeat: true })
    // with repeat=false override, should still animate on first intersection
    triggerIntersect(true)
    expect(rafCallbacks.length).toBeGreaterThan(0)
    flush()
    expect(document.querySelector('[data-counter]')!.textContent).toBe('10')
  })

  it('animates elements with mixed text content', () => {
    document.body.innerHTML = `
      <p data-counter>RM55 billion</p>
      <p data-counter>34.67%</p>
    `
    initCounters('[data-counter]', { trigger: 'immediate', duration: 2000 })
    flush()
    const ps = document.querySelectorAll('[data-counter]')
    expect(ps[0].textContent).toBe('RM55 billion')
    expect(ps[1].textContent).toBe('34.67%')
  })
})
