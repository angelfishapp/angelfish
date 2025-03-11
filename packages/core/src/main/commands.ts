/**
 * Commands for Main Process
 */
export enum MAINCommands {
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
