import { Logger } from '@angelfish/core'
import * as Sentry from '@sentry/react'

const logger = Logger.scope('GlobalErrors')

/**
 * Registers global error listeners for JS and unhandled promises.
 */
export function registerGlobalErrorHandlers() {
  window.addEventListener('error', (event) => {
    Sentry.captureException(event.error)
    logger.error('Global JS Error:', event.error)
  })

  window.addEventListener('unhandledrejection', (event) => {
    Sentry.captureException(event.reason)
    logger.error('Unhandled Promise Rejection:', event.reason)
  })
}
