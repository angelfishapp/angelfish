import type { LevelOption, MainLogger } from 'electron-log'
import log from 'electron-log/main'
import path from 'path'

import { CommandsRegistryMain } from '../commands/commands-registry-main'
import { settings } from '../settings'
import { Environment } from '../utils/environment'
import { ProcessIDs } from '../windows/process-ids'
import { LogEvents } from './logging-events'

/**
 * Manages the logging of the application, creating loggers for each process
 * and setting up the correct transports for each logger, as well as updating
 * log levels when user settings change
 */
export const LogManager = new (class {
  /**
   * Hold a list of all loggers created by the LogManager
   */
  private loggers: Record<string, MainLogger> = {}

  /**
   * Current logging level for the app
   */
  private logLevel: LevelOption = 'debug'

  /**
   * Default constructor
   */
  constructor() {
    // Turn off default logger to avoid double logging
    log.transports.console.level = false
    log.transports.file.level = false

    // Create and configure main logger
    const mainLogger = log.create({ logId: ProcessIDs.MAIN })
    mainLogger.transports.console.level = this._getLogLevel('console')
    this.logLevel = this._getLogLevel('file')
    mainLogger.transports.file.level = this.logLevel
    mainLogger.transports.file.resolvePathFn = () => {
      return path.join(Environment.logsDir, `${ProcessIDs.MAIN}.log`)
    }
    this.loggers[ProcessIDs.MAIN] = mainLogger
  }

  /**
   * Get a scoped instance of the Main logger
   *
   * @param scope   The scope of the logger
   * @returns       A scoped logger for Main process
   */
  public getMainLogger(scope: string) {
    return this.loggers[ProcessIDs.MAIN].scope(scope)
  }

  /**
   * Create a new logger for a process
   *
   * @param logId   The unique identifier for the logger
   */
  public createProcessLogger(logId: string) {
    const processLogger = log.create({ logId })
    // We don't need console as we are logging to console in the process window
    // during development
    processLogger.transports.console.level = false
    processLogger.transports.file.level = this._getLogLevel('file')
    processLogger.transports.file.resolvePathFn = () => {
      return path.join(Environment.logsDir, `${logId}.log`)
    }
    this.loggers[logId] = processLogger
  }

  /**
   * Set the log level for all loggers across the app
   *
   * @param level   The log level to set
   */
  public setLogLevel(level: LevelOption) {
    if (this.logLevel !== level) {
      // Loop through loggers and update log level
      for (const [id, logger] of Object.entries(this.loggers)) {
        if (id === ProcessIDs.MAIN) {
          logger.scope('Logger').info(`Changing Log Level to ${level}`)
          logger.transports.console.level = this._getLogLevel('console')
          logger.transports.file.level = this._getLogLevel('file')
        } else {
          logger.transports.file.level = this._getLogLevel('file')
        }
      }
    }
  }

  /**
   * Helper function to determine correct log level for app.
   *
   * In test, turn off file logging or use 'CONSOLE_LOG_LEVEL'
   * environment variable to set log level
   *
   * @returns     The log level for the app
   */
  private _getLogLevel(transport: 'file' | 'console'): LevelOption {
    if (Environment.isTest) {
      if (transport === 'file') {
        return false
      }
      return (process.env.CONSOLE_LOG_LEVEL as LevelOption) || 'debug'
    }

    // For development and production, use local settings
    return settings.get('userSettings.logLevel', 'debug')
  }
})()

// Listen for userSettings updates to app logging level and update loggers accordingly
settings.onDidChange('userSettings', (newValue) => {
  if (newValue) {
    LogManager.setLogLevel(newValue.logLevel)
    // Notify processes of log level change
    CommandsRegistryMain.emitEvent(LogEvents.ON_LOGGING_LEVEL_CHANGED, {
      level: newValue.logLevel,
    })
  }
})
