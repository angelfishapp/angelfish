import { AppProcessIDs, CommandsClient, registerCommands } from '@angelfish/core'
import { getWorkerLogger } from './logger'

import { AccountService } from './services/accounts'
import { BookService } from './services/book'
import { CatoryGroupService } from './services/category-groups'
import { InstitutionService } from './services/institutions'
import { TagService } from './services/tags'
import { UserService } from './services/user'

const logger = getWorkerLogger('WorkerProcess')

window.onload = async () => {
  await CommandsClient.isReady([AppProcessIDs.MAIN])
  registerCommands([
    BookService,
    UserService,
    AccountService,
    CatoryGroupService,
    InstitutionService,
    TagService,
  ])
  logger.info('🚀 Worker window loaded')

  // Initialize the database connection
  await BookService.init()
}
