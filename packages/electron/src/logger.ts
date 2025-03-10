import type { LevelOption } from 'electron-log'
import log from 'electron-log/main'
import path from 'path'

import { CommandsRegistryMain } from './commands/commands-registry-main'
import { settings } from './settings'
import { Environment } from './utils/environment'
import { ProcessIDs } from './windows/process-ids'

// Turn off default logger to avoid double logging
log.transports.console.level = false
log.transports.file.level = false

// Create and configure main logger
const mainLogger = log.create({ logId: ProcessIDs.MAIN })
mainLogger.transports.console.level = getLogLevel('console')
mainLogger.transports.file.level = getLogLevel('file')
mainLogger.transports.file.resolvePathFn = () => {
  return path.join(Environment.logsDir, `${ProcessIDs.MAIN}.log`)
}

/**
 * Returns a scopped logger. Scopes help identify which part of the
 * application generated the log
 */
export function getMainLogger(scope: string) {
  return mainLogger.scope(scope)
}

/**
 * Setup log handlers for processes sending logs from the renderer process
 * to the main process to write to file
 */

const appLogger = log.create({ logId: ProcessIDs.APP })
appLogger.transports.console.level = false
appLogger.transports.file.level = getLogLevel('file')
appLogger.transports.file.resolvePathFn = () => {
  return path.join(Environment.logsDir, 'renderer.log')
}

const syncLogger = log.create({ logId: ProcessIDs.SYNC })
syncLogger.transports.console.level = false
syncLogger.transports.file.level = getLogLevel('file')
syncLogger.transports.file.resolvePathFn = () => {
  return path.join(Environment.logsDir, `${ProcessIDs.SYNC}.log`)
}

// The worker process will have its own logger that can write directly
// to the local file without sending messages to the main process,
// this is just to catch logs from the preload script
const workerLogger = log.create({ logId: ProcessIDs.WORKER })
workerLogger.transports.console.level = false
workerLogger.transports.file.level = getLogLevel('file')
workerLogger.transports.file.resolvePathFn = () => {
  return path.join(Environment.logsDir, `${ProcessIDs.WORKER}.log`)
}

/**
 * Helper function to determine correct log level for app.
 *
 * In test, turn off file logging or use 'CONSOLE_LOG_LEVEL'
 * environment variable to set log level
 *
 * @returns     The log level for the app
 */
function getLogLevel(transport: 'file' | 'console'): LevelOption {
  if (Environment.isTest) {
    if (transport === 'file') {
      return false
    }
    return (process.env.CONSOLE_LOG_LEVEL as LevelOption) || 'debug'
  }

  // For development and production, use local settings
  return settings.get('userSettings.logLevel', 'debug')
}

// Listen for userSettings updates to app logging level and update loggers accordingly
settings.onDidChange('userSettings', (newValue) => {
  if (newValue && mainLogger.transports.file.level !== newValue.logLevel) {
    mainLogger.scope('Logger').info(`Changing Log Level to ${newValue.logLevel}`)
    mainLogger.transports.console.level = getLogLevel('console')
    mainLogger.transports.file.level = getLogLevel('file')
    appLogger.transports.file.level = getLogLevel('file')
    syncLogger.transports.file.level = getLogLevel('file')
    workerLogger.transports.file.level = getLogLevel('file')
    CommandsRegistryMain.emitEvent('logging.level.changed', { level: newValue.logLevel })
  }
})
