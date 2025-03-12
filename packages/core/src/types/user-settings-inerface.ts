/**
 * Interface for the user settings object. This object is used to
 * change any local app settings that the user can configure
 */
export interface IUserSettings {
  /**
   * Enable (true) or disable (false) the underwater background
   * animations in the app. As these animations can cause performance
   * issues on slower computers, needs to be configurable.
   * @default true
   */
  enableBackgroundAnimations: boolean
}
