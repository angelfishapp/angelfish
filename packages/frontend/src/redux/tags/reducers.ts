import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { ITag } from '@angelfish/core'
import { Logger } from '@angelfish/core'

const logger = Logger.scope('TagsReducer')

/**
 * Create Tag Slice.
 */

const tagSlice = createSlice({
  name: 'tags',
  initialState: [] as ITag[],
  reducers: {
    /**
     * Set array of Tags to store
     */
    setTags: (state, { payload: { tags } }) => {
      state.splice(0, tags.length, ...tags)
    },

    /**
     * Add or Update an Tag in store
     */
    setTag: (state, action: PayloadAction<ITag>) => {
      // See if Tag is already in store, if not will return -1
      const index = state.findIndex((tag) => tag.id === action.payload.id)
      if (index > -1) {
        // Replace Tag with updated Tag
        state.splice(index, 1, action.payload)
      } else {
        // Add Tag to store
        state.push(action.payload)
      }
    },

    /**
     * Remove a Tag from store
     */
    removeTag: (state, action: PayloadAction<number>) => {
      // Check if Tag is already in store, if not will return -1
      const index = state.findIndex((tag) => tag.id === action.payload)
      if (index > -1) {
        state.splice(index, 1)
      } else {
        logger.error('No Tag with ID ' + action.payload + ' found.')
      }
    },
  },
})

export default tagSlice.reducer

/**
 * Define Internal Actions & Payload Types
 */

// Internal - allows Saga to set the `tags` property in the store
export const setTags = tagSlice.actions.setTags
// Internal - allows Saga to save a Tag to the store
export const setTag = tagSlice.actions.setTag
// Internal - allows Saga to remove a Tag in the store
export const removeTag = tagSlice.actions.removeTag
