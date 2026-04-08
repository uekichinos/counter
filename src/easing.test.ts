import { describe, expect, it } from 'vitest'
import { easings } from './easing'

describe('easings', () => {
  const fns = Object.keys(easings) as Array<keyof typeof easings>

  fns.forEach((name) => {
    it(`${name}: starts at 0 and ends at 1`, () => {
      expect(easings[name](0)).toBeCloseTo(0)
      expect(easings[name](1)).toBeCloseTo(1)
    })

    it(`${name}: stays within [0, 1] for t in [0, 1]`, () => {
      for (let t = 0; t <= 1; t += 0.1) {
        const v = easings[name](t)
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThanOrEqual(1)
      }
    })
  })

  it('linear is strictly linear at midpoint', () => {
    expect(easings.linear(0.5)).toBeCloseTo(0.5)
  })
})
