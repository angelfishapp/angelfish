import type { Row, SortingFn } from '@tanstack/react-table'

import type { IAccount, ITag } from '@angelfish/core'
import type { TransactionRow } from './types'

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
