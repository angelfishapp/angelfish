import { createRoot } from 'react-dom/client'
import { Logger } from '@angelfish/core'

import AppRoot from './app/AppRoot'

const logger = Logger.scope('Frontend')

const rootElement = document.getElementById('root')
if (!rootElement) {
  logger.error('Root element not found')
  throw new Error('Root element not found')
}

const root = createRoot(rootElement, {
  onUncaughtError: (error, errorInfo) => {
    logger.error('Uncaught Error', error, errorInfo)
  },
  onCaughtError: (error, errorInfo) => {
    logger.error('React Caught Error', error, errorInfo)
  },
})
root.render(<AppRoot />)
