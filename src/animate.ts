import type { CounterOptions, ParsedString } from './types'
import { formatNumber } from './format'
import { easings } from './easing'

type AnimateOptions = Required<Pick<CounterOptions, 'duration' | 'easing'>> &
  Pick<CounterOptions, 'startValue' | 'onComplete'>

/**
 * Runs the number animation on a single element.
 * Resolves when animation completes.
 *
 * Respects `prefers-reduced-motion`: jumps straight to the final value
 * if the user has requested reduced motion in their OS settings.
 */
export function runAnimation(
  el: HTMLElement,
  parsed: ParsedString,
  options: AnimateOptions,
): Promise<void> {
  return new Promise((resolve) => {
    const { duration, easing, startValue = 0, onComplete } = options

    function finish() {
      let text = parsed.template
      for (let i = 0; i < parsed.numbers.length; i++) {
        const { value, decimals, hasCommas } = parsed.numbers[i]
        text = text.replace(`{{${i}}}`, formatNumber(value, decimals, hasCommas))
      }
      el.textContent = text
      onComplete?.()
      resolve()
    }

    // Respect OS-level reduced-motion preference — skip animation entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }

    const easeFn = easings[easing]
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const t = easeFn(progress)

      let text = parsed.template
      for (let i = 0; i < parsed.numbers.length; i++) {
        const { value, decimals, hasCommas } = parsed.numbers[i]
        const current = startValue + t * (value - startValue)
        text = text.replace(`{{${i}}}`, formatNumber(current, decimals, hasCommas))
      }

      el.textContent = text

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        onComplete?.()
        resolve()
      }
    }

    requestAnimationFrame(tick)
  })
}
