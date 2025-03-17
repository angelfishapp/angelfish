import { CommandsClient, Logger, registerCommands } from '@angelfish/core'

import { AuthService } from './services/auth'
import { CloudService } from './services/cloud'
import { SyncService } from './services/sync'

const logger = Logger.scope('SyncProcess')

window.onload = async () => {
  // Wait for the main and worker IPC channels to be ready
  await CommandsClient.isReady(['main', 'worker'])

  // Register Commands
  registerCommands([AuthService, CloudService, SyncService])
  logger.info('🚀 Sync Process Loaded')

  // Initialize the AuthService
  await AuthService.init()
}
