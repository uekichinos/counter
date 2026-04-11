import { describe, expect, it } from 'vitest'
import { easings } from '../easing'

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

  it('easeOut is greater than 0.5 at midpoint (accelerates early)', () => {
    expect(easings.easeOut(0.5)).toBeGreaterThan(0.5)
  })

  it('easeInOut is exactly 0.5 at midpoint (symmetric)', () => {
    expect(easings.easeInOut(0.5)).toBeCloseTo(0.5)
  })

  it('easeInOut is less than 0.5 before midpoint (slow start)', () => {
    expect(easings.easeInOut(0.25)).toBeLessThan(0.5)
  })

  it('easeOut is monotonically increasing', () => {
    for (let t = 0.1; t <= 1; t += 0.1) {
      expect(easings.easeOut(t)).toBeGreaterThan(easings.easeOut(t - 0.1))
    }
  })
})
