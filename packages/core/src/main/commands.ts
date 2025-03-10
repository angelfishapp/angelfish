/**
 * Commands for Main Process
 */
export enum MAINCommands {
  /**
   * Set the log level for the process when the process is loaded
   */
  ON_LOGGING_SET_LEVEL = 'logging.set.level',
  /**
   * Logging level changed event emitted when the logging level is changed
   */
  ON_LOGGING_LEVEL_CHANGED = 'logging.level.changed',
  /**
   * Open an Electron file open dialog
   */
  SHOW_OPEN_DIALOG = 'main.show.open.dialog',
  /**
   * Open an Electron file save dialog
   */
  SHOW_SAVE_DIALOG = 'main.show.save.dialog',
  /**
   * Show a desktop notification
   */
  SHOW_NOTIFICATION = 'main.show.notification',
  /**
   * Open the Angelfish website in the user's default browser
   */
  OPEN_WEBSITE = 'main.open.website',
}
