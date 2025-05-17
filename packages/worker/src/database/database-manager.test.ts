import type { DataSource, Repository } from 'typeorm'

import { DatabaseManager } from './database-manager'
import { AccountEntity, CategoryGroupEntity } from './entities'

import { TestLogger } from '@angelfish/tests'

// Database connection to use during tests
let appDb: DataSource
let categoriesGroupRepository: Repository<CategoryGroupEntity>
let accountsRepository: Repository<AccountEntity>

/**
 * Initialise in-memory SQLIte Database for use during tests
 */
beforeAll(async () => {
  appDb = await DatabaseManager.initConnection(':memory:')
  categoriesGroupRepository = appDb.getRepository(CategoryGroupEntity)
  accountsRepository = appDb.getRepository(AccountEntity)
})

/**
 * Make sure we close Database connection at end of tests
 */
afterAll(async () => {
  await appDb.destroy()
})

/**
 * Tests
 */

test('test db initialised', async () => {
  // Check all category accounts were loaded correctly
  const accountsCount = await accountsRepository.count()
  expect(accountsCount).toEqual(130)

  // Check all category groups were loaded correctly
  const categoriesGroupCount = await categoriesGroupRepository.count()
  expect(categoriesGroupCount).toEqual(21)

  TestLogger.info(
    'Successfully loaded ' +
      categoriesGroupCount +
      ' CategoryGroups and ' +
      accountsCount +
      ' Categories.',
  )
})
