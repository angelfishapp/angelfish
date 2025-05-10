import { AppEventIds, AppProcessIDs, CommandsClient, registerCommands } from '@angelfish/core'
import { getWorkerLogger } from './logger'

import { AccountService } from './services/accounts'
import { BookService } from './services/book'
import { CategoryGroupsService } from './services/category-groups'
import { DatasetService } from './services/datasets'
import { ImportService } from './services/import'
import { InstitutionService } from './services/institutions'
import { ReportsService } from './services/reports'
import { TagService } from './services/tags'
import { TransactionService } from './services/transactions'
import { UserService } from './services/user'

const logger = getWorkerLogger('WorkerProcess')

// Entry point for the worker process
window.onload = async () => {
  await CommandsClient.isReady([AppProcessIDs.MAIN])
  logger.info('🚀 Starting Worker process...')

  try {
    // Initialize the database connection
    await BookService.init()

    // Register Commands
    registerCommands([
      BookService,
      UserService,
      AccountService,
      CategoryGroupsService,
      InstitutionService,
      TagService,
      TransactionService,
      ImportService,
      ReportsService,
      DatasetService,
    ])
  } catch (error) {
    logger.error('💥 Error initializing worker process', error)
  }

  CommandsClient.emitAppEvent(AppEventIds.ON_WORKER_READY)
  logger.info('🚀 Worker window loaded')
}
