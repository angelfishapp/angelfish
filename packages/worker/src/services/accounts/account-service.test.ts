/**
 * Tests for all the AccountService Methods
 */

import { book, mockRegisterTypedAppCommand } from '@angelfish/tests'

import type { IAccount } from '@angelfish/core'
import { AppCommandIds } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'

import { AccountService } from '.'

/**
 * Initialise in-memory SQLIte Database for use during tests
 */
beforeAll(async () => {
  await DatabaseManager.initConnection(':memory:')
  mockRegisterTypedAppCommand(AppCommandIds.GET_BOOK, async () => {
    return book
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
})
