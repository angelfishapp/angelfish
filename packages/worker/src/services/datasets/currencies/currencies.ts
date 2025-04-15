import type { ValidateFunction } from 'ajv'

import type { DatasetConfig } from '../dataset-interface'
import { CurrenciesSchema } from './currencies-schema'
import validate from './currencies-validation'

/**
 * Currency Exchange Rate Row
 */
export interface CurrencyRate {
  date: string
  currency: string
  rate: number
}

/**
 * Dataset configuration for Currency Exchange Rates
 */
export const Currencies = {
  name: 'currencies',
  schema: CurrenciesSchema,
  validate: validate as unknown as ValidateFunction<CurrencyRate>,
  primaryKey: ['date', 'currency'],
  savedQueries: {
    getAvailableCurrencies: 'SELECT DISTINCT currency FROM currencies',
    datasetDateRange:
      'SELECT MIN(date) as start, MAX(date) as end from currencies where currency == ? AND date != "LATEST"',
    latestRates: 'SELECT currency, rate FROM currencies WHERE date == "LATEST" GROUP BY currency',
    getAllRates:
      'SELECT date, rate FROM currencies WHERE currency == ? AND date != "LATEST" ORDER BY date ASC',
    getDateRangeRates:
      'SELECT date, rate FROM currencies WHERE currency == ? AND date >= ? AND date <= ? AND date != "LATEST" ORDER BY date ASC',
    dropCurrency: 'DELETE FROM currencies WHERE currency == ?',
  },
} as DatasetConfig<CurrencyRate>
