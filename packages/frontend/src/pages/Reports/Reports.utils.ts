/**
 * Returns period in MMM-YY format to display in table
 * header
 *
 * @param period  The original period in mm-YYYY format
 * @returns       Formatted period as MMM-YY
 */
export function renderPeriodHeader(period: string): string {
  if (period.indexOf('-') != -1) {
    const [month, year] = period.split('-')
    const shortYear = year.slice(-2)

    const mapper: Record<string, string> = {
      '01': 'Jan-' + shortYear,
      '02': 'Feb-' + shortYear,
      '03': 'Mar-' + shortYear,
      '04': 'Apr-' + shortYear,
      '05': 'May-' + shortYear,
      '06': 'Jun-' + shortYear,
      '07': 'Jul-' + shortYear,
      '08': 'Aug-' + shortYear,
      '09': 'Sep-' + shortYear,
      '10': 'Oct-' + shortYear,
      '11': 'Nov-' + shortYear,
      '12': 'Dec-' + shortYear,
    }

    return mapper[month] ?? period
  }

  // Return period capitalised by default
  return period[0].toUpperCase() + period.substring(1)
}
