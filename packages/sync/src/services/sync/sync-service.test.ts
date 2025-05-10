/**
 * Tests for all the SyncService Methods
 */

import { AppCommandIds, registerCommands } from '@angelfish/core'
import { mockRegisterTypedAppCommand, TestLogger, transactions, users } from '@angelfish/tests'
import { MockCloudService } from '../../../tests/mock-cloud-service'

import { SyncService } from '.'

/**
 * Initialise mock App Commands for use during tests
 */
beforeAll(async () => {
  mockRegisterTypedAppCommand(AppCommandIds.SET_AUTHENTICATION_SETTINGS, async () => {})
  mockRegisterTypedAppCommand(AppCommandIds.GET_USER, async () => {
    return users[0]
  })
  mockRegisterTypedAppCommand(AppCommandIds.SAVE_USER, async () => {
    return users[0]
  })
  mockRegisterTypedAppCommand(AppCommandIds.LIST_DATASETS, async () => {
    return ['currencies']
  })
  mockRegisterTypedAppCommand(AppCommandIds.LIST_ACCOUNT_CURRENCIES, async () => {
    return {
      default_currency: 'USD',
      foreign_currencies: ['EUR', 'GBP'],
    }
  })
  mockRegisterTypedAppCommand(AppCommandIds.INSERT_DATASET_ROWS, async (request) => {
    const { datasetName, rows } = request
    TestLogger.debug(`Inserting ${rows.length} rows into dataset '${datasetName}'`, rows)
  })
  mockRegisterTypedAppCommand(AppCommandIds.GET_TRANSACTIONS_DATE_RANGE, async () => {
    return {
      start_date: '2025-03-01',
      end_date: '2025-03-31',
    }
  })
  mockRegisterTypedAppCommand(AppCommandIds.RUN_DATASET_QUERY, async (request) => {
    TestLogger.debug(
      `Running dataset query ${request.queryName} on dataset ${request.datasetName} with params ${request.params}`,
    )
    if (request.queryName === 'datasetDateRange') {
      return [
        {
          start: '2024-01-01',
          end: '2025-02-28',
        },
      ]
    }

    if (request.queryName === 'getAllRates') {
      const rates = await MockCloudService.getHistoricCurrencyRates({
        base: 'USD',
        currency: request.params?.[0],
        startDate: '2025-03-01',
        endDate: '2025-03-31',
      })
      const mappedRates = Object.entries(rates.rates).map(([date, rate]) => ({ date, rate }))
      return mappedRates
    }

    return []
  })
  mockRegisterTypedAppCommand(AppCommandIds.LIST_TRANSACTIONS, async (request) => {
    TestLogger.debug('Listing transactions', request)
    const mockTracksactions = transactions.map((transaction) => ({
      ...transaction,
      date: new Date('2025-03-02'),
      currency_code: 'EUR',
      requires_sync: true,
    }))
    return mockTracksactions
  })
  mockRegisterTypedAppCommand(AppCommandIds.SAVE_TRANSACTIONS, async (request) => {
    TestLogger.debug('Saving transactions', JSON.stringify(request, null, 2))
    // Check all transactions have requires_sync set to false
    if (request.some((transaction) => transaction.requires_sync)) {
      TestLogger.error('Transactions have requires_sync set to true')
      throw new Error('Transactions have requires_sync set to true')
    }
    return []
  })
  // Depends on CloudService Commands to make requests to Cloud API
  registerCommands([MockCloudService])
})

/**
 * Tests
 */

describe('SyncService', () => {
  test('test sync', async () => {
    // Test Getting all Tags in DB
    const syncSunmary = await SyncService.sync()
    expect(syncSunmary).toBeDefined()
    if (!syncSunmary.completed) {
      TestLogger.error(`Sync Error: ${syncSunmary.errorMessage}`)
    }
    expect(syncSunmary.completed).toBe(true)
  })
})
