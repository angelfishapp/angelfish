import { CommandsClient, Logger } from '@angelfish/core'

const logger = Logger.scope('sync')

window.onload = async () => {
  // Wait for the main and worker IPC channels to be ready
  await CommandsClient.isReady(['main', 'worker'])
  logger.info('🚀 Sync Process Loaded')
}
