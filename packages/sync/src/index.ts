import { CommandsClient, Environment, Logger } from '@angelfish/core'

const logger = Logger.scope('sync')

window.onload = async () => {
  logger.info('🚀 Sync window loaded')

  // Wait for the main and worker IPC channels to be ready
  await CommandsClient.isReady(['main', 'worker'])

  logger.info('sync hello from new IPC bridge', Environment.toObject())
}
