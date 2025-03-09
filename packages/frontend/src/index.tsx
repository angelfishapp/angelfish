/**
 * Main entry point for the App frontend renderer process.
 */

import { createRoot } from 'react-dom/client'

import './index.css'

import { CommandRegistryEvents, CommandsClient } from '@angelfish/core'
import { default as App } from './App'

/**
 * Render the Counter component to the root element.
 */
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}
const root = createRoot(rootElement)

CommandsClient.addEventListener(
  CommandRegistryEvents.NEW_CHANNEL_REGISTERED,
  (payload: { id: string }) => {
    if (payload.id === 'main') {
      root.render(<App />)
    }
  },
)
