/**
 * Parse a date string into a UTC Date object. Supports dd/mm/yy and mm/dd/yy formats, and
 * will try to automatically infer the correct format. If the date is invalid, will throw an
 * error.
 *
 * @param dateStr           The date string to parse
 * @param forceDDMMYY       Force the date to be parsed as dd/mm/yy format (default true)
 * @returns                 The parsed date as a UTC Date object
 * @throws                  Error if the date is invalid
 */
export function parseDate(dateStr: string, forceDDMMYY: boolean = true): Date {
  const parts = dateStr.split('/')

  if (parts.length !== 3) {
    throw new Error(`Bad date format [${dateStr}]`) // Not a valid date format
  }

  if (forceDDMMYY) {
    // Parse for dd/mm/yy format
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1 // Month is 0-indexed in JavaScript Date
    let year = parseInt(parts[2], 10)
    year += year < 100 ? 2000 : 0 // Adjust for two-digit year
    const date = new Date(Date.UTC(year, month, day))
    if (!isNaN(date.getTime())) {
      return date
    }
  } else {
    // Parse for mm/dd/yy format
    const day = parseInt(parts[1], 10)
    const month = parseInt(parts[0], 10) - 1 // Month is 0-indexed in JavaScript Date
    let year = parseInt(parts[2], 10)
    year += year < 100 ? 2000 : 0 // Adjust for two-digit year
    const date = new Date(Date.UTC(year, month, day))
    if (!isNaN(date.getTime())) {
      return date
    }
  }

  // If forced dd/mm/yy and it failed
  throw new Error(`Bad dd/mm/yy date format [${dateStr}]`)
}
