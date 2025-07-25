import { createRoot } from 'react-dom/client'
import '../sentry.config'
import { Logger } from '@angelfish/core'
import * as Sentry from "@sentry/react";

import AppRoot from './app/AppRoot'
import { registerGlobalErrorHandlers } from './utils/errorHandlers';

const logger = Logger.scope('Frontend')

const rootElement = document.getElementById('root')
if (!rootElement) {
  logger.error('Root element not found')
  throw new Error('Root element not found')
}
// Capture General js errors like promises and window errors
registerGlobalErrorHandlers()

const root = createRoot(rootElement, {
  onUncaughtError: (error, errorInfo) => {
    logger.error('Uncaught Error', error, errorInfo)
    // Capture the error with Sentry for root level errors
    Sentry.captureException(error, { extra: errorInfo })

  },
  onCaughtError: (error, errorInfo) => {
    logger.error('React Caught Error', error, errorInfo)
    // Capture the error with Sentry for root level errors
    Sentry.captureException(error, { extra: errorInfo })
  },
})
root.render(<AppRoot />)
