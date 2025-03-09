/**
 * Client preload script to expose the `commands` API to all client/renderer processes.
 *
 * See the Electron documentation for details on how to use preload scripts:
 * https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
 */
import { contextBridge, ipcRenderer } from 'electron'

import { CommandRegistryEvents } from '@angelfish/core'
import { CommandsRegistry } from '../commands/commands-registry'
import { ProcessIDs } from '../windows/process-ids'
import { PreloadLogger } from './preload-logger'

// Initialise Command APIs
const commandRegistry = new CommandsRegistry({
  logger: PreloadLogger,
  routerChannel: ProcessIDs.MAIN,
})
const commandBridge = {
  listChannels: commandRegistry.listChannels.bind(commandRegistry),
  registerCommand: commandRegistry.registerCommand.bind(commandRegistry),
  listCommands: commandRegistry.listCommands.bind(commandRegistry),
  executeCommand: commandRegistry.executeCommand.bind(commandRegistry),
  emitEvent: commandRegistry.emitEvent.bind(commandRegistry),
  addEventListener: commandRegistry.addEventListener.bind(commandRegistry),
  removeEventListener: commandRegistry.removeEventListener.bind(commandRegistry),
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('commands', commandBridge)
} else {
  // @ts-ignore - Expose commands to the global window object when not context isolated
  window.commands = commandBridge
}

// Handle new channel connections
ipcRenderer.on(CommandRegistryEvents.REGISTER_NEW_CHANNEL, (event, id: string) => {
  const [port] = event.ports
  commandRegistry.registerNewChannel(id, port)
})
