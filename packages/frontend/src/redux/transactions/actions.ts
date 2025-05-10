/**
 * Public Actions that can be used by UI to interact with Store
 */

import { createAction } from '@reduxjs/toolkit'

import type { AppCommandIds, AppCommandRequest, ITransactionUpdate } from '@angelfish/core'

export const listTransactions = createAction<AppCommandRequest<AppCommandIds.LIST_TRANSACTIONS>>(
  'transactions/listTransactions',
)

// Update An Array of Transactions
export type SaveTransactionsPayload = {
  transactions: ITransactionUpdate[]
}
export const saveTransactions = createAction<SaveTransactionsPayload>(
  'transactions/saveTransactions',
)

// Delete A Transaction
export type DeleteTransactionPayload = {
  id: number
}
export const deleteTransaction = createAction<DeleteTransactionPayload>(
  'transactions/deleteTransaction',
)
