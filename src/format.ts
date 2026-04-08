/**
 * Formats an animated value to match the original number's style.
 *
 * @param value   - current animated value (may be fractional mid-animation)
 * @param decimals - number of decimal places to show
 * @param hasCommas - whether to add comma grouping separators
 */
export function formatNumber(value: number, decimals: number, hasCommas: boolean): string {
  const fixed = value.toFixed(decimals)

  if (!hasCommas) return fixed

  const [intPart, decPart] = fixed.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return decPart !== undefined ? `${grouped}.${decPart}` : grouped
}
