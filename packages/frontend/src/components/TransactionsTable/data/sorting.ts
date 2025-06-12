import type { Row, SortingFn } from '@tanstack/react-table'

import type { IAccount, ITag } from '@angelfish/core'
import type { TransactionRow } from './types'

/**
 * Column Sort transactions by Date in same way as when calculating running balance
 * to ensure the transactions are displayed in same order they were processed. Use
 * this for Date columns in the Transaction Table.
 *
 * @param rowA        1st Row to compare
 * @param rowB        2nd Row to compare
 * @param columnId    Column ID being sorted
 * @returns           -1 a < b; 0 a == b; 1 a > b
 */
export const DateColSort: SortingFn<TransactionRow> = (
  rowA: Row<TransactionRow>,
  rowB: Row<TransactionRow>,
  columnId: string,
): number => {
  const dateA = rowA.getValue<Date>(columnId)
  const dateB = rowB.getValue<Date>(columnId)
  if (dateA === undefined) return -1
  if (dateB === undefined) return 1
  return DateSort(dateA, rowA.original.transaction.id, dateB, rowB.original.transaction.id)
}

/**
 * Underlying function to sort two dates and tie-break by transaction ID. Added as function to make same date
 * transactions sort consistently in the same order when calculating running balance and column sorting so the
 * running balance is displayed in the correct order.
 *
 * @param dateA     Date of 1st transaction
 * @param idA       ID of 1st transaction
 * @param dateB     Date of 2nd transaction
 * @param idB       ID of 2nd transaction
 * @returns       -1 a < b; 0 a == b; 1 a > b
 */
export function DateSort(dateA: Date, idA: number, dateB: Date, idB: number): number {
  const dateDiff = dateA.getTime() - dateB.getTime()
  if (dateDiff !== 0) return dateDiff
  // Tie-break by transaction ID (or some other unique value)
  return idA - idB
}

/**
 * Provides sorting for account objects to sort names alphabetically
 *
 * @param rowA          1st Row to compare
 * @param rowB          2nd Row to compare
 * @param columnId      Column ID being sorted
 * @returns             -1 a < b; 0 a == b; 1 a > b
 */
export const AccountSort: SortingFn<TransactionRow> = (
  rowA: Row<TransactionRow>,
  rowB: Row<TransactionRow>,
  columnId: string,
): number => {
  // Create a String representation of the category that can be sorted alphabetically
  const catA = rowA.getValue<IAccount>(columnId)
  const catB = rowB.getValue<IAccount>(columnId)
  let catAStr = ''
  let catBStr = ''

  if (catA) {
    if (catA.class === 'ACCOUNT') {
      catAStr = `${catA.institution?.name} ${catA?.name}`
    } else {
      catAStr = `${catA.categoryGroup?.name} ${catA?.name}`
    }
  } else {
    // Ensure Unclassified Transactions are always at the top
    catAStr = rowA.original.isSplit ? 'Split' : 'AAAAAAAA'
  }
  if (catB) {
    if (catB.class === 'ACCOUNT') {
      catBStr = `${catB.institution?.name} ${catB?.name}`
    } else {
      catBStr = `${catB.categoryGroup?.name} ${catB?.name}`
    }
  } else {
    // Ensure Unclassified Transactions are always at the top
    catBStr = rowB.original.isSplit ? 'Split' : 'AAAAAAAA'
  }
  return catAStr.localeCompare(catBStr, undefined, { numeric: true })
}

/**
 * Provides sorting for Tags objects to sort names alphabetically
 *
 * @param rowA          1st Row to compare
 * @param rowB          2nd Row to compare
 * @param columnId      Column ID being sorted
 * @returns             -1 a < b; 0 a == b; 1 a > b
 */
export const TagsSort: SortingFn<TransactionRow> = (
  rowA: Row<TransactionRow>,
  rowB: Row<TransactionRow>,
  columnId: string,
): number => {
  // Create a String representation of the category that can be sorted alphabetically
  const tagsA = rowA.getValue<ITag[]>(columnId)
  const tagsB = rowB.getValue<ITag[]>(columnId)

  if (tagsA === undefined || tagsA.length === 0) return -1
  if (tagsB === undefined || tagsB.length === 0) return 1

  return tagsB.length - tagsA.length
}
