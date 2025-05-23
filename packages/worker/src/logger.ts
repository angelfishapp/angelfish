import type { LevelOption } from 'electron-log'
import log from 'electron-log/node'
import path from 'path'

import { CommandsClient, Environment } from '@angelfish/core'

// Setup worker logger
log.transports.console.level = Environment.logLevel
log.transports.file.level = Environment.logLevel
log.transports.file.resolvePathFn = () => {
  return path.join(Environment.logsDir, `${Environment.processId}.log`)
}

// Listen for log level set events when window is started
window.onmessage = (event) => {
  if (event.data && event.data.event === 'logging.set.level') {
    log.transports.console.level = event.data.level
    log.transports.file.level = event.data.level
    log.scope('WorkerLogger').info(`Log level set to ${event.data.level}`)
  }
}

/**
 * Returns a scopped logger. Scopes help identify which part of the
 * application generated the log
 */
export function getWorkerLogger(scope: string) {
  return log.scope(scope)
}

// Listen for logging level changes
CommandsClient.addEventListener('logging.level.changed', (change: { level: LevelOption }) => {
  log.scope('Logger').info(`Log level changed to ${change.level}`)
  log.transports.console.level = change.level
  log.transports.file.level = change.level
})
