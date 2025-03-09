import type { LogFunctions } from 'electron-log'

/**
 * Preload logger
 * This logger is used in the preload script to log to console in window for its local
 * CommandRegistry
 */
export const PreloadLogger: LogFunctions = new (class implements LogFunctions {
  // Define scope to display in log messages
  private readonly scope: string = '(Preload)'

  /**
   * Log an error message
   */
  public error(...params: any[]): void {
    // eslint-disable-next-line no-console
    console.error(this.scope, ...params)
  }

  /**
   * Log a warning message
   */
  warn(...params: any[]): void {
    // eslint-disable-next-line no-console
    console.warn(this.scope, ...params)
  }

  /**
   * Log an informational message
   */
  info(...params: any[]): void {
    // eslint-disable-next-line no-console
    console.info(this.scope, ...params)
  }

  /**
   * Log a verbose message
   */
  verbose(...params: any[]): void {
    // eslint-disable-next-line no-console
    console.debug(this.scope, ...params)
  }

  /**
   * Log a debug message
   */
  debug(...params: any[]): void {
    // eslint-disable-next-line no-console
    console.debug(this.scope, ...params)
  }

  /**
   * Log a silly message
   */
  silly(...params: any[]): void {
    // eslint-disable-next-line no-console
    console.debug(this.scope, ...params)
  }

  /**
   * Shortcut to info
   */
  log(...params: any[]): void {
    // eslint-disable-next-line no-console
    console.log(this.scope, ...params)
  }
})()
