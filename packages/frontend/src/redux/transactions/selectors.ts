/**
 * Selectors to get data from Store
 */

import type { ITransaction } from '@angelfish/core'
import type { RootState } from '../reducers'

/**
 * Fetches all the Transactions for current query in the Store
 */
export const selectAllTransactions = (state: RootState) =>
  state.transactions.transactions as ITransaction[]
