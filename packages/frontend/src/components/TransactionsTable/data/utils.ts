/**
 * Helper Functions to process data for the Transactions Table
 */

import type { IAccount, ITransaction, SplitLineItem } from '@angelfish/core'
import type { FormData, TransactionRow } from './types'

/**
 * Process transactions to flatten Transactions/Line Items into rows for the
 * Transaction Table
 *
 * @param transactions          Array of Transactions to process
 * @param normalizedAccounts    Array of Normalized accounts to populate category row field
 */
export function buildTransactionRows(
  transactions: ITransaction[],
  normalizedAccounts: IAccount[],
): TransactionRow[] {
  const transactionRows: TransactionRow[] = []
  if (transactions.length <= 0) return transactionRows

  // Sort by Date to ensure running balance is correct
  const sortedTransactions = transactions
    .slice()
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  // All Transactions should be for same account so get Account Start Balance
  // From first Transaction
  let balance =
    normalizedAccounts.find((account) => account.id == transactions[0].account_id)
      ?.acc_start_balance ?? 0

  // Build TransactionRows
  sortedTransactions.forEach((transaction) => {
    const amount = parseFloat((transaction.amount * -1.0).toFixed(2))
    balance -= amount
    if (balance < 0.01 && balance > -0.01) balance = 0
    balance = parseFloat(balance.toFixed(2))
    const transactionRow = buildTransactionRow(normalizedAccounts, transaction, balance)
    transactionRows.push(transactionRow as TransactionRow)
  })

  return transactionRows
}

/**
 * Build a single transaction row for the TransactionTable from a Transaction
 *
 * @param normalizedAccounts  Full list of all accounts with relations
 * @param transaction         The transaction to create row for
 * @param balance             The running balance to display for this transaction
 * @returns                   TransactionRow
 */
export function buildTransactionRow(
  normalizedAccounts: IAccount[],
  transaction: ITransaction,
  balance?: number,
): TransactionRow {
  // Don't create rows for the account line items
  // or you'll get 2 rows per transaction
  const lineItems = transaction.line_items.filter(
    (lineItem) => lineItem.account_id !== transaction.account_id,
  )
  const isSplit = lineItems.length >= 2

  const account = normalizedAccounts.find((account) => account.id == transaction.account_id)!

  const transactionrow: TransactionRow = {
    tid: transaction.id,
    date: transaction.date,
    title: transaction.title,
    amount: transaction.amount,
    isReviewed: transaction.is_reviewed,
    transaction,
    isSplit,
    isNew: transaction.id ? false : true,
    account,
    owners: account?.acc_owners,
    currency: transaction.currency_code,
    ...(!isSplit && {
      tags: lineItems.at(0)?.tags,
      note: lineItems.at(0)?.note,

      category: normalizedAccounts.find((account) => account.id == lineItems.at(0)?.account_id)!,
    }),
    balance,
  }

  const subRows = lineItems.map((lineItem) => {
    return {
      // duplicate data from parent Transaction
      currency: transaction.currency_code,
      // unique data
      line_item_id: lineItem.id,

      category: normalizedAccounts.find((account) => account.id == lineItem.account_id)!,
      amount: Math.round((lineItem.amount * -1 + Number.EPSILON) * 100) / 100,
      tags: lineItem.tags,
      note: lineItem.note,
    } as TransactionRow
  })

  return { ...transactionrow, rows: subRows }
}

/**
 * Process rows to get array of recently used categories. Will return last N Categories
 * depending on limit
 *
 * @param transactionRows   Sorted array of Transaction Rows from buildTransactionRows function
 * @param limit             Max number of categories to return (@default 5)
 */
export function getRecentCategories(transactionRows: TransactionRow[], limit = 5): IAccount[] {
  const recentCategories: IAccount[] = []

  // Sort by most recently modified
  const sortedTransactions = [...transactionRows].sort(
    (rowA, rowB) => rowB.transaction.modified_on.getTime() - rowA.transaction.modified_on.getTime(),
  )

  // Loop through transactions and get first N distinct Categories
  for (const row of sortedTransactions) {
    if (row.category) {
      if (recentCategories.indexOf(row.category) == -1) {
        recentCategories.push(row.category)
      }
      if (recentCategories.length >= limit) {
        // Return if already at limit
        return recentCategories
      }
    }
  }

  return recentCategories
}

/**
 * Populate default form values for Transaction Edit Form from a TransactionRow
 *
 * @param transactionRow  The TransactionRow to populate form data from
 *                        If not provided, will return empty form data
 * @returns               FormData
 */
export function getTransactionFormData(transactionRow?: TransactionRow): FormData {
  if (transactionRow) {
    const lineItems: SplitLineItem[] = []
    for (const lineItem of transactionRow.rows ?? []) {
      // Only add line items not from the bank account transaction is associated with
      lineItems.push({
        id: lineItem.line_item_id,
        category_id: lineItem.category?.id ?? null,
        tags: [...(lineItem.tags ?? [])],
        note: lineItem.note ? lineItem.note : '',
        amount: lineItem.amount,
      })
    }
    return {
      date: transactionRow.date,
      title: transactionRow.title,
      amount: transactionRow.amount,
      is_reviewed: transactionRow.isReviewed,
      lineItems,
    }
  }
  return {
    date: new Date(),
    title: '',
    amount: 0,
    is_reviewed: false,
    lineItems: [],
  }
}
