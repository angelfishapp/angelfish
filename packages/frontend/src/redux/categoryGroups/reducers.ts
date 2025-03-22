import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { ICategoryGroup } from '@angelfish/core'
import { Logger } from '@angelfish/core'

const logger = Logger.scope('CategoryGroupsReducer')

/**
 * Create CategoryGroup Slice.
 */

const categoryGroupSlice = createSlice({
  name: 'categoryGroups',
  initialState: [] as ICategoryGroup[],
  reducers: {
    /**
     * Set array of CategoryGroups to store
     */
    setCategoryGroups: (state, { payload: { categoryGroups } }) => {
      state.splice(0, categoryGroups.length, ...categoryGroups)
    },

    /**
     * Add or Update a CategoryGroup in store
     */
    setCategoryGroup: (state, action: PayloadAction<ICategoryGroup>) => {
      // See if category group is already in store, if not will return -1
      const index = state.findIndex((categoryGroup) => categoryGroup.id === action.payload.id)
      if (index > -1) {
        // Replace CategoryGroup with updated CategoryGroup
        state.splice(index, 1, action.payload)
      } else {
        // Add category to store, and increment Category Group total_count
        state.push(action.payload)
      }
    },

    /**
     * Remove a CategoryGroup from store
     */
    removeCategoryGroup: (state, action: PayloadAction<number>) => {
      // Check if category group is already in store, if not will return -1
      const index = state.findIndex((categoryGroup) => categoryGroup.id === action.payload)
      if (index > -1) {
        state.splice(index, 1)
        // TODO - NEED TO RE-ASSIGN EXISTING CATEGORIES TO ANOTHER GROUP!
      } else {
        logger.error('No Category Group with ID ' + action.payload + ' found.')
      }
    },
  },
})

export default categoryGroupSlice.reducer

/**
 * Define Internal Actions & Payload Types
 */

// Internal - allows Saga to set the `categoryGroups` property in the store
export const setCategoryGroups = categoryGroupSlice.actions.setCategoryGroups
// Internal - allows Saga to save a category group to the store
export const setCategoryGroup = categoryGroupSlice.actions.setCategoryGroup
// Internal - allows Saga to remove from the `categoryGroups` property in the store
export const removeCategoryGroup = categoryGroupSlice.actions.removeCategoryGroup
