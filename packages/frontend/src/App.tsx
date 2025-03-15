import { useEffect, useState } from 'react'

import { AppCommandIds, CommandsClient, Logger } from '@angelfish/core'

const logger = Logger.scope('App')

/**
 * Main Application Component
 */
export default function App() {
  const [count, setCount] = useState<number>(0)
  const [isRegistered, setIsRegistered] = useState<boolean>(false)

  const incrementCounter = () => {
    setCount((prevCount) => prevCount + 1)
  }

  useEffect(() => {
    // Execute Command
    if (count) {
      CommandsClient.emitEvent('counter.changed', { count })
    }

    // Register Command on load
    if (!isRegistered) {
      CommandsClient.registerCommand('increment.counter', async () => {
        incrementCounter()
      })
        .then(() => {})
        .catch((error) => {
          logger.error(`Error registering command: ${error}`)
        })
      setIsRegistered(true)
    }
  }, [count, isRegistered])

  return (
    <>
      <h1>{count}</h1>
      <div className="container">
        <div className="section">
          <h2>Local App</h2>
          <div className="buttons">
            <button onClick={() => incrementCounter()}>Increment</button>
            <button
              onClick={async () => {
                logger.info('Channels:', CommandsClient.listChannels())
              }}
            >
              List Channels
            </button>
            <button
              onClick={async () => {
                logger.info('Commands:', CommandsClient.listCommands())
              }}
            >
              List Commands
            </button>
          </div>
        </div>

        <div className="section">
          <h2>Worker</h2>
          <div className="buttons">
            <button
              onClick={async () => {
                const book = await CommandsClient.executeAppCommand(AppCommandIds.CREATE_BOOK, {
                  filePath: ':memory:',
                  book: {
                    name: 'Test Book',
                    entity: 'HOUSEHOLD',
                    country: 'US',
                    default_currency: 'USD',
                  },
                })
                logger.info(`${AppCommandIds.CREATE_BOOK} Response:`, book)
                // eslint-disable-next-line no-alert
                alert(`Created ${book.name}`)
              }}
            >
              Execute &apos;{AppCommandIds.CREATE_BOOK}&apos;
            </button>
          </div>
        </div>

        <div className="section">
          <h2>Main</h2>
          <div className="buttons">
            <button
              onClick={async () => {
                await CommandsClient.executeAppCommand(AppCommandIds.SHOW_NOTIFICATION, {
                  title: 'Main Test Notification',
                  body: 'This is a test notification from the app process.',
                })
              }}
            >
              Execute show.notification
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
