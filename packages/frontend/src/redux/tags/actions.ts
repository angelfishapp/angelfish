/**
 * Public Actions that can be used by UI to interact with Store
 */

import { createAction } from '@reduxjs/toolkit'

import type { ITagUpdate } from '@angelfish/core'

// Save Tag Action
export type SaveTagPayload = {
  tag: ITagUpdate
}
export const saveTag = createAction<SaveTagPayload>('tags/saveTag')

// Delete Tag Action
export type DeleteTagPayload = {
  id: number
}
export const deleteTag = createAction<DeleteTagPayload>('tags/deleteTag')

// Reload all Tags in Store from IPC
export const reloadTags = createAction<Record<string, unknown>>('tags/reloadTags')
