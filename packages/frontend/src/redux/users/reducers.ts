import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { IUser } from '@angelfish/core'
import { Logger } from '@angelfish/core'

const logger = Logger.scope('UsersReducer')

/**
 * Create User Slice.
 */

type TagState = {
  users: IUser[]
}

const initialState: TagState = {
  users: [],
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    /**
     * Set array of Users to store
     */
    setUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload
    },

    /**
     * Add or Update a User in store
     */
    setUser: (state, action: PayloadAction<IUser>) => {
      // See if User is already in store, if not will return -1
      const index = state.users.findIndex((user) => user.id === action.payload.id)
      if (index > -1) {
        // Replace User with updated User
        state.users.splice(index, 1, action.payload)
      } else {
        // Add User to store
        state.users.push(action.payload)
      }
    },

    /**
     * Remove a User from store
     */
    removeUser: (state, action: PayloadAction<number>) => {
      // Check if Institution is already in store, if not will return -1
      const index = state.users.findIndex((user) => user.id === action.payload)
      if (index > -1) {
        state.users.splice(index, 1)
      } else {
        logger.error('No User with ID ' + action.payload + ' found.')
      }
    },
  },
})

export default usersSlice.reducer

/**
 * Define Internal Actions & Payload Types
 */

// Internal - allows Saga to set the `users` property in the store
export const setUsers = usersSlice.actions.setUsers
// Internal - allows Saga to save a User to the store
export const setUser = usersSlice.actions.setUser
// Internal - allows Saga to remove a User in the store
export const removeUser = usersSlice.actions.removeUser
