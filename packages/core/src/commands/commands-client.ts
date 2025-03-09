import type { ChannelID, CommandID, ICommand } from './commands-registry-interface'

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
  registerCommand: async (commandID: string, handler: Function): Promise<void> => {
    return await window.commands.registerCommand(commandID, handler)
  },

  /**
   * Execute a command with the CommandsRegistry. Can type command return value with generics.
   *
   * @param commandID - The ID of the command to execute.
   * @param payload - The payload to pass to the command handler.
   * @returns A promise that resolves with the return value of the command handler.
   */
  executeCommand: async <P>(commandID: string, payload?: any): Promise<P> => {
    return await window.commands.executeCommand(commandID, payload)
  },

  /**
   * Emit an event with the CommandsRegistry. Events with underscores will only emit
   * to the process that emitted them.
   *
   * @param eventID - The ID of the event to emit.
   * @param payload - The payload to pass to the event handler.
   */
  emitEvent: (eventID: string, payload?: any) => {
    window.commands.emitEvent(eventID, payload)
  },

  /**
   * Add an event listener to the CommandsRegistry.
   *
   * @param eventID - The ID of the event to listen for.
   * @param handler - The handler for the event.
   */
  addEventListener: (eventID: string, handler: Function) => {
    window.commands.addEventListener(eventID, handler)
  },

  /**
   * Remove an event listener from the CommandsRegistry.
   *
   * @param eventID - The ID of the event to remove the listener from.
   * @param handler - The handler to remove.
   */
  removeEventListener: (eventID: string, handler: Function) => {
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
}
