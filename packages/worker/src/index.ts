import { AppProcessIDs, CommandsClient, registerCommands } from '@angelfish/core'
import { getWorkerLogger } from './logger'

import { BookService } from './services/book'
import { UserService } from './services/user'

const logger = getWorkerLogger('WorkerProcess')

window.onload = async () => {
  await CommandsClient.isReady([AppProcessIDs.MAIN])
  registerCommands([BookService, UserService])
  logger.info('🚀 Worker window loaded')

  // Initialize the database connection
  await BookService.init()
}
