export interface CounterOptions {
  /** Animation duration in milliseconds. Default: `2000` */
  duration?: number
  /** Easing function. Default: `'easeOut'` */
  easing?: 'linear' | 'easeOut' | 'easeInOut'
  /**
   * When to start the animation.
   * - `'scroll'` — starts when element enters the viewport (Intersection Observer)
   * - `'immediate'` — starts right away
   * Default: `'scroll'`
   */
  trigger?: 'immediate' | 'scroll'
  /**
   * Whether to re-animate each time the element re-enters the viewport.
   * Only applies when `trigger` is `'scroll'`. Default: `false`
   */
  repeat?: boolean
  /** Intersection threshold (0–1) for scroll trigger. Default: `0.2` */
  threshold?: number
  /**
   * Starting value for the animation. Default: `0`
   * Useful for animating from a previous value (e.g. live dashboards).
   */
  startValue?: number
  /** Called once when the animation finishes. */
  onComplete?: () => void
}

export interface ParsedNumber {
  /** Original matched string e.g. `"1,500,344"` */
  raw: string
  /** Numeric value e.g. `1500344` */
  value: number
  /** Decimal places e.g. `2` for `"34.67"` */
  decimals: number
  /** Whether the original used comma-grouping e.g. `"1,500,344"` */
  hasCommas: boolean
}

export interface ParsedString {
  /** Template with placeholders e.g. `"We have {{0}} customers"` */
  template: string
  numbers: ParsedNumber[]
}
