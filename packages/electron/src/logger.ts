import log from 'electron-log/main'

/**
 * Returns a scopped logger. Scopes help identify which part of the
 * application generated the log
 */
export function getMainLogger(scope: string) {
  return log.scope(scope)
}
