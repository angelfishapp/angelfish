import type { IAuthenticatedUser, IUserSettings } from '@angelfish/core'

/**
 * Interface for local AppSettings
 */
export interface IAppSettings {
  /**
   * Keep track of the Window size when the user resizes
   * so it opens again with the same size next time they
   * open the app
   */
  windowSize: {
    width: number
    height: number
  }
  /**
   * Current user ID for the user once they've logged in
   * successfully
   */
  authenticatedUser: IAuthenticatedUser | null
  /**
   * Encrypted refresh token for the user to keep them logged
   * in between sessions. Should be encrypted using Electron's
   * SafeStorage API so it's secure on the user's local machine
   */
  refreshToken: string | null
  /**
   * Filepath to the local SQLite Database the user created
   * or last opened so the app opens up the book automaticaly
   * on startup
   */
  currentFilePath: string | null
  /**
   * Set the logging level for the app and any workers. Allows users to
   * turn on debug logging if trying to troubleshoot an issue locally
   * @default 'info'
   */
  logLevel: 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'
  /**
   * Any user settings accessible from the UI/Menu should go here
   * so the user can configure local app features specific to the
   * current Desktop they're running on
   */
  userSettings: IUserSettings
  /**
   * Unique device ID for the current machine. This is used to
   * identify the machine for analytics and other purposes.
   */
  deviceId: string | null
}
