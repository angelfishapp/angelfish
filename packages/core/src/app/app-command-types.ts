/**
 * Put complex App Command Types here, these are not exported outside of the core package, and only
 * used in the `app-commands.ts` file to define the command payloads for the commands that are registered
 */

import type { CategoryType, IAuthenticatedUser, IBook, IUserSettings } from '../types'

/**
 * File type filters for file dialogs
 */
interface FileFilter {
  /**
   * Array of file extensions to filter by
   */
  extensions: string[]
  /**
   * Name of the filter
   */
  name: string
}

/**
 * Options for open file dialog
 */
export interface IOpenFileDialogOptions {
  /**
   * Title of the dialog
   */
  title?: string
  /**
   * Absolute directory path, absolute file path, or file name to use by default.
   */
  defaultPath?: string
  /**
   * Custom label for the confirmation button, when left empty the default label will
   * be used.
   */
  buttonLabel?: string
  /**
   * File types that can be displayed or selected in the dialog box.
   */
  filters?: FileFilter[]
  /**
   * Contains which features the dialog should use. The following values are
   * supported across all platforms:
   */
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles'>
}

/**
 * Options for save file dialog
 */
export interface ISaveFileDialogOptions {
  /**
   * The dialog title. Cannot be displayed on some _Linux_ desktop environments.
   */
  title?: string
  /**
   * Absolute directory path, absolute file path, or file name to use by default.
   */
  defaultPath?: string
  /**
   * Custom label for the confirmation button, when left empty the default label will
   * be used.
   */
  buttonLabel?: string
  /**
   * File types that can be displayed or selected in the dialog box.
   */
  filters?: FileFilter[]
  /**
   * Contains which features the dialog should use. The following values are
   * supported across all platforms:
   */
  properties?: Array<'showHiddenFiles'>
}

/**
 * Options for desktop notification
 */
export interface INotificationOptions {
  /**
   * A title for the notification, which will be displayed at the top of the
   * notification window when it is shown.
   */
  title?: string
  /**
   * The body text of the notification, which will be displayed below the title or
   * subtitle.
   */
  body?: string
  /**
   * Whether or not to suppress the OS notification noise when showing the
   * notification.
   */
  silent?: boolean
  /**
   * An icon to use in the notification. It must be a valid path to a local icon file.
   */
  icon?: string
}

/**
 * Interface to Get/Set Authentication State of the App. This is used to persist the
 * authentication state of the app to disk between sessions.
 */
export interface IAuthenticationState {
  /**
   * The AuthenticatedUser Profile so it can be reloaded if app is started offline
   */
  authenticatedUser?: IAuthenticatedUser | null
  /**
   * The refresh token for the user to get a new JWT token to
   * access Angelfish APIs. Is encrypted at rest using Electron's
   * SafeStorage API.
   */
  refreshToken?: string | null
}

/**
 * The Current State of the App
 */
export interface IAppState {
  /**
   * Is the user authenticated
   */
  authenticated: boolean
  /**
   * The current Authenticated User
   */
  authenticatedUser?: IAuthenticatedUser
  /**
   * The current Book opened in the App
   */
  book?: IBook
  /**
   * The file path of the current Book
   */
  bookFilePath?: string
  /**
   * The current User's local Settings
   */
  userSettings: IUserSettings
}

/**
 * Interface to summarize the sync status and stats for a sync
 */
export interface ISyncSummary {
  /**
   * Whether the sync completed successfully or exited early with error
   * If false, the `errorMessage` property will contain the reason for failure
   */
  completed: boolean
  /**
   * Error message if the sync did not finish successfully
   */
  errorMessage?: string
}

/**
 * Interface to query Transactions
 */
export interface ITransactionQuery {
  /**
   * Only return Transactions for a particular bank account ID
   */
  account_id?: number
  /**
   * Only return Transactions for a particular category ID
   */
  cat_id?: number
  /**
   * Only return Transactions for a particular category type
   */
  cat_type?: CategoryType
  /**
   * Only return Transactions for a particular category group ID
   */
  cat_group_id?: number
  /**
   * Only return Transactions for a particular ISO currency code
   */
  currency_code?: string
  /**
   * Only return Transactions from a particular start date
   */
  start_date?: string
  /**
   * Only return Transactions until a particular end date. If not
   * provided along with start_date, will return transactions up to
   * the current date
   */
  end_date?: string
  /**
   * Only return Transactions that have line items tagged with a particular tag ID
   */
  tag_id?: number
  /**
   * Only return Transactions that require sync
   */
  requires_sync?: boolean
}
