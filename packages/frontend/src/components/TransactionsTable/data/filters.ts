/**
 * Custom Filter Functions for react-table
 */

import type { FilterFn, Row } from '@tanstack/react-table'

import type { IAccount, ITag } from '@angelfish/core'
import type { TransactionRow } from './types'

/**
 * Custom React-Table Column Filter Function to handle Negative Values
 * of the Amounts
 *
 * @param row               Table Row to evaluation
 * @param columnId          Table Column Id to filter on
 * @param filterValue       The current filter value as [min, max]
 * @returns                 True to include, False to filter
 */
export const AmountFilter: FilterFn<TransactionRow> = (
  row: Row<TransactionRow>,
  columnId: string,
  filterValue: [number, number],
): boolean => {
  const [min, max] = filterValue

  let rowValue = row.getValue<number>(columnId)
  if (rowValue < 0) {
    rowValue = rowValue * -1
  }
  return rowValue >= min && rowValue <= max
}

/**
 * Custom React-Table Column Filter Function to filtering on the
 * Account/Category of the Transaction
 *
 * @param row               Table Row to evaluation
 * @param columnId          Table Column Id to filter on
 * @param filterValue       The current filter value of Account Ids Selected
 * @returns                 True to include, False to filter
 */
export const CategoryFilter: FilterFn<TransactionRow> = (
  row: Row<TransactionRow>,
  columnId: string,
  filterValue: number[],
): boolean => {
  // If no Categories Selected, show all
  if (filterValue.length === 0) return true

  const rowValue = row.getValue<IAccount | null>(columnId)

  // Handle split transactions
  if (row.original.isSplit) return false

  // Handle Uncategorized Transactions
  if (!rowValue) return filterValue.includes(0)

  return filterValue.includes(rowValue.id)
}

/**
 * Custom React-Table Column Filter Function to filtering in between
 * two Dates
 *
 * @param row               Table Row to evaluation
 * @param columnId          Table Column Id to filter on
 * @param filterValue       The current filter value as [startDate, EndDate]
 * @returns                 True to include, False to filter
 */
export const DateFilter: FilterFn<TransactionRow> = (
  row: Row<TransactionRow>,
  columnId: string,
  filterValue: [Date, Date],
): boolean => {
  // If no Dates Selected, show all
  if (!filterValue) {
    return true
  }
  const [startDate, endDate] = filterValue

  const rowValue = row.getValue<Date>(columnId)
  return rowValue >= startDate && rowValue <= endDate
}

/**
 * Custom React-Table Column Filter Function to filter Payee Column by an array
 * of columns
 *
 * @param row               Table Row to evaluation
 * @param columnId          Table Column Id to filter on
 * @param filterValue       The current filter value as string[]
 * @returns                 True to include, False to filter
 */
export const PayeeFilter: FilterFn<TransactionRow> = (
  row: Row<TransactionRow>,
  columnId: string,
  filterValue: string[],
): boolean => {
  // If no Payees Selected, show all
  if (filterValue.length === 0) {
    return true
  }

  const rowValue = row.getValue<string>(columnId)
  return filterValue.includes(rowValue)
}

/**
 * Custom React-Table Column Filter Function to filter Tags Column by an array
 * of columns
 *
 * @param row               Table Row to evaluation
 * @param columnId          Table Column Id to filter on
 * @param filterValue       The current filter value as number[]
 * @returns                 True to include, False to filter
 */
export const TagsFilter: FilterFn<TransactionRow> = (
  row: Row<TransactionRow>,
  columnId: string,
  filterValue: number[],
): boolean => {
  // If no Tags Selected, show all
  if (filterValue.length === 0) {
    return true
  }
  const rowValue = row.getValue<ITag[]>(columnId) ?? []
  return rowValue.some((tag) => filterValue.includes(tag.id))
}
