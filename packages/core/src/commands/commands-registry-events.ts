/**
 * Command Registry Events
 */
export enum CommandRegistryEvents {
  /**
   * Register a new IPC client channel a process can use to communicate with other
   * processes and emit events too
   */
  REGISTER_NEW_CHANNEL = 'register.new.channel',
  /**
   * New channel registered event emitted when a new channel is registered so
   * the process can wait for the channel to be ready before sending messages
   */
  NEW_CHANNEL_REGISTERED = '_new.channel.registered',
}
