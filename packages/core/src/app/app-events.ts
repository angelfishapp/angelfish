import type { IAuthenticatedUser, IBook, IUserSettings } from '../types'
import type { ISyncSummary } from './app-command-types'

/**
 * Default Event Ids for App
 */
export enum AppEventIds {
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
  /**
   * Event emitted when sync process starts
   */
  ON_SYNC_STARTED = 'on.sync.started',
  /**
   * Event emitted when sync process finishes
   */
  ON_SYNC_FINISHED = 'on.sync.finished',
}

// Define event types for each event
export interface AppEventDefinitions {
  [AppEventIds.ON_LOGIN]: { authenticatedUser: IAuthenticatedUser }
  [AppEventIds.ON_LOGOUT]: void
  [AppEventIds.ON_BOOK_OPEN]: { book: IBook }
  [AppEventIds.ON_BOOK_CLOSE]: void
  [AppEventIds.ON_ONLINE_STATUS_CHANGED]: { isOnline: boolean }
  [AppEventIds.ON_USER_SETTINGS_UPDATED]: IUserSettings
  [AppEventIds.ON_SYNC_STARTED]: void
  [AppEventIds.ON_SYNC_FINISHED]: ISyncSummary
}

/**
 * Type for App events
 */
export type AppEvent<T extends AppEventIds> = AppEventDefinitions[T]
