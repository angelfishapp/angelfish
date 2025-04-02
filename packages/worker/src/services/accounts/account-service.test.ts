/**
 * Tests for all the AccountService Methods
 */

import {
  accounts,
  book,
  institutions,
  mockRegisterTypedAppCommand,
  TestLogger,
  users,
} from '@angelfish/tests'

import type { IAccount } from '@angelfish/core'
import { AppCommandIds } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { InstitutionEntity, UserEntity } from '../../database/entities'

import { AccountService } from '.'

/**
 * Initialise in-memory SQLIte Database for use during tests
 */
beforeAll(async () => {
  await DatabaseManager.initConnection(':memory:')
  // Need to setup database with User, Instutition and Account to create Bank Accounts
  // Do this directly on database without using services to isolate tests from bugs in other
  // service
  const userRepo = DatabaseManager.getConnection().getRepository(UserEntity)
  await userRepo.save(users)
  const institutionRepo = DatabaseManager.getConnection().getRepository(InstitutionEntity)
  await institutionRepo.save(institutions)
  mockRegisterTypedAppCommand(AppCommandIds.GET_BOOK, async () => {
    return book
  })
  mockRegisterTypedAppCommand(AppCommandIds.START_SYNC, async () => ({ completed: true }))
  mockRegisterTypedAppCommand(AppCommandIds.RUN_DATASET_QUERY, async (request) => {
    const { datasetName, queryName, params } = request
    TestLogger.debug(
      `Running dataset query ${datasetName} ${queryName} with params ${JSON.stringify(params)}`,
    )

    if (queryName === 'latestRates') {
      return [
        { currency: 'GBP', rate: 0.7738 },
        { currency: 'EUR', rate: 0.9261 },
      ]
    }

    return []
  })
})

/**
 * Make sure we close Database connection at end of tests
 */
afterAll(async () => {
  await DatabaseManager.close()
})

/**
 * Tests
 */

describe('AccountService', () => {
  test('test list-accounts', async () => {
    // Test Getting all accounts in DB
    const response = await AccountService.listAccounts({})
    expect(response.length).toEqual(121)
  })

  test('test list-account-currencies', async () => {
    // Test Getting all currencies in DB
    const response = await AccountService.listAccountCurrencies()
    expect(response.default_currency).toEqual('USD')
    expect(response.foreign_currencies.length).toEqual(0)
  })

  test('test get-account', async () => {
    // Test getting account in DB with id=1
    const response = await AccountService.getAccount({ id: 1 })
    expect(response?.name).toBe('Interest')
  })

  test('test save-account', async () => {
    // Create new category and get it to ensure its saved into DB
    const category = {
      class: 'CATEGORY',
      name: 'Test Category',
      cat_type: 'Optional',
      cat_icon: 'home',
      cat_description: 'This is a description',
      cat_group_id: 1,
    } as IAccount

    let response = await AccountService.saveAccount(category)
    expect(response.id).toBeDefined()
    expect(response.name).toBe('Test Category')

    // Test Updating the category
    response.name = 'Test Category 2'
    response = await AccountService.saveAccount(response)
    expect(response.name).toBe('Test Category 2')
  })

  test('test delete-account', async () => {
    // Delete account created in last test with id 122
    await AccountService.deleteAccount({ id: 122, reassignId: null })

    // Try getting the account, should be null
    const account = await AccountService.getAccount({ id: 122 })
    expect(account).toBeNull()
  })

  test('test bank-account-currencies', async () => {
    // Save GBP bank account
    const gbpAccount = accounts[125] as Partial<IAccount>
    gbpAccount.name = 'GBP Account'
    gbpAccount.id = undefined
    gbpAccount.acc_start_balance = 1000
    TestLogger.debug('Saving GBP account', gbpAccount)
    const bankAccount = await AccountService.saveAccount(accounts[125])
    expect(bankAccount.id).toBeDefined()
    expect(bankAccount.current_balance).toEqual(1000)
    expect(bankAccount.local_current_balance).toEqual(1292.32)

    // Delete GBP account
    await AccountService.deleteAccount({ id: bankAccount.id, reassignId: null })
  })
})
