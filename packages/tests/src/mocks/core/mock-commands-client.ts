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
  ICommand,
} from '@angelfish/core'

/**
 * Mock @angelfish/core CommandsClient before any test runs so we don't get 'window' is not defined
 * errors when running tests in Node.js.
 */
export const MockCommandsClient = {
  registerCommand: async (_commandID: string, _handler: CommandHandler): Promise<void> => {
    return
  },

  executeCommand: async <R, P = any>(_commandId: string, _request?: P): Promise<R> => {
    return {} as R
  },

  executeAppCommand: async <T extends AppCommandIds>(
    _command: T,
    ...args: AppCommandRequest<T> extends void ? [] : [AppCommandRequest<T>]
  ): AppCommandResponse<T> => {
    return {} as AppCommandResponse<T>
  },

  emitEvent: <P = any>(_eventId: string, _payload?: P) => {
    return
  },

  emitAppEvent: <T extends AppEventIds>(
    _eventId: T,
    ...args: AppEvent<T> extends void ? [] : [AppEvent<T>]
  ) => {
    return
  },

  addEventListener: (_eventId: string, _handler: EventHandler) => {
    return
  },

  addAppEventListener: <T extends AppEventIds>(
    _eventId: T,
    _handler: (event?: AppEvent<T>) => void,
  ) => {
    return
  },

  removeEventListener: (_eventId: string, _handler: EventHandler) => {
    return
  },

  listCommands: (): Record<CommandID, ICommand> => {
    return [] as unknown as Record<CommandID, ICommand>
  },

  listChannels: (): ChannelID[] => {
    return [] as ChannelID[]
  },

  onChannelRegistered: (_handler: EventHandler) => {
    return
  },

  isReady: async (_channels: ChannelID[]): Promise<void> => {
    return
  },
}
