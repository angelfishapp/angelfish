import * as Sentry from '@sentry/electron/main'
import { app } from 'electron'

export class SentryConfig {
  private static initialized = false

  static initialize(): boolean {
    // Get API key from environment or process args
    const apiKey = process.env.SENTRY_DSN
    if (!apiKey) {
      return false
    }

    if (this.initialized) {
      return true
    }

    Sentry.init({
      dsn: apiKey,
      environment: process.env.NODE_ENV || 'development',
      release: app.getVersion(),

      // Use correct integration syntax - these are functions, not classes
      integrations: [
        Sentry.electronNetIntegration(),
        Sentry.onUncaughtExceptionIntegration(),
        Sentry.onUnhandledRejectionIntegration(),
      ],
    })

    this.initialized = true
    return true
  }

  static captureError(error: Error, context?: Record<string, any>) {
    if (!this.initialized) return

    Sentry.withScope((scope) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setTag(key, String(value))
        })
      }
      Sentry.captureException(error)
    })
  }

  static isInitialized(): boolean {
    return this.initialized
  }
}
