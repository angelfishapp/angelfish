/**
 * Public Actions that can be used by UI to interact with Store
 */

import { createAction } from '@reduxjs/toolkit'

import type { IBookUpdate } from '@angelfish/core'

// Get App State
export const getAppState = createAction<Record<string, unknown>>('app/getAppState')

// Update Existing Book
export type SaveBookPayload = {
  book: IBookUpdate
}
export const saveBook = createAction<SaveBookPayload>('app/saveBook')
