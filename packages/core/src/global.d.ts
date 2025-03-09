import type { ICommandsRegistry } from './commands/commands-registry-interface'

/**
 * Define Global Types Here
 */

declare global {
  interface Window {
    /**
     * Commands API for registering and executing commands and events
     */
    commands: ICommandsRegistry<MessagePort>
  }
}
