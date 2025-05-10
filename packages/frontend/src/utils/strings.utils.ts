/**
 * Utility function to capitalise the first letter of each word
 * in a string
 *
 * @param str   The string to capitalise
 * @returns     The capitalised string
 */
export function capitalizeEachWord(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
