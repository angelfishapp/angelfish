import { vi } from 'vitest'

import { MockCommandsClient } from './mock-commands-client.js'
import { MockEnvironment } from './mock-environment.js'
import { MockLogger } from './mock-logger.js'

/**
 * Mock @angelfish/core Classes before any test runs so we don't get 'window' is not defined
 * errors when running tests in Node.js.
 */
export const mockAngelfishCoreLib = () => {
  vi.mock('@angelfish/core', async (importOriginal) => {
    // eslint-disable-next-line
    const actual = await importOriginal<typeof import('@angelfish/core')>()

    return {
      ...actual, // Preserve other exports
      Environment: MockEnvironment,
      Logger: MockLogger,
      CommandsClient: MockCommandsClient,
      registerCommands: (instances: object[]) => {
        for (const instance of instances) {
          const prototype = Object.getPrototypeOf(instance)
          const commands = Reflect.getMetadata('command:handler', prototype) || []
          for (const command of commands) {
            const handler = (instance as any)[command.method]
            // Bind method to its instance to keep class state
            MockCommandsClient.registerCommand(command.name, handler.bind(instance))
          }
        }
      },
    }
  })
}
