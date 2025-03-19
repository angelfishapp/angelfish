import { AppProcessIDs, CommandsClient, registerCommands } from '@angelfish/core'
import { getWorkerLogger } from './logger'

import { AccountService } from './services/accounts'
import { BookService } from './services/book'
import { CatoryGroupService } from './services/category-groups'
import { DatasetService } from './services/datasets'
import { ImportService } from './services/import'
import { InstitutionService } from './services/institutions'
import { ReportsService } from './services/reports'
import { TagService } from './services/tags'
import { TransactionService } from './services/transactions'
import { UserService } from './services/user'

const logger = getWorkerLogger('WorkerProcess')

window.onload = async () => {
  await CommandsClient.isReady([AppProcessIDs.MAIN])

  // Initialize the database connection
  await BookService.init()

  // Register Commands
  registerCommands([
    BookService,
    UserService,
    AccountService,
    CatoryGroupService,
    InstitutionService,
    TagService,
    TransactionService,
    ImportService,
    ReportsService,
    DatasetService,
  ])
  logger.info('🚀 Worker window loaded')
}
