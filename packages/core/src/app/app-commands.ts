/**
 * Default Commands for App
 */
export enum AppCommands {
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
}
