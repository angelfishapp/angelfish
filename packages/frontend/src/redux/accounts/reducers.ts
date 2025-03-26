import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { IAccount } from '@angelfish/core'
import { Logger } from '@angelfish/core'

const logger = Logger.scope('AccountsReducer')

/**
 * Create Account Slice.
 */

type AccountState = {
  accounts: IAccount[]
}

const initialState: AccountState = {
  accounts: [],
}

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    /**
     * Set the Accounts Array with new Array of Accounts
     */
    setAcounts: (state, { payload }: PayloadAction<IAccount[]>) => {
      state.accounts = payload
    },

    /**
     * Update or Add a new Account to Array of Accounts
     */
    setAccount: (state, action: PayloadAction<IAccount>) => {
      // See if Account is already in store, if not will return -1
      const index = state.accounts.findIndex((account) => account.id === action.payload.id)
      if (index > -1) {
        // Replace Account with updated Account
        state.accounts.splice(index, 1, action.payload)
      } else {
        // Add Account to store
        state.accounts.push(action.payload)
      }
    },

    /**
     * Remove an Account from Array of Accounts, or throw Error if not found
     */
    removeAccount: (state, action: PayloadAction<number>) => {
      // Check if Account is already in store, if not will return -1
      const index = state.accounts.findIndex((account) => account.id === action.payload)
      if (index > -1) {
        state.accounts.splice(index, 1)
      } else {
        logger.error('No Category with ID ' + action.payload + ' found.')
      }
    },
  },
})

export default accountsSlice.reducer

/**
 * Define Internal Actions & Payload Types
 */

// Internal - allows Saga to set the `accounts` property in the store
export const setAccounts = accountsSlice.actions.setAcounts
// Internal - allows Saga to save a category to the store
export const setAccount = accountsSlice.actions.setAccount
// Internal - allows Saga to remove from the `categories` property in the store
export const removeAccount = accountsSlice.actions.removeAccount
