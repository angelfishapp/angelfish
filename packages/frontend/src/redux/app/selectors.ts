/**
 * Selectors to get app data from Store
 */

import type { IAuthenticatedUser, IBook } from '@angelfish/core'
import type { RootState } from '../reducers'
import type { SyncInfo, UserSettings } from './reducers'

/**
 * Fetches if the App has been initialised (true) or not (false)
 */
export const selectIsInitialised = (state: RootState) => state.app.isInitialised as boolean

/**
 * Fetches the Book for the household/business
 */
export const selectBook = (state: RootState) => state.app.book as IBook | undefined

/**
 * Fetches if the current user is Authenticated (true) or not
 */
export const selectIsAuthenticated = (state: RootState) => state.app.isAuthenticated as boolean

/**
 * Fetches current authenticed User if logged in, otherwise undefined
 */
export const selectAuthenticatedUser = (state: RootState) =>
  state.app.authenticatedUser as IAuthenticatedUser | undefined

/**
 * Fetches current sync status for App
 */
export const selectSyncInfo = (state: RootState) => state.app.syncInfo as SyncInfo

/**
 * Fetches local user settings for App
 */
export const selectUserSettings = (state: RootState) => state.app.userSettings as UserSettings
