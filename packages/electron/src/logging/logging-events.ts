/**
 * Logging Events
 */
export enum LogEvents {
  /**
   * Set the log level for the process when the process is loaded
   */
  ON_LOGGING_SET_LEVEL = 'logging.set.level',
  /**
   * Logging level changed event emitted when the logging level is changed
   */
  ON_LOGGING_LEVEL_CHANGED = 'logging.level.changed',
}
