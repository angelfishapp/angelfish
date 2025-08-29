import type {
  AppCommandIds,
  AppCommandRequest,
  AppCommandResponse,
  AppEvent,
  AppEventIds,
} from '../app'
import { CommandRegistryEvents } from './commands-registry-events'
import type {
  ChannelID,
  CommandHandler,
  CommandID,
  EventHandler,
  ICommand,
} from './commands-registry-interface'

/**
 * Command client - used by worker/renderer processes to call their local CommandsRegistry under
 * `window.commands` making it easier to interact with.
 */
export const CommandsClient = {
  /**
   * Register a command with the CommandsRegistry. Commands starting with underscores will
   * only be available locally to the process that registered them.
   *
   * @param commandID   The ID of the command to register.
   * @param handler     The handler for the command.
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
    const start = performance.now()
    const result = await window.commands.executeCommand(commandId, request)
    const end = performance.now()
    performance.measure(`executeCommand: ${commandId}`, { start, end })
    return result
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
    const start = performance.now()
    const result = (await window.commands.executeCommand(
      command,
      ...(args as [AppCommandRequest<T>]),
    )) as AppCommandResponse<T>
    const end = performance.now()
    performance.measure(`executeAppCommand: ${command}`, { start, end })
    return result
  },

  /**
   * Emit an event with the CommandsRegistry. Events with underscores will only emit
   * to the process that emitted them.
   *
   * @param eventId   The ID of the event to emit.
   * @param payload   The payload to pass to the event handler.
   */
  emitEvent: <P = any>(eventId: string, payload?: P) => {
    window.commands.emitEvent(eventId, payload)
  },

  /**
   * Emit an App event with the CommandsRegistry. This is a type-safe wrapper for all
   * App events defined in `app-events.ts`. It ensures that the event ID and payload types
   * are all in sync with the definitions in `app-events.ts`.
   *
   * @param eventId   The ID of the App event to emit
   * @param event     The payload to pass to the event handler. This is optional and will be inferred
   */
  emitAppEvent: <T extends AppEventIds>(
    eventId: T,
    ...args: AppEvent<T> extends void ? [] : [AppEvent<T>]
  ) => {
    window.commands.emitEvent(eventId, ...(args as [AppEvent<T>]))
  },

  /**
   * Add an event listener to the CommandsRegistry.
   *
   * @param eventId   The ID of the event to listen for.
   * @param handler   The handler for the event.
   * @returns         A function to remove the event listener.
   */
  addEventListener: (eventId: string, handler: EventHandler) => {
    return window.commands.addEventListener(eventId, handler)
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
  addAppEventListener: <T extends AppEventIds>(
    eventId: T,
    handler: (event?: AppEvent<T>) => void,
  ) => {
    return window.commands.addEventListener(eventId, handler)
  },

  /**
   * Remove an event listener from the CommandsRegistry.
   *
   * @param eventId   The ID of the event to remove the listener from.
   * @param handler   The handler to remove.
   */
  removeEventListener: (eventId: string, handler: EventHandler) => {
    window.commands.removeEventListener(eventId, handler)
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
