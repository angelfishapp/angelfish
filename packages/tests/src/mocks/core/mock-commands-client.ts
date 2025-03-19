import type {
  AppCommandIds,
  AppCommandRequest,
  AppCommandResponse,
  AppEvent,
  AppEventIds,
  ChannelID,
  CommandHandler,
  CommandID,
  EventHandler,
  EventID,
  ICommand,
} from '@angelfish/core'

import { MockLogger } from './mock-logger.js'

const logger = MockLogger.scope('MockCommandsClient')

/**
 * Mock @angelfish/core CommandsClient before any test runs so we don't get 'window' is not defined
 * errors when running tests in Node.js.
 *
 * Provides a basic CommandsRegistry framework so calls to other services work and external process commands
 * can be mocked so tests work when execting commands or listening for events.
 */
class MockCommandsClientClass {
  // Holds map of all registered commands
  private _commands = new Map<CommandID, ICommand>()
  // Holds list of event listeners with callback functions
  private _listeners = new Map<EventID, EventHandler[]>()

  public async registerCommand(commandID: CommandID, handler: CommandHandler): Promise<void> {
    if (this._commands.has(commandID)) {
      throw new Error(`Command handler for "${commandID}" already registered`)
    }
    this._commands.set(commandID, {
      isLocal: true,
      isPrivate: commandID.startsWith('_'),
      handler,
    } as ICommand)

    logger.info(`☎️ Registered new command "${commandID}"`)
  }

  public async executeCommand<R, P = any>(commandID: string, payload?: P): Promise<R> {
    const commandInfo = this._commands.get(commandID)
    if (commandInfo && commandInfo.isLocal && commandInfo.handler) {
      // Call the command handler with the payload
      const result = await commandInfo.handler(payload as object)
      return result
    }
    throw new Error(`Command "${commandID}" and router channel not found`)
  }

  public async executeAppCommand<T extends AppCommandIds>(
    commandID: T,
    ...args: AppCommandRequest<T> extends void ? [] : [AppCommandRequest<T>]
  ): AppCommandResponse<T> {
    const payload = args.length > 0 ? args[0] : undefined
    return (await this.executeCommand<AppCommandResponse<T>, AppCommandRequest<T>>(
      commandID,
      payload,
    )) as AppCommandResponse<T>
  }

  public emitEvent<P = any>(eventID: EventID, payload?: P) {
    const eventListeners = this._listeners.get(eventID) || []
    eventListeners.forEach((callback) => {
      callback(payload)
    })
  }

  public emitAppEvent<T extends AppEventIds>(
    eventID: T,
    ...args: AppEvent<T> extends void ? [] : [AppEvent<T>]
  ) {
    const event = args.length ? args[0] : undefined
    this.emitEvent(eventID, event as object)
  }

  public addEventListener(eventID: EventID, handler: EventHandler) {
    if (!this._listeners.get(eventID)) {
      this._listeners.set(eventID, [])
    }
    const eventListeners = this._listeners.get(eventID) || []
    eventListeners.push(handler)

    // Return remove function to clean up listener
    return () => {
      this.removeEventListener(eventID, handler)
    }
  }

  public addAppEventListener<T extends AppEventIds>(
    eventID: T,
    handler: (event?: AppEvent<T>) => void,
  ) {
    return this.addEventListener(eventID, handler as EventHandler)
  }

  public removeEventListener(eventID: EventID, handler: EventHandler) {
    const callbacks = this._listeners.get(eventID) || []
    const updatedCallbacks = callbacks.filter((func) => (func === handler ? false : true))
    this._listeners.set(eventID, updatedCallbacks)
  }

  public listCommands(): Record<CommandID, ICommand> {
    const result: Record<CommandID, ICommand> = Object.fromEntries(this._commands)
    // Return a clone of the result to prevent mutation
    const immutableClone: Record<CommandID, ICommand> = Object.fromEntries(
      Object.entries(result).map(([key, value]) => [key, { ...value }]),
    )
    return immutableClone
  }

  public listChannels(): ChannelID[] {
    return ['main'] as ChannelID[]
  }

  public onChannelRegistered(_handler: EventHandler) {
    // No-op
    return
  }

  async isReady(_channels: ChannelID[]): Promise<void> {
    // Resolve immediately
    return
  }
}

// Export Instance
export const MockCommandsClient = new MockCommandsClientClass()
