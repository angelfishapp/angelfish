/**
 * Commands for Main Process
 */
export enum MAINCommands {
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
