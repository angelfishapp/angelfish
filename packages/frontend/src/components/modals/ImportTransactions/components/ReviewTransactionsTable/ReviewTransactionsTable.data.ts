import type { RowSelectionState } from '@tanstack/react-table'

import type { IAccount, ReconciledTransaction } from '@angelfish/core'

/**
 * Transformed Reconciled Transaction Row for rendering in the
 * ReviewTransactionsTable.
 */
export interface ReconciledTransactionRow {
  date: Date
  title: string
  isSplit: boolean
  category?: IAccount
  amount: number
  currency?: string
  import: boolean
  reconciliation: ReconciledTransaction['reconciliation']
  account_id?: number
  account?: IAccount
  transaction: ReconciledTransaction
  notes?: string
  tags?: string[]
  reviewed?: boolean
}

/**
 * Flatten transaction data for the table as line_items are nested and need to determine
 * the correct category from the array.
 *
 * @param transactions          List of reconciled transactions
 * @param normalizedAccounts    List of normalized accounts with all relations
 * @returns                     Flattened transaction rows for the table
 */
export function flattenRowData(
  transactions: ReconciledTransaction[],
  normalizedAccounts: IAccount[],
): ReconciledTransactionRow[] {
  return transactions.map((row) => {
    // Don't create rows for the account line items
    // or you'll get 2 rows per transaction
    const lineItems = row.line_items.filter((lineItem) => lineItem.account_id !== row.account_id)
    const isSplit = lineItems.length >= 2
    return {
      date: row.date as Date,
      title: row.title as string,
      isSplit,
      category: !isSplit
        ? normalizedAccounts.find((account) => account.id === lineItems[0].account_id)
        : undefined,
      amount: row.amount as number,
      currency: row.currency_code,
      import: row.import,
      reconciliation: row.reconciliation,
      account_id: row.account_id,
      account: normalizedAccounts.find((account) => account.id === row.account_id),
      transaction: row,
    }
  })
}

/**
 * Get initial list of selected rows from the reconciled transactions. Only import=true transactions
 * will be selected by default.
 *
 * @param transactions  The reconciled transactions to review
 * @returns
 */
export function getSelectedRowState(transactions: ReconciledTransaction[]): RowSelectionState {
  return transactions.reduce((acc: RowSelectionState, transaction, index) => {
    if (transaction.import) {
      acc[index] = true
    }
    return acc
  }, {})
}
