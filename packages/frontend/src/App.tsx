import { useEffect, useState } from 'react'

import { CommandsClient } from '@angelfish/core'

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
      CommandsClient.emitEvent('counter.changed', { count: count })
    }

    // Register Command on load
    if (!isRegistered) {
      CommandsClient.registerCommand('increment.counter', () => {
        incrementCounter()
      })
        .then(() => {})
        .catch((error) => {
          console.error(`Error registering command: ${error}`)
        })
      setIsRegistered(true)
    }
  }, [count])

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
                console.log('Channels:', CommandsClient.listChannels())
              }}
            >
              List Channels
            </button>
            <button
              onClick={async () => {
                console.log('Commands:', CommandsClient.listCommands())
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
                const response: { response: string } = await CommandsClient.executeCommand(
                  'hello.world',
                  {
                    name: 'App',
                  },
                )
                console.log('hello.world Response:', response)
                alert(response.response)
              }}
            >
              Execute 'hello.world'
            </button>
          </div>
        </div>

        <div className="section">
          <h2>Main</h2>
          <div className="buttons">
            <button
              onClick={async () => {
                await CommandsClient.executeCommand('show.notification', {
                  title: 'Test Notification',
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
