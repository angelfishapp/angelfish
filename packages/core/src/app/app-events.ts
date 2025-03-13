/**
 * Default Events for App
 */
export enum AppEvents {
  /**
   * Event emitted when user is authenticated with Cloud APIs
   */
  ON_LOGIN = 'on.login',
  /**
   * Event emitted when user logs out of Cloud APIs
   */
  ON_LOGOUT = 'on.logout',
  /**
   * Event emitted when a book file is opened
   */
  ON_BOOK_OPEN = 'on.book.open',
  /**
   * Event emitted when a book file is closed
   */
  ON_BOOK_CLOSE = 'on.book.close',
  /**
   * Event emitted when online status of app changes
   */
  ON_ONLINE_STATUS_CHANGED = 'on.online.status.changed',
  /**
   * Event emitted when user settings are updated
   */
  ON_USER_SETTINGS_UPDATED = 'on.user.settings.updated',
}
