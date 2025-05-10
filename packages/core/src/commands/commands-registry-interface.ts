/**
 * Command Handler Type: Callback handler function to handle commands
 *
 * @param payload   Payload to send with command
 * @returns         A Promise that resolves with the response
 *                  or rejects with an error when command fails
 */
export type CommandHandler = (payload: object) => Promise<any>

/**
 * Typed Command Handler Type: Callback handler function to handle commands
 * with generic payload and response types P and R
 *
 * @param payload   Payload to send with command
 * @returns         A Promise that resolves with the response
 *                  or rejects with an error when command fails
 */
export type TypedCommandHandler<P, R> = (payload: P) => Promise<R>

/**
 * Event Handler Type: Callback function to handle events
 *
 * @param payload   Optional payload to send with event
 */
export type EventHandler = (payload?: any) => void

/**
 * Command Interface for local Commands local to the process
 */
interface ILocalCommand {
  isLocal: true
  isPrivate: boolean
  handler: CommandHandler
}

/**
 * Command Interface for remote Commands that need to be called via
 * a channel
 */
interface IRemoteCommand {
  isLocal: false
  channelId: string
}

/**
 * Command Type: Holds metadata for a command
 *
 * @param isLocal   Whether the command is local or remote
 * @param handler   The Command handler to execute when Command is invoked
 * @param channelId The channel ID to use for remote commands
 */
export type ICommand = ILocalCommand | IRemoteCommand

// Unique ID for Channel (process)
export type ChannelID = string
// Unique ID for Command (i.e. register.user)
export type CommandID = string
// Unique message ID
export type MessageID = string
// Origin Process ID that sent request to route back response
export type OriginProcessID = string
// Event ID for emitted events
export type EventID = string

/**
 * CommandsRegistry Interface
 */
export interface ICommandsRegistry {
  listChannels(): ChannelID[]
  registerCommand(command: CommandID, handler: CommandHandler): Promise<void>
  listCommands(): Record<CommandID, ICommand>
  executeCommand<P>(command: CommandID, payload?: object): Promise<P>
  emitEvent(event: EventID, payload?: object): void
  addEventListener(event: EventID, callback: EventHandler): () => void
  removeEventListener(event: EventID, callback: EventHandler): void
}
