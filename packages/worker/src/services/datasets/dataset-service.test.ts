import { TestLogger } from '@angelfish/tests'

import { DatasetService, InvalidDataError } from '.'
import type { CurrencyRate } from './currencies'
import { Currencies } from './currencies'

/**
 * Test Data
 */

const TEST_DATA: CurrencyRate[] = [
  { date: 'LATEST', currency: 'GBP', rate: 0.805 },
  { date: '2025-01-30', currency: 'GBP', rate: 0.805 },
  { date: '2025-01-29', currency: 'GBP', rate: 0.8028 },
  { date: '2025-01-28', currency: 'GBP', rate: 0.8038 },
  { date: '2025-01-27', currency: 'GBP', rate: 0.8032 },
  { date: '2025-01-26', currency: 'GBP', rate: 0.8026 },
  { date: '2025-01-25', currency: 'GBP', rate: 0.801 },
  { date: '2025-01-24', currency: 'GBP', rate: 0.8013 },
  { date: '2025-01-23', currency: 'GBP', rate: 0.8098 },
  { date: '2025-01-22', currency: 'GBP', rate: 0.8122 },
  { date: '2025-01-21', currency: 'GBP', rate: 0.8105 },
  { date: '2025-01-20', currency: 'GBP', rate: 0.8108 },
  { date: '2025-01-19', currency: 'GBP', rate: 0.8213 },
  { date: '2025-01-18', currency: 'GBP', rate: 0.8218 },
  { date: '2025-01-17', currency: 'GBP', rate: 0.8212 },
  { date: '2025-01-16', currency: 'GBP', rate: 0.8173 },
  { date: '2025-01-15', currency: 'GBP', rate: 0.8168 },
  { date: '2025-01-14', currency: 'GBP', rate: 0.8189 },
  { date: '2025-01-13', currency: 'GBP', rate: 0.8175 },
  { date: '2025-01-12', currency: 'GBP', rate: 0.8194 },
  { date: '2025-01-11', currency: 'GBP', rate: 0.8192 },
  { date: '2025-01-10', currency: 'GBP', rate: 0.8188 },
  { date: '2025-01-09', currency: 'GBP', rate: 0.8131 },
  { date: '2025-01-08', currency: 'GBP', rate: 0.8092 },
  { date: '2025-01-07', currency: 'GBP', rate: 0.8015 },
  { date: '2025-01-06', currency: 'GBP', rate: 0.7993 },
  { date: '2025-01-05', currency: 'GBP', rate: 0.8049 },
  { date: '2025-01-04', currency: 'GBP', rate: 0.805 },
  { date: '2025-01-03', currency: 'GBP', rate: 0.805 },
  { date: '2025-01-02', currency: 'GBP', rate: 0.8078 },
  { date: '2025-01-01', currency: 'GBP', rate: 0.7987 },
]

/**
 * Make sure we close Database connection at end of tests
 */
afterAll(async () => {
  await DatasetService.close()
})

/**
 * Tests
 */

describe('dataset.service', () => {
  test('test register currency dataset', async () => {
    await DatasetService.registerDataset(Currencies)
    const datasets = await DatasetService.listDatasets()
    expect(datasets).toContain(Currencies.name)
  })
  test('test register duplicate currency dataset', async () => {
    await expect(DatasetService.registerDataset(Currencies)).rejects.toThrow(
      'Dataset "currencies" already registered.',
    )
  })
  test('test insert data into currency dataset', async () => {
    try {
      await DatasetService.insertData({ datasetName: Currencies.name, rows: TEST_DATA })
    } catch (error: any) {
      if (error instanceof InvalidDataError) {
        TestLogger.error(error.message, error.getTarget(), error.getValidationErrors())
      } else {
        TestLogger.error(error)
      }
      throw error
    }
  })
  test('test saved query currency dataset', async () => {
    const allRows = await DatasetService.runSavedQuery({
      datasetName: Currencies.name,
      queryName: 'datasetDateRange',
      params: ['GBP'],
    })
    expect(allRows).toHaveLength(1)
    expect(allRows[0].start).toBe('2025-01-01')
    expect(allRows[0].end).toBe('2025-01-30')

    const latestRates = await DatasetService.runSavedQuery({
      datasetName: Currencies.name,
      queryName: 'latestRates',
    })
    expect(latestRates).toHaveLength(1)
    expect(latestRates[0].currency).toBe('GBP')
    expect(latestRates[0].rate).toBe(0.805)

    const allRates = await DatasetService.runSavedQuery({
      datasetName: Currencies.name,
      queryName: 'getAllRates',
      params: ['GBP'],
    })
    expect(allRates).toHaveLength(30)

    const dateRangeRates = await DatasetService.runSavedQuery({
      datasetName: Currencies.name,
      queryName: 'getDateRangeRates',
      params: ['GBP', '2025-01-01', '2025-01-10'],
    })
    expect(dateRangeRates).toHaveLength(10)
  })
  test('test delete currency dataset', async () => {
    await DatasetService.deleteDataset(Currencies.name)
    // Make sure dataset is deleted
    await expect(
      DatasetService.runSavedQuery({
        datasetName: Currencies.name,
        queryName: 'latestRates',
      }),
    ).rejects.toThrow('Dataset "currencies" not found.')
    const datasets = await DatasetService.listDatasets()
    expect(datasets).toHaveLength(0)
  })
})
