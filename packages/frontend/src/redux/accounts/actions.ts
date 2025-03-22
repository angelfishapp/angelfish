/**
 * Public Actions that can be used by UI to interact with Store
 */

import { createAction } from '@reduxjs/toolkit'

import type { IAccount } from '@angelfish/core'

// Save Account Action
export type SaveAccountPayload = {
  account: Partial<IAccount>
}
export const saveAccount = createAction<SaveAccountPayload>('accounts/saveAccount')

// Delete Account Action
export type DeleteAccountPayload = {
  id: number
  reassignId?: number
}
export const deleteAccount = createAction<DeleteAccountPayload>('accounts/deleteAccount')

// Reload Accounts Action
export const reloadAccounts = createAction<Record<string, unknown>>('accounts/reload')
