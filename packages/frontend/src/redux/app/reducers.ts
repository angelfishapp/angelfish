import { createSlice } from '@reduxjs/toolkit'

import type { IAuthenticatedUser, IBook } from '@angelfish/core'

/**
 * Create App Slice.
 */

/**
 * Sync Info for App
 */
export type SyncInfo = {
  isSyncing: boolean
  durationMs: number
  success: boolean
  startTime?: number
  finishTime?: number
  error?: string
}

/**
 * User App Settings
 */
export type UserSettings = {
  enableBackgroundAnimations: boolean
}

/**
 * App State
 */
export type AppState = {
  isInitialised: boolean
  book?: IBook
  isAuthenticated: boolean
  authenticatedUser?: IAuthenticatedUser
  syncInfo: SyncInfo
  userSettings: UserSettings
}

const initialState: AppState = {
  isInitialised: false,
  book: undefined,
  isAuthenticated: false,
  authenticatedUser: undefined,
  syncInfo: {
    isSyncing: false,
    success: false,
    durationMs: 0,
  },
  userSettings: {
    enableBackgroundAnimations: false,
  },
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    /**
     * Set Book for store
     */
    setBook: (state, { payload: { book } }) => {
      state.book = book
    },

    /**
     * Set if user isAuthenticated or not
     */
    setIsAuthenticated: (state, { payload: { isAuthenticated } }) => {
      state.isAuthenticated = isAuthenticated
    },

    /**
     * Set the current authenticated user logged in if authenthenticated
     */
    setAuthenticatedUser: (state, { payload: { authenticatedUser } }) => {
      state.authenticatedUser = authenticatedUser
    },

    /**
     * Set the current user's local application settings
     */
    setUserSettings: (state, { payload: { settings } }) => {
      state.userSettings = settings
    },

    /**
     * Set the App state with single action to set all properties at once
     */
    setAppState: (
      state,
      { payload: { isAuthenticated, authenticatedUser, book, userSettings } },
    ) => {
      state.book = book
      state.authenticatedUser = authenticatedUser
      state.isAuthenticated = isAuthenticated
      state.userSettings = userSettings
      state.isInitialised = true
    },

    /**
     * Set the Sync State at Start for the App if the database is being synced with the Cloud APIs
     */
    setStartSync: (state) => {
      state.syncInfo.isSyncing = true
      state.syncInfo.startTime = Date.now()
      state.syncInfo.success = false
      state.syncInfo.durationMs = 0
      state.syncInfo.finishTime = undefined
      state.syncInfo.error = undefined
    },

    /**
     * Set the Sync State at Finish when the App has finished syncing with Cloud APIs
     */
    setFinishSync: (state, { payload: { success, duration, error } }) => {
      state.syncInfo.isSyncing = false
      state.syncInfo.finishTime = Date.now()
      state.syncInfo.success = success
      state.syncInfo.durationMs = duration
      state.syncInfo.error = error
    },
  },
})

export default appSlice.reducer

/**
 * Define Internal Actions & Payload Types
 */

// Internal - allows Saga to set the `book` property in the store
export const setBook = appSlice.actions.setBook
// Internal - allows Saga to set if user is Authenticated or not
export const setIsAuthenticated = appSlice.actions.setIsAuthenticated
// Internal - allows Saga to set current Authenticated User if Authenticated
export const setAuthenticatedUser = appSlice.actions.setAuthenticatedUser
// Internal - allows Saga to set current UserSettings
export const setUserSettings = appSlice.actions.setUserSettings
// Internal - allows Saga to set App State in one call
export const setAppState = appSlice.actions.setAppState
// Internal - allows Saga to set Sync State at Start
export const setStartSync = appSlice.actions.setStartSync
// Internal - allows Saga to set Sync State at Finish
export const setFinishSync = appSlice.actions.setFinishSync
