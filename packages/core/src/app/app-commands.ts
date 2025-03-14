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
   * Get the list of all available currencies from Cloud API
   */
  GET_CURRENCIES = 'get.currencies',
  /**
   * Get the current spot currency rates from Cloud API
   * for a given base currency and list of currencies
   */
  GET_SPOT_CURRENCY_RATES = 'get.spot.currency.rates',
  /**
   * Get the daily historical currency rates from Cloud API
   * for a given base currency and currency between two dates
   */
  GET_HISTORICAL_CURRENCY_RATES = 'get.historical.currency.rates',
}
