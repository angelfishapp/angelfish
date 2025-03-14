/**
 * Define all App wide commands here to ensure type safety and consistency across the app when calling App commands.
 *
 * To add a new command:
 *
 * 1. Add a new unique command ID to the `AppCommandIds` enum.
 * 2. Define the request and response types for the command in the `AppCommandDefinitions` interface.
 *
 * You can then use the CommandClient.executeAppCommand() method anywhere in your app to ensure type safety
 * when calling these commands and also type your Command handlers to ensure they match the request/response types defined here:
 *
 * ```typescript
 * import { AppCommandIds, Command } from '@angelfish/core'
 * import type { AppCommandRequest, AppCommandResponse } from '@angelfish/core'
 *
 * // Example command handler
 * class MyCommandService {
 *  @Command(AppCommandIds.MY_COMMAND)
 *  public async handleCommand(request: AppCommandRequest<AppCommandIds.MY_COMMAND>): Promise<AppCommandResponse<AppCommandIds.MY_COMMAND>> {
 *   // Your command logic here
 *  }
 * }
 * ```
 *
 */

import type { IAuthenticatedUser, IAuthenticatedUserUpdate, IInstitutionUpdate } from '../types'
import type {
  IAuthenticationState,
  INotificationOptions,
  IOpenFileDialogOptions,
  ISaveFileDialogOptions,
  ISyncSummary,
} from './app-command-types'

/**
 * Default Commands for App
 */
export enum AppCommandIds {
  /**
   * Open an Electron file open dialog
   */
  SHOW_OPEN_FILE_DIALOG = 'show.open.dialog',
  /**
   * Open an Electron file save dialog
   */
  SHOW_SAVE_FILE_DIALOG = 'show.save.dialog',
  /**
   * Show a desktop notification
   */
  SHOW_NOTIFICATION = 'show.notification',
  /**
   * Open the Angelfish website in the user's default browser
   */
  OPEN_ANGELFISH_WEBSITE = 'open.angelfish.website',
  /**
   * Get the authentication state of the app persisted on disk
   */
  GET_AUTHENTICATION_SETTINGS = 'get.authentication.settings',
  /**
   * Set the authentication state of the app persisting to disk
   */
  SET_AUTHENTICATION_SETTINGS = 'set.authentication.settings',
  /**
   * Get the last opened book file path
   */
  GET_BOOK_FILE_PATH_SETTING = 'get.book.file.path.setting',
  /**
   * Set the last opened book file path
   */
  SET_BOOK_FILE_PATH_SETTING = 'set.book.file.path.setting',
  /**
   * Send an Out-Of-Band (OOB) code to the user's email for authentication
   */
  AUTH_SEND_OOB_CODE = 'auth.get.oob.code',
  /**
   * Authenticate a user with an OOB code sent to their email
   */
  AUTH_AUTHENTICATE = 'auth.authenticate',
  /**
   * Logout the currently authenticated user and delete any
   * active refresh tokens the Cloud API has for them
   */
  AUTH_LOGOUT = 'auth.logout',
  /**
   * Get the authenticated user's profile from Cloud API
   */
  GET_AUTNETICATED_USER = 'get.authenticated.user',
  /**
   * Update the authenticated user's profile on Cloud API
   */
  UPDATE_AUTHENTICATED_USER = 'update.authenticated.user',
  /**
   * Search Cloud API for Financial Institutions by name
   * and return a list of matching institutions
   */
  SEARCH_INSTITUTIONS = 'search.institutions',
  /**
   * Start a sync of the currently opened book file with the Cloud API
   * and return the sync status
   */
  START_SYNC = 'start.sync',
}

// Define request/response types for each command
export interface AppCommandDefinitions {
  [AppCommandIds.SHOW_OPEN_FILE_DIALOG]: {
    request: IOpenFileDialogOptions
    response: string[]
  }
  [AppCommandIds.SHOW_SAVE_FILE_DIALOG]: {
    request: ISaveFileDialogOptions
    response: string | null
  }
  [AppCommandIds.SHOW_NOTIFICATION]: {
    request: INotificationOptions
    response: void
  }
  [AppCommandIds.OPEN_ANGELFISH_WEBSITE]: {
    request: void
    response: void
  }
  [AppCommandIds.GET_AUTHENTICATION_SETTINGS]: {
    request: void
    response: IAuthenticationState
  }
  [AppCommandIds.SET_AUTHENTICATION_SETTINGS]: {
    request: IAuthenticationState
    response: void
  }
  [AppCommandIds.GET_BOOK_FILE_PATH_SETTING]: {
    request: void
    response: string | null
  }
  [AppCommandIds.SET_BOOK_FILE_PATH_SETTING]: {
    request: { filePath: string | null }
    response: void
  }
  [AppCommandIds.AUTH_SEND_OOB_CODE]: {
    request: { email: string }
    response: void
  }
  [AppCommandIds.AUTH_AUTHENTICATE]: {
    request: { oob_code: string }
    response: IAuthenticatedUser
  }
  [AppCommandIds.AUTH_LOGOUT]: {
    request: void
    response: void
  }
  [AppCommandIds.GET_AUTNETICATED_USER]: {
    request: void
    response: IAuthenticatedUser | null
  }
  [AppCommandIds.UPDATE_AUTHENTICATED_USER]: {
    request: IAuthenticatedUserUpdate
    response: IAuthenticatedUser
  }
  [AppCommandIds.SEARCH_INSTITUTIONS]: {
    request: { query: string }
    response: IInstitutionUpdate[]
  }
  [AppCommandIds.START_SYNC]: {
    request: void
    response: ISyncSummary
  }
}

// Type-safe utility to get request/response types dynamically
export type AppCommandRequest<T extends AppCommandIds> = AppCommandDefinitions[T]['request']
export type AppCommandResponse<T extends AppCommandIds> = Promise<
  AppCommandDefinitions[T]['response']
>
