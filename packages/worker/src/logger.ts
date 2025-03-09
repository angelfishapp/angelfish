import log from 'electron-log/node'

/**
 * Returns a scopped logger. Scopes help identify which part of the
 * application generated the log
 */
export function getWorkerLogger(scope: string) {
  return log.scope(scope)
}
