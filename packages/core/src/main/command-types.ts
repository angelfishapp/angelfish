import type { IAuthenticatedUser } from '../types'

/**
 * Commands for Main Process
 */
export enum MAINCommands {
  /**
   * Event emitted when user settings are updated
   */
  ON_USER_SETTINGS_UPDATED = 'main.on.user.settings.updated',
  /**
   * Open an Electron file open dialog
   */
  SHOW_OPEN_FILE_DIALOG = 'main.show.open.dialog',
  /**
   * Open an Electron file save dialog
   */
  SHOW_SAVE_FILE_DIALOG = 'main.show.save.dialog',
  /**
   * Show a desktop notification
   */
  SHOW_NOTIFICATION = 'main.show.notification',
  /**
   * Open the Angelfish website in the user's default browser
   */
  OPEN_WEBSITE = 'main.open.website',
  /**
   * Get the authentication state of the app persisted on disk
   */
  GET_AUTHENTICATION = 'main.get.authentication',
  /**
   * Set the authentication state of the app persisting to disk
   */
  SET_AUTHENTICATION = 'main.set.authentication',
  /**
   * Get the last opened book file path
   */
  GET_BOOK_FILE_PATH = 'main.get.book.file.path',
  /**
   * Set the last opened book file path
   */
  SET_BOOK_FILE_PATH = 'main.set.book.file.path',
}

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
 * Interface for the Book File Path to save the last opened book file path
 * to settings between sessions.
 */
export interface IBookFilePath {
  filePath?: string | null
}
