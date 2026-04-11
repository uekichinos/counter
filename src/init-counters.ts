import type { CounterOptions } from './types'
import { animateCounter } from './animate-counter'

/**
 * Finds all elements matching `selector` and applies `animateCounter` to each.
 * Designed for declarative HTML usage with `data-counter` attributes.
 *
 * Per-element overrides via data attributes:
 *  - `data-counter-duration="3000"`
 *  - `data-counter-trigger="immediate"`
 *  - `data-counter-repeat="true"`
 *
 * @example
 * // HTML: <span data-counter>RM55 billion</span>
 * initCounters('[data-counter]')
 *
 * // With global options
 * initCounters('[data-counter]', { duration: 3000, trigger: 'scroll' })
 */
export function initCounters(selector: string, options: CounterOptions = {}): void {
  const elements = document.querySelectorAll<HTMLElement>(selector)

  elements.forEach((el) => {
    const elOptions: CounterOptions = { ...options }

    const duration = el.dataset.counterDuration
    if (duration) {
      const parsed = parseInt(duration, 10)
      if (!isNaN(parsed)) elOptions.duration = parsed
    }

    const trigger = el.dataset.counterTrigger
    if (trigger === 'immediate' || trigger === 'scroll') elOptions.trigger = trigger

    const repeat = el.dataset.counterRepeat
    if (repeat !== undefined) elOptions.repeat = repeat === 'true'

    animateCounter(el, elOptions)
  })
}
