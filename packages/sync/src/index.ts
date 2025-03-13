import { CommandsClient, Logger, registerCommands } from '@angelfish/core'

import { AuthService } from './services/auth'
import { CloudService } from './services/cloud'

const logger = Logger.scope('sync')

window.onload = async () => {
  // Wait for the main and worker IPC channels to be ready
  await CommandsClient.isReady(['main', 'worker'])
  logger.info('🚀 Sync Process Loaded')

  // Register Commands
  registerCommands([AuthService, CloudService])

  // Initialize the AuthService
  await AuthService.init()

  // Test sending an OOB Code
  await CommandsClient.executeCommand('auth.send.oob.code', { email: 'test@angelfish.app' })
  const user = await CommandsClient.executeCommand('auth.authenticate', { oob_code: '123456' })
  logger.info('Authenticated User:', user)
}
