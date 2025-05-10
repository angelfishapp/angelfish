import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { ITransaction } from '@angelfish/core'
import { Logger } from '@angelfish/core'

const logger = Logger.scope('TransactionsReducer')

/**
 * Create Transactions Slice.
 */

type TransactionState = {
  query: Record<string, unknown>
  transactions: ITransaction[]
}

const initialState: TransactionState = {
  query: {},
  transactions: [],
}

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    /**
     * Set current query filters for transactions
     */
    setQuery: (state, { payload: query }) => {
      state.query = query
    },

    /**
     * Set Transactions
     */
    setTransactions: (state, { payload: { transactions } }) => {
      state.transactions = transactions
    },

    /**
     * Update Array of Transactions
     */
    updateTransactions: (state, action: PayloadAction<ITransaction[]>) => {
      const payload = action.payload
      for (const transaction of payload) {
        // See if Transaction is already in store, if not will return -1
        const index = state.transactions.findIndex((t) => t.id === transaction.id)
        if (index > -1) {
          // Replace Transaction with updated Transaction
          state.transactions.splice(index, 1, transaction)
        } else {
          // Add Transaction to store
          state.transactions.push(transaction)
        }
      }
    },

    /**
     * Update or Add a new Transaction to Array of Transactions
     */
    setTransaction: (state, action: PayloadAction<ITransaction>) => {
      // See if Transaction is already in store, if not will return -1
      const index = state.transactions.findIndex(
        (transaction) => transaction.id === action.payload.id,
      )
      if (index > -1) {
        // Replace Transaction with updated Account
        state.transactions.splice(index, 1, action.payload)
      } else {
        // Add Transaction to store
        state.transactions.push(action.payload)
      }
    },

    /**
     * Remove an Account from Array of Accounts, or throw Error if not found
     */
    removeTransaction: (state, action: PayloadAction<number>) => {
      // Check if Transaction is already in store, if not will return -1
      const index = state.transactions.findIndex((transaction) => transaction.id === action.payload)
      if (index > -1) {
        state.transactions.splice(index, 1)
      } else {
        logger.error('No Transaction with ID ' + action.payload + ' found.')
      }
    },
  },
})

export default transactionsSlice.reducer

/**
 * Define Internal Actions & Payload Types
 */

// Internal - allows Saga to set the `query` property in the store
export const setQuery = transactionsSlice.actions.setQuery
// Internal - allows Saga to set the `transactions` property in the store
export const setTransactions = transactionsSlice.actions.setTransactions
// Internal - allows Saga to update an Array of Transactions in the store
export const updateTransactions = transactionsSlice.actions.updateTransactions
// Internal - allows Saga to save a Transaction to the store
export const setTransaction = transactionsSlice.actions.setTransaction
// Internal - allows Saga to remove a Transaction from the store
export const removeTransaction = transactionsSlice.actions.removeTransaction
