import log from 'electron-log/node'
import path from 'path'

import { Environment } from '@angelfish/core'

// Setup worker logger
log.transports.console.level = 'debug'
log.transports.file.level = 'debug'
log.transports.file.resolvePathFn = () => {
  return path.join(Environment.logsDir, `worker.log`)
}

/**
 * Returns a scopped logger. Scopes help identify which part of the
 * application generated the log
 */
export function getWorkerLogger(scope: string) {
  return log.scope(scope)
}
