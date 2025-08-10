/**
 * Client preload script to expose the `commands` API to all client/renderer processes.
 *
 * See the Electron documentation for details on how to use preload scripts:
 * https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
 */
import { contextBridge, ipcRenderer } from 'electron'
import type { LevelOption } from 'electron-log'

import { AppProcessIDs, CommandRegistryEvents } from '@angelfish/core'
import { CommandsRegistry } from '../commands/commands-registry'
import { LogEvents } from '../logging/logging-events'
import log, { logBridge } from './preload-logger'
import { getArgumentValue } from './preload-utils'

// Initialise Command APIs
const commandRegistry = new CommandsRegistry({
  logger: log.scope('Preload'),
  routerChannel: AppProcessIDs.MAIN,
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
const localizationBridge = {
  getLocalization: () => ipcRenderer.invoke('localization:get'),
  setLocalization: (locale: string) => ipcRenderer.invoke('localization:set', locale),
  onLocalizationUpdated: (callback: () => void) => {
    ipcRenderer.on('localization:updated', callback)
  },
  removeLocalizationListeners: () => {
    ipcRenderer.removeAllListeners('localization:updated')
  },
}

// Initialise Environment Variables
let logLevel: LevelOption = 'debug'
const environmentBridge = {
  // The environment the app is running in
  environment: getArgumentValue('environment'),
  // The OS platform the app is running on
  platform: getArgumentValue('platform'),
  // The process ID of the current process
  processId: getArgumentValue('process'),
  // Location of the logs directory for app if process is writing logs directly
  logsDir: getArgumentValue('logsDir'),
  // Location of the user data directory for app
  userDataDir: getArgumentValue('user-data-dir'),
  // Log level for the current process
  logLevel: (): LevelOption => {
    return logLevel
  },
}

// Expose Bridges to window object
if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('commands', commandBridge)
  contextBridge.exposeInMainWorld('environment', environmentBridge)
  contextBridge.exposeInMainWorld('log', logBridge)
  contextBridge.exposeInMainWorld('localization', localizationBridge)
} else {
  // @ts-ignore - Expose commands to the global window object when not context isolated
  window.commands = commandBridge
  // @ts-ignore - Expose environment to the global window object when not context isolated
  window.environment = environmentBridge
  // @ts-ignore - Expose log to the global window object when not context isolated
  window.log = logBridge
}

// Handle new channel connections
ipcRenderer.on(CommandRegistryEvents.REGISTER_NEW_CHANNEL, (event, id: string) => {
  const [port] = event.ports
  commandRegistry.registerNewChannel(id, port)
})

// Handle log level changes between refreshes
ipcRenderer.on(LogEvents.ON_LOGGING_SET_LEVEL, (_event, level: LevelOption) => {
  logLevel = level
  // Pass event to the window process
  window.postMessage({ event: LogEvents.ON_LOGGING_SET_LEVEL, level }, '*')
  // As we're only logging to console in development, check if we're in development
  if (environmentBridge.environment === 'development') {
    log.scope('Preload').info(`Log level set to ${level}`)
    log.transports.console.level = level
  }
})

// Handle dynamic app log level changes
commandRegistry.addEventListener(
  LogEvents.ON_LOGGING_LEVEL_CHANGED,
  (change: { level: LevelOption }) => {
    logLevel = change.level
    // As we're only logging to console in development, check if we're in development
    if (environmentBridge.environment === 'development') {
      log.scope('Preload').info(`Log level changed to ${change.level}`)
      log.transports.console.level = change.level
    }
  },
)
