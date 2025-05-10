/**
 * Represents an object that can be compared.
 */
type ComparableObject = {
  created_on: Date
  modified_on: Date
  [key: string]: any
}

/**
 * Compares two objects excluding `created_on` & `modified_on`,
 * and determines which one is newer based on `modified_on`.
 *
 * @param obj1  The first object to compare.
 * @param obj2  The second object to compare.
 * @returns  0 if objects are identical (ignoring timestamps)
 *          -1 if obj1 is newer
 *           1 if obj2 is newer
 */
export function compareObjects(obj1: ComparableObject, obj2: ComparableObject): number {
  // Extract fields excluding `created_on` & `modified_on`
  const filteredKeys = Object.keys({ ...obj1, ...obj2 }).filter(
    (key) => key !== 'created_on' && key !== 'modified_on',
  )

  // Check if the objects are identical (ignoring timestamps)
  const isSame = filteredKeys.every((key) => obj1[key] === obj2[key])
  if (isSame) return 0

  // If different, determine which object is newer
  return obj1.modified_on > obj2.modified_on ? -1 : 1
}

/**
 * Parses an ISO 8601 date string from the database into a Date object. Will replace
 * a loose ISO string (without T using a space) with a strict ISO string, check the date
 * is valid and set the time to 00:00:00.
 *
 * @param date  The date ISO 8601 string to parse
 * @returns     The UTC Date object set to midnight
 */
export function parseDate(dateStr: string): Date {
  // Ensure the input is in ISO format with "T" separator
  const fixedDateStr = dateStr.includes(' ') ? dateStr.replace(' ', 'T') : dateStr

  // Extract YYYY, MM, DD from the date string
  const date = new Date(fixedDateStr)
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string')
  }

  // Create a UTC date at midnight
  const utcDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0),
  )

  return utcDate
}

/**
 * Formats a Date object into a string with format YYYY-MM-DD for the Cloud APIs.
 *
 * @param date  The Date object to format.
 * @returns     The formatted date string in YYYY-MM-DD format.
 */
export function formatDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Take an array of dates, filters out null values and sorts the remaining dates in ascending order to find
 * min and max dates of the array. Then, it checks if the min date is before the dataset start date and the
 * max date is after the dataset end date. If so, it returns an array of missing date ranges that need to be
 * fetched from the server to fill the gaps.
 *
 * @param dates             Array of dates to check
 * @param datasetStart      Start date of the dataset
 * @param datasetEnd        End date of the dataset
 * @returns
 */
export function findMissingDateRanges(
  dates: (Date | null)[],
  datasetStart: Date | null,
  datasetEnd: Date | null,
): { start: Date; end: Date }[] {
  // Filter out null values and sort dates in ascending order
  const validDates = dates
    .filter((date): date is Date => date !== null)
    .sort((a, b) => a.getTime() - b.getTime())

  if (validDates.length === 0) {
    return [] // No valid dates, no missing ranges
  }

  const earliestDate = validDates[0] // Smallest date in the input array
  const latestDate = validDates[validDates.length - 1] // Largest date in the input array

  // Case 0: No dataset start & end → Fetch the entire range
  if (!datasetStart && !datasetEnd) {
    return [{ start: earliestDate, end: latestDate }]
  }

  const missingRanges: { start: Date; end: Date }[] = []

  // Case 1: Earliest date is before datasetStart → Need to fetch from earliestDate to datasetStart
  if (!datasetStart || earliestDate < datasetStart) {
    missingRanges.push({ start: earliestDate, end: datasetStart ?? latestDate })
  }

  // Case 2: Latest date is after datasetEnd → Need to fetch from datasetEnd to latestDate
  if (!datasetEnd || latestDate > datasetEnd) {
    missingRanges.push({ start: datasetEnd ?? earliestDate, end: latestDate })
  }

  return missingRanges
}
