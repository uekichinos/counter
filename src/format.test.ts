import { describe, expect, it } from 'vitest'
import { formatNumber } from './format'

describe('formatNumber', () => {
  it('formats an integer with no commas', () => {
    expect(formatNumber(55, 0, false)).toBe('55')
  })

  it('formats a decimal', () => {
    expect(formatNumber(34.67, 2, false)).toBe('34.67')
  })

  it('formats with comma grouping', () => {
    expect(formatNumber(1500344, 0, true)).toBe('1,500,344')
  })

  it('formats mid-animation value with comma grouping', () => {
    expect(formatNumber(750172, 0, true)).toBe('750,172')
  })

  it('formats a decimal with commas', () => {
    expect(formatNumber(1234.56, 2, true)).toBe('1,234.56')
  })

  it('pads decimals correctly at value 0', () => {
    expect(formatNumber(0, 2, false)).toBe('0.00')
  })

  it('floors decimal count from original format', () => {
    // mid-animation: 17.334... shown as 2 decimal places
    expect(formatNumber(17.334, 2, false)).toBe('17.33')
  })
})
