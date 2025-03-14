import type { AppCommandIds, AppCommandRequest, AppCommandResponse } from '../app/app-commands'
import type {
  ChannelID,
  CommandHandler,
  CommandID,
  EventHandler,
  ICommand,
} from './commands-registry-interface'

import { CommandRegistryEvents } from './commands-registry-events'

/**
 * Command client - used by worker/renderer processes to call their local CommandsRegistry under
 * `window.commands` making it easier to interact with.
 */
export const CommandsClient = {
  /**
   * Register a command with the CommandsRegistry. Commands starting with underscores will
   * only be available locally to the process that registered them.
   *
   * @param commandID - The ID of the command to register.
   * @param handler - The handler for the command.
   */
  registerCommand: async (commandID: string, handler: CommandHandler): Promise<void> => {
    return await window.commands.registerCommand(commandID, handler)
  },

  /**
   * Execute a command with the CommandsRegistry.
   * Can type command payload and return value with generics.
   *
   * @param commandId   The ID of the command to execute.
   * @param request     The Request payload to pass to the command handler.
   * @returns           A promise that resolves with the return value of the command handler.
   */
  executeCommand: async <R, P = any>(commandId: string, request?: P): Promise<R> => {
    return await window.commands.executeCommand(commandId, request)
  },

  /**
   * Execute an App command with the CommandsRegistry. This is a type-safe wrapper for all
   * App commands defined in `app-commands.ts`. It ensures that the command ID, request and
   * response types are all in sync with the definitions in `app-commands.ts`.
   *
   * @param commandId   The ID of the App command to execute
   * @param args        The Request payload to pass to the command handler. This is optional and will be inferred
   * @returns           A promise that resolves with the return value of the command handler. The type of the return value
   *                    is inferred from the command ID and request/response types defined in `app-commands.ts`.
   */
  executeAppCommand: async <T extends AppCommandIds>(
    command: T,
    ...args: AppCommandRequest<T> extends void ? [] : [AppCommandRequest<T>]
  ): AppCommandResponse<T> => {
    return window.commands.executeCommand(
      command,
      ...(args as [AppCommandRequest<T>]),
    ) as AppCommandResponse<T>
  },

  /**
   * Emit an event with the CommandsRegistry. Events with underscores will only emit
   * to the process that emitted them.
   *
   * @param eventID - The ID of the event to emit.
   * @param payload - The payload to pass to the event handler.
   */
  emitEvent: <P = any>(eventID: string, payload?: P) => {
    window.commands.emitEvent(eventID, payload)
  },

  /**
   * Add an event listener to the CommandsRegistry.
   *
   * @param eventID - The ID of the event to listen for.
   * @param handler - The handler for the event.
   */
  addEventListener: (eventID: string, handler: EventHandler) => {
    window.commands.addEventListener(eventID, handler)
  },

  /**
   * Remove an event listener from the CommandsRegistry.
   *
   * @param eventID - The ID of the event to remove the listener from.
   * @param handler - The handler to remove.
   */
  removeEventListener: (eventID: string, handler: EventHandler) => {
    window.commands.removeEventListener(eventID, handler)
  },

  /**
   * List all commands in the CommandsRegistry.
   *
   * @returns A list of all commands in the CommandsRegistry.
   */
  listCommands: (): Record<CommandID, ICommand> => {
    return window.commands.listCommands()
  },

  /**
   * List all channels in the CommandsRegistry.
   *
   * @returns A list of all channels in the CommandsRegistry.
   */
  listChannels: (): ChannelID[] => {
    return window.commands.listChannels()
  },

  /**
   * Listen for new channels being registered with the CommandsRegistry.
   *
   * @param handler   The handler for the event.
   * @returns         A function to remove the event listener.
   */
  onChannelRegistered: (handler: EventHandler) => {
    return window.commands.addEventListener(CommandRegistryEvents.NEW_CHANNEL_REGISTERED, handler)
  },

  /**
   * Returns a promise which resolves when all listed channels are registered.
   *
   * @param channels  A list of channels to wait for.
   */
  isReady: async (channels: ChannelID[]): Promise<void> => {
    // Check if all channels are already registered and resolve immediately
    const _currentChannels = window.commands.listChannels()
    if (channels.every((channel) => _currentChannels.includes(channel))) {
      return
    }

    // Otherwise return a promise that resolves when all channels are registered
    return new Promise((resolve) => {
      const _handler = () => {
        const _currentChannels = window.commands.listChannels()
        if (channels.every((channel) => _currentChannels.includes(channel))) {
          window.commands.removeEventListener(
            CommandRegistryEvents.NEW_CHANNEL_REGISTERED,
            _handler,
          )
          resolve()
        }
      }
      window.commands.addEventListener(CommandRegistryEvents.NEW_CHANNEL_REGISTERED, _handler)
    })
  },
}
