import type { QifTransaction } from './qif-parser-types'

/**
 * Goes through all the transactions in a QIF file and determines the date format used.
 * If the date format is ambiguous, will return False.
 *
 * @param transactions    The transactions to check
 * @returns               True if the date format is international dd/mm/yy or ambiguous, False if US mm/dd/yy format
 * @throws                Error if the date format is invalid
 */
export function isDDMMYYFormat(transactions: QifTransaction[]): boolean {
  for (const transaction of transactions) {
    const parts = transaction.date.split('/')

    if (parts.length !== 3) {
      throw new Error(`Bad date format [${transaction.date}]`) // Not a valid date format
    }

    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)

    // If the day is greater than 12, assume it's dd/mm/yy format
    if (day > 12) {
      return true
    }

    // If month is greater than 12, assume it's mm/dd/yy format
    if (month > 12) {
      return false
    }
  }

  return true
}
