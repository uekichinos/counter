import type { ParsedNumber, ParsedString } from './types'

/**
 * Matches:
 *  - Comma-grouped integers:  1,500,344
 *  - Plain integers:          55
 *  - Decimals (both forms):   34.67  /  1,500.75
 *
 * Non-capturing groups keep commas as part of one token.
 */
const NUMBER_REGEX = /\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?/g

export function parseString(str: string): ParsedString {
  const numbers: ParsedNumber[] = []
  let template = ''
  let lastIndex = 0

  NUMBER_REGEX.lastIndex = 0

  let match: RegExpExecArray | null
  while ((match = NUMBER_REGEX.exec(str)) !== null) {
    template += str.slice(lastIndex, match.index)
    template += `{{${numbers.length}}}`
    lastIndex = match.index + match[0].length

    const raw = match[0]
    const hasCommas = raw.includes(',')
    const value = parseFloat(raw.replace(/,/g, ''))
    const decimalMatch = raw.match(/\.(\d+)$/)
    const decimals = decimalMatch ? decimalMatch[1].length : 0

    numbers.push({ raw, value, decimals, hasCommas })
  }

  template += str.slice(lastIndex)

  return { template, numbers }
}
