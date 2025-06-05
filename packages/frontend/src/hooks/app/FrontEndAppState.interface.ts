import type { IAppState } from '@angelfish/core'

/**
 * Sync Info for App
 */
export interface SyncInfo {
  /**
   * Indicates if the app is currently syncing.
   */
  isSyncing: boolean
  /**
   * Duration of the last sync operation in milliseconds.
   */
  durationMs: number
  /**
   * Indicates if the last sync operation was successful.
   */
  success: boolean
  /**
   * Start time of the last sync operation in milliseconds since epoch.
   */
  startTime?: number
  /**
   * Finish time of the last sync operation in milliseconds since epoch.
   */
  finishTime?: number
  /**
   * Error message if the last sync operation failed.
   */
  error?: string
}

/**
 * Interface for the application state in React Query.
 */
export interface IFrontEndAppState extends IAppState {
  // Indicates if the app has been initialised
  isInitialised: boolean
  // Syncronization Status of SyncService
  syncInfo: SyncInfo
}
