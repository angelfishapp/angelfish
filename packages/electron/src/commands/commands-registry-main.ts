import type { MessagePortMain } from 'electron'

import { getMainLogger } from '../logger'
import { CommandsRegistry } from './commands-registry'

const logger = getMainLogger('CommandsRegistryMain')

/**
 * CommandsRegistryMain: Main process Commands Registry to manage and route
 * commands and events between processes
 *
 * @example
 * // Register a new command in the main process
 * CommandsRegistryMain.registerCommand('main.log', async (payload) => {
 *  console.log('test command invoked with payload:', payload)
 *  return { response: 'test command response' }
 * })
 *
 * // Execute a command in the main process
 * CommandsRegistryMain.executeCommand('main.log', { test: 'payload' }).then((response) => {
 *  console.log('test command response:', response)
 * })
 */
export const CommandsRegistryMain = new CommandsRegistry<MessagePortMain>({ logger: logger })
