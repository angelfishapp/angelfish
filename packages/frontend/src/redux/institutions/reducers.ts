import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { IInstitution } from '@angelfish/core'
import { Logger } from '@angelfish/core'

const logger = Logger.scope('InstitutionsReducer')

/**
 * Create Institution Slice.
 */

type InstitutionsState = {
  institutions: IInstitution[]
}

const initialState: InstitutionsState = {
  institutions: [],
}

const institutionSlice = createSlice({
  name: 'institutions',
  initialState,
  reducers: {
    /**
     * Set array of Institutions to store
     */
    setInstitutions: (state, action: PayloadAction<IInstitution[]>) => {
      state.institutions = action.payload
    },

    /**
     * Add or Update an Institution in store
     */
    setInstitution: (state, action: PayloadAction<IInstitution>) => {
      // See if Institution is already in store, if not will return -1
      const index = state.institutions.findIndex(
        (institution) => institution.id === action.payload.id,
      )
      if (index > -1) {
        // Replace Institution with updated Institution
        state.institutions.splice(index, 1, action.payload)
      } else {
        // Add Institution to store
        state.institutions.push(action.payload)
      }
    },

    /**
     * Remove a Institution from store
     */
    removeInstitution: (state, action: PayloadAction<number>) => {
      // Check if Institution is already in store, if not will return -1
      const index = state.institutions.findIndex((institution) => institution.id === action.payload)
      if (index > -1) {
        state.institutions.splice(index, 1)
      } else {
        logger.error('No Institution with ID ' + action.payload + ' found.')
      }
    },
  },
})

export default institutionSlice.reducer

/**
 * Define Internal Actions & Payload Types
 */

// Internal - allows Saga to set the `institutions` property in the store
export const setInstitutions = institutionSlice.actions.setInstitutions
// Internal - allows Saga to save an Institution to the store
export const setInstitution = institutionSlice.actions.setInstitution
// Internal - allows Saga to remove an Institution in the store
export const removeInstitution = institutionSlice.actions.removeInstitution
