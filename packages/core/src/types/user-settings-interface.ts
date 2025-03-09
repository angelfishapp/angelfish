import type { IAuthenticatedUser } from './authenticated-user-interface'

/**
 * Typings for local UserSettings
 */
export interface IUserSettings {
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
   * Filepath to the local SQLite Database the user created
   * or last opened so the app opens up the book automaticaly
   * on startup
   */
  currentFilePath: string | null
  /**
   * Any user settings accessible from the UI/Menu should go here
   * so the user can configure local app features specific to the
   * current Desktop they're running on
   */
  userSettings: {
    /**
     * Enable (true) or disable (false) the underwater background
     * animations in the app. As these animations can cause performance
     * issues on slower computers, needs to be configurable.
     * @default true
     */
    enableBackgroundAnimations: boolean
    /**
     * Set the logging level for the app in production to debug. Allows users to
     * turn on debug logging if trying to troubleshoot an issue locally
     * @default false
     */
    enableDebugLogging: boolean
  }
}
