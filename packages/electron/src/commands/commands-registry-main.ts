import type { MessagePortMain } from 'electron'

import type {
  AppCommandIds,
  AppCommandRequest,
  AppCommandResponse,
  AppEvent,
  AppEventIds,
} from '@angelfish/core/dist'
import { LogManager } from '../logging/log-manager'
import { CommandsRegistry } from './commands-registry'

const logger = LogManager.getMainLogger('CommandsRegistryMain')

/**
 * CommandsRegistryMain: Main process Commands Registry to manage and route
 * commands and events between processes
 *
 * @example
 * // Register a new command in the main process
 * CommandsRegistryMain.registerCommand('main.log', async (payload) => {
 *  console.log('test command invoked with payload:', payload)
 *  return { response: 'test command response' }
 * })
 *
 * // Execute a command in the main process
 * CommandsRegistryMain.executeCommand('main.log', { test: 'payload' }).then((response) => {
 *  console.log('test command response:', response)
 * })
 */
export const CommandsRegistryMain = new CommandsRegistry<MessagePortMain>({ logger })

/**
 * Access the CommandsRegistryMain instance to get type-safe access to
 * App commands and events in the Main process.
 */
export const AppCommandsRegistryMain = {
  /**
   * Execute a App commmand with type safety
   *
   * @param command   The command ID to execute
   * @param payload   The payload to pass to the command handler
   * @returns         A promise that resolves with the return value of the command handler
   */
  executeAppCommand: async <T extends AppCommandIds>(
    command: T,
    ...args: AppCommandRequest<T> extends void ? [] : [AppCommandRequest<T>]
  ): AppCommandResponse<T> => {
    return CommandsRegistryMain.executeCommand(
      command,
      ...(args as [AppCommandResponse<T>]),
    ) as AppCommandResponse<T>
  },

  /**
   * Emit an App event with type safety
   *
   * @param eventId   The ID of the App event to emit
   * @param event     The event. This is optional and will be inferred
   */
  emitAppEvent: async <T extends AppEventIds>(
    eventId: T,
    ...args: AppEvent<T> extends void ? [] : [AppEvent<T>]
  ) => {
    const event = args.length ? args[0] : undefined
    CommandsRegistryMain.emitEvent(eventId, event as object)
  },

  /**
   * Add an App event listener to the CommandsRegistry. This is a type-safe wrapper for all
   * App events defined in `app-events.ts`. It ensures that the event ID and payload types
   * are all in sync with the definitions in `app-events.ts`.
   *
   * @param eventId   The ID of the App event to listen for.
   * @param handler   The Handler for the App event.
   *                  This is a type-safe wrapper for all App events defined in `app-events.ts`.
   * @returns         A function to remove the event listener.
   */
  addAppEventListener: async <T extends AppEventIds>(
    eventId: T,
    handler: (event?: AppEvent<T>) => void,
  ) => {
    return CommandsRegistryMain.addEventListener(eventId, handler)
  },
}
