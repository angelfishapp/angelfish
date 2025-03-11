import { CommandRegistryEvents, CommandsClient, registerCommands } from '@angelfish/core'
import { TestService } from './TestService'
import { getWorkerLogger } from './logger'

import { DatabaseManager } from './database/database-manager'
import { AccountEntity, CategoryGroupEntity } from './database/entities'

const logger = getWorkerLogger('worker')

// Promise that resolves when IPC channel is ready to
// let frontend know it can start making API calls
let resolveIsReadyPromise: (value: unknown) => void
const isReadyPromise = new Promise((resolve) => {
  resolveIsReadyPromise = resolve
})
let isMainConnected = false
let isAppConnected = false

CommandsClient.addEventListener(
  CommandRegistryEvents.NEW_CHANNEL_REGISTERED,
  (payload: { id: string }) => {
    logger.info('Channel registered:', payload.id)
    if (payload.id === 'main') {
      isMainConnected = true
    }
    if (payload.id === 'app') {
      isAppConnected = true
    }
    if (isMainConnected && isAppConnected) {
      logger.info('IPC channels are ready')
      resolveIsReadyPromise(null)
    }
  },
)

window.onload = async () => {
  logger.info('🚀 Worker window loaded')

  await isReadyPromise
  registerCommands([TestService])

  const db = await new DatabaseManager(':memory:').getDataSource()
  const categoriesGroupRepository = db.getRepository(CategoryGroupEntity)
  logger.info('Category Groups Count', await categoriesGroupRepository.count())
  const accountsRepository = db.getRepository(AccountEntity)
  logger.info('Categories Count', await accountsRepository.count())
}
