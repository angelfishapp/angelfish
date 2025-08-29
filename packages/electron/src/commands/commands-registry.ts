import type { MessageEvent as MessageEventMain, MessagePortMain } from 'electron'
import type { LogFunctions, LogLevel } from 'electron-log'

import type {
  ChannelID,
  CommandID,
  EventHandler,
  EventID,
  ICommand,
  ICommandsRegistry,
  MessageID,
  OriginProcessID,
  TypedCommandHandler,
} from '@angelfish/core'
import { CommandRegistryEvents } from '@angelfish/core'
import type {
  ICommandEvent,
  ICommandListRequest,
  ICommandListResponse,
  ICommandRegister,
  ICommandRequest,
  ICommandResponse,
  ICommandResponseError,
} from './commands-messages-types'
import { redactPayload } from './commands-registry-utils'

/**
 * A ResposeHandler is a Promise that can be resolved or rejected by the client
 * when a Command Response or Error is received and processed.
 */
type ResposeHandler = {
  // Resolve promise with value on successful response
  resolve: (value: any) => void
  // Reject promise with reason on error
  reject: (reason?: string) => void
}

/**
 * CommandsRegistryConfig Interface to configure the registry when initialised
 */
export interface ICommandsRegistryConfig {
  /**
   * Optional ID to identify the process in logs if running unit tests in single thread
   * @default undefined
   */
  id?: ChannelID
  /**
   * Optional logger to use for logging, if not provided no logs will be written
   * @default undefined
   */
  logger?: LogFunctions
  /**
   * The channel to use for routing commands. If set will forward any commands
   * not registered in Registry to router channel to be forwarded on
   * @default undefined
   */
  routerChannel?: string
}

/**
 * CommandsRegistry: Allows a process to register commands and events
 * and handle incoming messages from other processes.
 *
 *  - Enables registering of IPC channel ports to connect with other processes
 *    directly. Registering new commands in the process and emiting events will
 *    broadcast to all connected channels.
 *  - Allows a process to register commands and events and handle incoming messages
 *    from other processes.
 *  - Provides an API to subscribe to events from the local/remote processes and register
 *    handlers to do something when the event is received.
 */
export class CommandsRegistry<T extends MessagePort | MessagePortMain>
  implements ICommandsRegistry
{
  // Holds the configuration for the registry
  private _config: ICommandsRegistryConfig
  // Holds map of all IPC channels connected to the client
  private _channels: Map<ChannelID, T> = new Map()
  // Holds map of all registered commands
  private _commands = new Map<CommandID, ICommand>()
  // Holds list of unresolved Promises from executeCommand()
  private _replyHandlers = new Map<MessageID, ResposeHandler>()
  // Holds list of message IDs and origin process IDs to route responses back to original process
  private _routeHandlers = new Map<MessageID, OriginProcessID>()
  // Holds list of event listeners with callback functions
  private _listeners = new Map<EventID, EventHandler[]>()

  /**
   * Constructor to initialise the registry with configuration
   *
   * @param config  The configuration for the registry:
   *                  - logger: Optional logger to use for logging, if not provided no logs will be output (default: undefined)
   *                  - routerChannel: The channel to use for routing commands (default: undefined). If isRouter is true this
   *                      property cannot be set and class will throw error when initialising
   *
   */
  public constructor(config: ICommandsRegistryConfig = {}) {
    this._config = {
      id: undefined, // Default: No ID
      logger: undefined, // Default: No logging
      routerChannel: undefined, // Default: No router channel
      ...config, // Merge user-provided values
    }

    this._log(
      'info',
      `CommandsRegistry initialised ${this._config.routerChannel ? `with routerChannel ${this._config.routerChannel}` : ''}`,
    )
  }

  /**
   * Write logs for registry if a logger has been provided in the config
   * otherwise does nothing
   *
   * @param level     The log level to write
   * @param message   The message to log
   * @param args      Any additional arguments to log
   */
  private _log(level: LogLevel, message: string, ...args: any[]) {
    if (this._config.logger) {
      this._config.logger[level](
        this._config.id ? `[${this._config.id}] ${message}` : message,
        ...args,
      )
    }
  }

  /**
   * Register a new channel to the client and setup the message handler
   * to handle incoming messages from the channel.
   *
   * @param id          The unique ID for channel
   * @param port        The channel MessagePort to register
   */
  public registerNewChannel(id: string, port: T) {
    // Add or replace the channel in the map
    this._log('debug', `🎙️ Registering new IPC Channel *${id}*`)
    this._channels.set(id, port)

    // Create a bound handler to handle onmessage events
    const boundHandler = (
      event:
        | MessageEventMain
        | MessageEvent<ICommandRequest | ICommandResponse | ICommandResponseError>,
    ) => this._handleMessage(id, event)

    if (port instanceof MessagePort) {
      // Initialise channel in preload process
      port.onmessage = boundHandler
    } else {
      // Initialise channel in Main process
      // Setup message handler for the channel
      port.on('message', boundHandler)
      // Handle channel close event
      port.on('close', () => {
        // Remove the channel from the map when it's closed
        this._channels.delete(id)
        // Remove any command handlers for the channel
        this._commands.forEach((command, key) => {
          if (command.isLocal === false && command.channelId === id) {
            this._commands.delete(key)
          }
        })
        this._log('debug', `🎙️ IPC Channel *${id}* closed`)
      })
      // Start the port to begin receiving messages
      port.start()
    }

    // Make request to connected process to get list of commands
    port.postMessage({ type: 'list' } as ICommandListRequest)

    // Emit event to notify local process about new channel
    this.emitEvent(CommandRegistryEvents.NEW_CHANNEL_REGISTERED, { id })
  }

  /**
   * Handle incoming messages from a channel
   *
   * @param event   The message event to handle
   */
  private _handleMessage = async (
    id: string,
    event:
      | MessageEventMain
      | MessageEvent<
          | ICommandRegister
          | ICommandRequest
          | ICommandEvent
          | ICommandResponse
          | ICommandResponseError
          | ICommandListRequest
          | ICommandListResponse
        >,
  ): Promise<void> => {
    const msg = event.data as
      | ICommandRegister
      | ICommandRequest
      | ICommandEvent
      | ICommandResponse
      | ICommandResponseError
      | ICommandListRequest
      | ICommandListResponse

    this._log('silly', `Received message from ${id}:`, redactPayload(msg))

    // Get channel port
    const channel = this._channels.get(id)
    if (!channel) {
      this._log('error', `Channel ${id} not found`)
      return
    }

    // Handle message based on type
    switch (msg.type) {
      case 'register':
        this._log('debug', `📞 Registering remote command ${msg.command} for process "${id}"`)
        // Register a new remote command handler for a remote process
        // If a process restarts and re-registers a command, ignore, but throw error
        // if another process tries to register the same command
        if (this._commands.has(msg.command)) {
          const command = this._commands.get(msg.command)
          if (command?.isLocal || (command?.isLocal === false && command.channelId !== id)) {
            // Return error if local command or another process has command already registered with same ID
            channel.postMessage({
              type: 'error',
              id: msg.id,
              reason: `Command "${msg.command}" already registered`,
            } as ICommandResponseError)
          }
          break
        }

        // Otherwise register the command
        this._commands.set(msg.command, {
          isLocal: false,
          channelId: id,
        } as ICommand)
        // Send successsful response
        channel.postMessage({
          type: 'response',
          id: msg.id,
        } as ICommandResponse)
        break

      case 'list':
        {
          // List all registered commands for this process
          const commands = [...this._commands.keys()].filter(
            (key) => this._commands.get(key)?.isLocal,
          )
          this._log('debug', `Sending list of commands to client *${id}*`, commands)
          channel.postMessage({
            type: 'list-response',
            commands,
          } as ICommandListResponse)
        }
        break

      case 'list-response':
        // Add all remote commands to the registry
        this._log('debug', `📞 Received list of commands from client *${id}*`, msg.commands)
        msg.commands.forEach((command) => {
          this._commands.set(command, {
            isLocal: false,
            channelId: id,
          } as ICommand)
        })
        break

      case 'event':
        this.emitEvent(msg.event, msg.payload, id)
        break

      case 'request':
        try {
          const command = this._commands.get(msg.command)
          if (command) {
            if (command.isLocal) {
              const response = await command.handler(msg.payload ?? {})
              channel.postMessage({
                type: 'response',
                id: msg.id,
                payload: response,
              } as ICommandResponse)
            } else {
              // If request is from another process command is remote,
              // forward the request to the remote process
              this._log('silly', `Forwarding request to remote channel *${command.channelId}*`)
              const remoteChannel = this._channels.get(command.channelId)
              if (remoteChannel) {
                this._routeHandlers.set(msg.id, id)
                remoteChannel.postMessage(msg)
              } else {
                throw new Error(`Remote channel ${command.channelId} not found`)
              }
            }
          } else {
            throw new Error(`Command "${msg.command}" not found`)
          }
        } catch (error) {
          this._log('error', `Error executing command "${msg.command}":`, error)
          channel.postMessage({
            type: 'error',
            id: msg.id,
            reason: `${error}`,
          } as ICommandResponseError)
        }
        break

      case 'response':
      case 'error':
        {
          const replyHandler = this._replyHandlers.get(msg.id)
          if (replyHandler) {
            if (msg.type === 'response') {
              replyHandler.resolve(msg.payload)
            } else {
              replyHandler.reject(msg.reason)
            }
            this._replyHandlers.delete(msg.id)
          } else if (this._routeHandlers.has(msg.id)) {
            // If no reply handler found, check if we need to route the response back to the original process
            const originId = this._routeHandlers.get(msg.id)
            this._log('silly', `Forwarding response back to origin channel *${originId}*`)
            const channel = this._channels.get(originId as string)
            if (channel) {
              channel.postMessage(msg)
            } else {
              this._log('error', `Origin channel ${originId} not found`)
            }
            this._routeHandlers.delete(msg.id)
          } else {
            this._log('error', `No handler found for response: ${msg.id}`)
          }
        }
        break

      default:
        this._log('warn', `Unknown message type received from client *${id}*:`, msg)
    }
  }

  /**
   * Lists all the registered channels the registry is connected too
   *
   * @returns   An array of ChannelID
   */
  public listChannels(): ChannelID[] {
    return Array.from(this._channels.keys())
  }

  /**
   * Register a new local command in the registry. Will broadcast the new command to
   * all connected channels so they are able to route the command to the correct process
   *
   * If am command start with underscore, it will be considered as a private command only
   * local to the process and not broadcast to other channels (i.e. _private.command)
   *
   * @param command     The unique Command to register
   * @param handler     The Command handler to execute when Command is invoked
   */
  public async registerCommand<P, R>(
    command: CommandID,
    handler: TypedCommandHandler<P, R>,
  ): Promise<void> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (this._commands.has(command)) {
        return reject(new Error(`Command handler for "${command}" already registered`))
      }

      this._log('silly', `Registering new command "${command}"`)
      this._commands.set(command, {
        isLocal: true,
        isPrivate: command.startsWith('_'),
        handler,
      } as ICommand)

      if (!command.startsWith('_')) {
        // Register command with all connected channels
        const channelPromises = [...this._channels].map(([_, channel]) =>
          this._invoke(channel, {
            type: 'register',
            id: crypto.randomUUID(),
            command,
          } as ICommandRegister),
        )

        try {
          await Promise.all(channelPromises) // Wait for all channels to complete
          this._log('debug', `☎️ Registered new command "${command}"`)
          return resolve()
        } catch (error) {
          return reject(new Error(`Failed to register command: ${error}`))
        }
      }
      this._log('debug', `☎️ Registered new command "${command}"`)
      return resolve()
    })
  }

  /**
   * Lists all the registered commands the registry contains with their associated
   * metadata
   *
   * @returns   A Record<string, Command> of all registered commands
   */
  public listCommands(): Record<CommandID, ICommand> {
    const result: Record<CommandID, ICommand> = Object.fromEntries(this._commands)
    // Return a clone of the result to prevent mutation
    const immutableClone: Record<CommandID, ICommand> = Object.fromEntries(
      Object.entries(result).map(([key, value]) => [key, { ...value }]),
    )
    return immutableClone
  }

  /**
   * Execute a command with optional payload P and return a Promise of type R
   *
   * @param commandId     Command ID to invoke
   * @param request       Optional payload to send with command
   * @throws              Error if command not found or fails
   */
  public async executeCommand<R, P = any>(
    commandId: string,
    ...args: P extends void ? [] : [P]
  ): Promise<R> {
    const commandInfo = this._commands.get(commandId)
    const payload = args.length > 0 ? args[0] : {}
    if (commandInfo) {
      if (commandInfo.isLocal) {
        // Handle local command
        return (await commandInfo.handler(payload as object)) as R
      }
      // Handle remote command
      const channel = this._channels.get(commandInfo.channelId)
      if (channel) {
        return await this._invoke<R>(channel, {
          type: 'request',
          id: crypto.randomUUID(),
          command: commandId,
          payload,
        } as ICommandRequest)
      }
      throw new Error(`Channel ${commandInfo.channelId} not found`)
    }

    // If command not found, forward to router channel if provided
    if (this._config.routerChannel) {
      const routerChannel = this._channels.get(this._config.routerChannel)
      if (routerChannel) {
        return await this._invoke<R>(routerChannel, {
          type: 'request',
          id: crypto.randomUUID(),
          command: commandId,
          payload,
        } as ICommandRequest)
      }
      throw new Error(`Router channel ${this._config.routerChannel} not found`)
    }

    throw new Error(`Command "${commandId}" and router channel not found`)
  }

  /**
   * Send a request to execute to a remote process that expects a response
   * which needs to be handled by the client
   *
   * @param channel   The channel to send the request to
   * @param request   The request to send
   * @returns         A Promise that resolves with the response
   *                  or rejects with an error when command fails
   */
  private async _invoke<R>(channel: T, request: ICommandRequest | ICommandRegister): Promise<R> {
    channel.postMessage(request)
    return new Promise<R>((resolve, reject) => {
      this._replyHandlers.set(request.id, { resolve, reject })
    })
  }

  /**
   * Emit an Event to all listeners. If an event starts with an underscore `_` it will only be emitted
   * locally and not broadcast to other channels.
   *
   * @param event     The Event to emit
   * @param payload   Optional payload to send with event
   * @param origin    The process that originally emitted the event
   */
  public emitEvent(event: EventID, payload?: object, origin?: ChannelID) {
    this._log('silly', `Emitting event *${event}* from origin ${origin}:`)
    // Send event to all local listeners
    const eventListeners = this._listeners.get(event) || []
    eventListeners.forEach((callback) => {
      callback(payload)
    })

    if (!event.startsWith('_')) {
      if (this._config.routerChannel) {
        if (!origin) {
          // If router channel is set and current process is origin (origin === undefined),
          // forward event to router channel only to ensure each process only receives the event once
          this._log('silly', `Forwarding event to router channel *${this._config.routerChannel}*`)
          const routerChannel = this._channels.get(this._config.routerChannel)
          if (routerChannel) {
            routerChannel.postMessage({
              type: 'event',
              event,
              payload,
            } as ICommandEvent)
          }
        }
        return
      }
      // If not (i.e. is a router), broadcast event to all connected process channels
      this._log('silly', `Broadcasting event to all connected channels`)
      this._channels.forEach((channel, channelId) => {
        if (channelId !== origin) {
          channel.postMessage({
            type: 'event',
            event,
            payload,
          } as ICommandEvent)
        }
      })
    }
  }

  /**
   * Add an Event listener for specific Command Events
   *
   * @param event       The Command Event name
   * @param callback    The function to invoke when event received
   * @returns           A function to remove the listener when no longer needed
   */
  public addEventListener(event: EventID, callback: EventHandler): () => void {
    if (!this._listeners.get(event)) {
      this._listeners.set(event, [])
    }
    const eventListeners = this._listeners.get(event) || []
    eventListeners.push(callback)

    // Return remove function to clean up listener
    return () => {
      this.removeEventListener(event, callback)
    }
  }

  /**
   * Remove an Event listener for for specific Command Events
   *
   * @param event       The Command Event name
   * @param callback    The function to invoke when event received
   */
  public removeEventListener(event: EventID, callback: EventHandler) {
    const callbacks = this._listeners.get(event) || []
    const updatedCallbacks = callbacks.filter((func) => (func === callback ? false : true))
    this._listeners.set(event, updatedCallbacks)
  }
}
