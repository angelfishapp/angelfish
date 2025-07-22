import * as Sentry from '@sentry/electron/main'
import type { LevelOption, LogMessage, TransformFn, Transport } from 'electron-log'

/**
 * Create a Sentry transport for electron-log
 */
export function sentryTransport(
  options: { level?: LevelOption; transforms?: TransformFn[] } = {},
  config: { dsn: string; environment?: string; release?: string },
): Transport {
  const { level = 'warn', transforms = [] } = options
  let initialized = false

  // Initialize Sentry
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: config.environment || process.env.NODE_ENV,
    release: config.release,

    // Use correct integration syntax - these are functions, not classes
    integrations: [
      Sentry.electronNetIntegration(),
      Sentry.onUncaughtExceptionIntegration(),
      Sentry.onUnhandledRejectionIntegration(),
    ],
  })

  initialized = true

  // Create the transport function
  const transport: Transport = function (message: LogMessage) {
    if (!initialized) return

    const { level: msgLevel, data, scope, date } = message

    // Skip processing if not error or warn
    if (msgLevel !== 'error' && msgLevel !== 'warn') return

    // Find if there's an error object in the data
    const errorObj = data.find((item) => item instanceof Error) as Error | undefined

    Sentry.withScope((sentryScope) => {
      // Add scope as tag if available
      if (scope) {
        // Handle scope correctly (could be string or array)
        const scopeTag = Array.isArray(scope) ? scope.join(':') : scope
        sentryScope.setTag('scope', scopeTag)
      }

      // Add timestamp
      if (date) {
        sentryScope.setExtra('timestamp', date.toISOString())
      }

      // Set severity level
      sentryScope.setLevel(msgLevel === 'error' ? 'error' : 'warning')

      // Add other data as extra context
      const otherData = data.filter((item) => !(item instanceof Error))
      if (otherData.length > 0) {
        sentryScope.setExtra('data', otherData)
      }

      if (errorObj) {
        // If we have an error object, capture as exception
        Sentry.captureException(errorObj)
      } else {
        // Otherwise capture as message
        const messageText = data
          .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
          .join(' ')

        Sentry.captureMessage(messageText)
      }
    })
  }

  // Add required properties to make it a valid Transport
  transport.level = level
  transport.transforms = transforms

  return transport
}
