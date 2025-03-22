/**
 * Round float number to given decimal places
 *
 * @param value     The value to round
 * @param decimals  The number of decimal places (@default 2)
 * @returns         The rounded value
 */
export function roundFloat(value: number, decimals = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}
