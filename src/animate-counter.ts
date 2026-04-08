import type { CounterOptions } from './types'
import { parseString } from './parse'
import { runAnimation } from './animate'

const DEFAULTS: Required<CounterOptions> = {
  duration: 2000,
  easing: 'easeOut',
  trigger: 'scroll',
  repeat: false,
  threshold: 0.2,
  startValue: 0,
  onComplete: () => {},
}

/**
 * Animates all numbers found in `el`'s text content from 0 to their target values.
 *
 * @param el      - target DOM element
 * @param options - animation options
 *
 * @example
 * // Scroll-triggered, once
 * animateCounter(document.querySelector('#revenue'))
 *
 * // Immediate, repeat on each scroll-in
 * animateCounter(el, { trigger: 'immediate' })
 */
export function animateCounter(el: HTMLElement, options: CounterOptions = {}): void {
  const opts = { ...DEFAULTS, ...options }
  const originalText = el.textContent ?? ''
  const parsed = parseString(originalText)

  if (parsed.numbers.length === 0) return

  function start() {
    runAnimation(el, parsed, opts)
  }

  if (opts.trigger === 'immediate') {
    start()
    return
  }

  let animating = false

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !animating) {
          animating = true
          runAnimation(el, parsed, opts).then(() => {
            animating = false
          })

          if (!opts.repeat) {
            observer.unobserve(el)
          }
        }
      }
    },
    { threshold: opts.threshold },
  )

  observer.observe(el)
}
