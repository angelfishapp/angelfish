/**
 * Helper function to round a number to a specific number of decimal places.
 * By default, it rounds to 2 decimal places.
 *
 * @param num               The number to round.
 * @param decimalPlaces     The number of decimal places to round to. Default is 2.
 *                          If set to 0, it will round to the nearest integer
 * @returns                 The rounded number
 */
export function roundNumber(num: number, decimalPlaces: number = 2): number {
  return parseFloat(num.toFixed(decimalPlaces))
}
