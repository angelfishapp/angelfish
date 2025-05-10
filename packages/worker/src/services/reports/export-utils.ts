/**
 * Define common properties and utilities for Exporting Reports Here
 */

/**
 * Define the frontend Theme pallet colors here
 * so they can be used in the exported XLSX file
 *
 * @see packages/frontend/src/app/theme.ts
 */
export const ThemePallet: {
  primary: {
    main: string
    light: string
    dark: string
  }
  secondary: {
    main: string
    light: string
    dark: string
  }
  summaryRowGrey: string
  stripedRowGrey: string
} = {
  primary: {
    main: '#1B5678',
    light: '#2A86BB',
    dark: '#10364C',
  },
  secondary: {
    main: '#47CCAF',
    light: '#6BD6BF',
    dark: '#318E7A',
  },
  summaryRowGrey: '#EEEEEE',
  stripedRowGrey: '#F5F5F5',
}

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
