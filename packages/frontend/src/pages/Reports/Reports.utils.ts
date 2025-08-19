/**
 * Returns period in localized MMM-YY format to display in table header
 *
 * @param period   The original period in mm-YYYY format
 * @param locale   The current app locale (e.g. "en", "ar", "fr")
 * @returns        Formatted period as MMM-YY localized
 */
export function renderPeriodHeader(period: string, locale: 'en' | 'ar' | 'fr'): string {
  if (period.includes('-')) {
    const [month, year] = period.split('-')
    const date = new Date(Number(year), Number(month) - 1) // month is 0-based

    // Use Intl for localization
    const monthName = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date)
    const shortYear = year.slice(-2)

    return `${monthName}-${shortYear}`
  }

  // Return period capitalised by default
  return period.charAt(0).toUpperCase() + period.substring(1)
}
