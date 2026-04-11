import { describe, expect, it } from 'vitest'
import { parseString } from '../parse'

describe('parseString', () => {
  it('extracts a plain integer', () => {
    const result = parseString('RM55 billion')
    expect(result.numbers).toHaveLength(1)
    expect(result.numbers[0]).toMatchObject({ value: 55, decimals: 0, hasCommas: false })
    expect(result.template).toBe('RM{{0}} billion')
  })

  it('extracts a plain integer with space', () => {
    const result = parseString('RM 55 million')
    expect(result.numbers[0].value).toBe(55)
    expect(result.template).toBe('RM {{0}} million')
  })

  it('extracts a decimal number', () => {
    const result = parseString('34.67%')
    expect(result.numbers[0]).toMatchObject({ value: 34.67, decimals: 2, hasCommas: false })
    expect(result.template).toBe('{{0}}%')
  })

  it('extracts a comma-grouped number', () => {
    const result = parseString('We have 1,500,344 customer subscribe to our system')
    expect(result.numbers[0]).toMatchObject({ value: 1500344, decimals: 0, hasCommas: true })
    expect(result.template).toBe('We have {{0}} customer subscribe to our system')
  })

  it('extracts multiple numbers from one string', () => {
    const result = parseString('RM 55 million and 34.67%')
    expect(result.numbers).toHaveLength(2)
    expect(result.numbers[0].value).toBe(55)
    expect(result.numbers[1].value).toBe(34.67)
    expect(result.template).toBe('RM {{0}} million and {{1}}%')
  })

  it('returns empty numbers for string with no numbers', () => {
    const result = parseString('No numbers here')
    expect(result.numbers).toHaveLength(0)
    expect(result.template).toBe('No numbers here')
  })

  it('handles comma-grouped decimal', () => {
    const result = parseString('$1,234.56 total')
    expect(result.numbers[0]).toMatchObject({ value: 1234.56, decimals: 2, hasCommas: true })
  })

  it('extracts number at start of string', () => {
    const result = parseString('100 items in stock')
    expect(result.numbers[0].value).toBe(100)
    expect(result.template).toBe('{{0}} items in stock')
  })

  it('extracts number at end of string', () => {
    const result = parseString('Total count: 42')
    expect(result.numbers[0].value).toBe(42)
    expect(result.template).toBe('Total count: {{0}}')
  })

  it('preserves raw string for comma-grouped values', () => {
    const result = parseString('1,500,344')
    expect(result.numbers[0].raw).toBe('1,500,344')
  })

  it('returns correct decimals count for multi-decimal number', () => {
    const result = parseString('99.999%')
    expect(result.numbers[0].decimals).toBe(3)
  })
})
