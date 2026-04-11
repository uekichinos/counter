import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { animateCounter } from '../animate-counter'

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

  // Default: motion is allowed
  vi.stubGlobal('window', {
    ...window,
    matchMedia: () => ({ matches: false }),
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// Helper to create a test element
function el(text: string): HTMLElement {
  const div = document.createElement('div')
  div.textContent = text
  return div
}

// Helper to flush rAF frames
function flush(ms = 2100) {
  now += ms
  while (rafCallbacks.length > 0) {
    const cbs = [...rafCallbacks]
    rafCallbacks = []
    cbs.forEach((cb) => cb(now))
  }
}

// --- IntersectionObserver mock ----------------------------------------

type ObserverEntry = { isIntersecting: boolean }
type ObserverCallback = (entries: ObserverEntry[]) => void
let observers: Array<{ cb: ObserverCallback; el: Element }> = []

beforeEach(() => {
  observers = []
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      cb: ObserverCallback
      constructor(cb: ObserverCallback) {
        this.cb = cb
      }
      observe(target: Element) {
        observers.push({ cb: this.cb, el: target })
      }
      unobserve() {}
      disconnect() {}
    },
  )
})

function triggerIntersect(isIntersecting = true) {
  observers.forEach(({ cb, el }) => cb([{ isIntersecting, target: el } as never]))
}

// --- Tests -----------------------------------------------------------

describe('animateCounter – immediate trigger', () => {
  it('animates a plain integer', () => {
    const div = el('RM55 billion')
    animateCounter(div, { trigger: 'immediate', duration: 2000 })
    flush()
    expect(div.textContent).toBe('RM55 billion')
  })

  it('animates a decimal', () => {
    const div = el('34.67%')
    animateCounter(div, { trigger: 'immediate', duration: 2000 })
    flush()
    expect(div.textContent).toBe('34.67%')
  })

  it('animates comma-grouped number', () => {
    const div = el('We have 1,500,344 customers')
    animateCounter(div, { trigger: 'immediate', duration: 2000 })
    flush()
    expect(div.textContent).toBe('We have 1,500,344 customers')
  })

  it('does nothing when no numbers found', () => {
    const div = el('No numbers here')
    animateCounter(div, { trigger: 'immediate' })
    expect(div.textContent).toBe('No numbers here')
  })

  it('shows partial value mid-animation', () => {
    const div = el('100')
    animateCounter(div, { trigger: 'immediate', duration: 2000, easing: 'linear' })
    now += 1000
    const pending = [...rafCallbacks]
    rafCallbacks = []
    pending.forEach((cb) => cb(now))
    expect(div.textContent).toBe('50')
  })
})

describe('animateCounter – scroll trigger', () => {
  it('does not animate before intersection', () => {
    const div = el('55')
    animateCounter(div, { trigger: 'scroll', duration: 2000 })
    expect(rafCallbacks).toHaveLength(0)
    expect(div.textContent).toBe('55')
  })

  it('animates when element enters viewport', () => {
    const div = el('55')
    animateCounter(div, { trigger: 'scroll', duration: 2000 })
    triggerIntersect(true)
    flush()
    expect(div.textContent).toBe('55')
  })

  it('does not re-animate by default (repeat: false)', () => {
    const div = el('10')
    animateCounter(div, { trigger: 'scroll', duration: 2000, repeat: false })
    triggerIntersect(true)
    flush()
    const callsBefore = observers.length
    triggerIntersect(true)
    expect(rafCallbacks).toHaveLength(0)
    expect(callsBefore).toBe(observers.length)
  })

  it('re-animates when repeat: true', async () => {
    const div = el('10')
    animateCounter(div, { trigger: 'scroll', duration: 2000, repeat: true })
    triggerIntersect(true)
    flush()
    await Promise.resolve()
    triggerIntersect(true)
    expect(rafCallbacks.length).toBeGreaterThan(0)
  })
})

describe('animateCounter – startValue', () => {
  it('starts from a custom value instead of 0', () => {
    const div = el('100')
    animateCounter(div, { trigger: 'immediate', duration: 2000, easing: 'linear', startValue: 50 })
    // at t=0, first frame: progress ≈ 0, current = 50 + 0 * (100-50) = 50
    now += 0
    const pending = [...rafCallbacks]
    rafCallbacks = []
    pending.forEach((cb) => cb(now))
    expect(div.textContent).toBe('50')
  })

  it('ends at the target value regardless of startValue', () => {
    const div = el('100')
    animateCounter(div, { trigger: 'immediate', duration: 2000, startValue: 80 })
    flush()
    expect(div.textContent).toBe('100')
  })
})

describe('animateCounter – onComplete', () => {
  it('calls onComplete when animation finishes', () => {
    const onComplete = vi.fn()
    const div = el('100')
    animateCounter(div, { trigger: 'immediate', duration: 2000, onComplete })
    flush()
    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('does not call onComplete before animation ends', () => {
    const onComplete = vi.fn()
    const div = el('100')
    animateCounter(div, { trigger: 'immediate', duration: 2000, easing: 'linear', onComplete })
    // advance to halfway only
    now += 1000
    const pending = [...rafCallbacks]
    rafCallbacks = []
    pending.forEach((cb) => cb(now))
    expect(onComplete).not.toHaveBeenCalled()
  })
})

describe('animateCounter – prefers-reduced-motion', () => {
  it('skips animation and shows final value immediately', () => {
    vi.stubGlobal('window', {
      ...window,
      matchMedia: () => ({ matches: true }),
    })
    const div = el('1,500,344')
    animateCounter(div, { trigger: 'immediate', duration: 2000 })
    // no rAF should have been queued
    expect(rafCallbacks).toHaveLength(0)
    expect(div.textContent).toBe('1,500,344')
  })

  it('still calls onComplete when motion is reduced', () => {
    vi.stubGlobal('window', {
      ...window,
      matchMedia: () => ({ matches: true }),
    })
    const onComplete = vi.fn()
    const div = el('55')
    animateCounter(div, { trigger: 'immediate', onComplete })
    expect(onComplete).toHaveBeenCalledOnce()
  })
})

describe('animateCounter – multiple numbers', () => {
  it('animates all numbers in a multi-number string', () => {
    const div = el('From 12 offices across 48 countries')
    animateCounter(div, { trigger: 'immediate', duration: 2000 })
    flush()
    expect(div.textContent).toBe('From 12 offices across 48 countries')
  })

  it('shows partial values for both numbers mid-animation', () => {
    const div = el('12 and 48')
    animateCounter(div, { trigger: 'immediate', duration: 2000, easing: 'linear' })
    now += 1000
    const pending = [...rafCallbacks]
    rafCallbacks = []
    pending.forEach((cb) => cb(now))
    // halfway: 12*0.5=6, 48*0.5=24
    expect(div.textContent).toBe('6 and 24')
  })
})

describe('animateCounter – easeInOut', () => {
  it('reaches the final value', () => {
    const div = el('100')
    animateCounter(div, { trigger: 'immediate', duration: 2000, easing: 'easeInOut' })
    flush()
    expect(div.textContent).toBe('100')
  })

  it('is less than half at the quarter-point (slow start)', () => {
    const div = el('100')
    animateCounter(div, { trigger: 'immediate', duration: 2000, easing: 'easeInOut' })
    now += 500 // 25% through
    const pending = [...rafCallbacks]
    rafCallbacks = []
    pending.forEach((cb) => cb(now))
    const value = parseInt(div.textContent ?? '0', 10)
    expect(value).toBeLessThan(50)
  })
})
