import { getCurrencyCodes } from '@angelfish/core'
import type { DatasetConfig } from './dataset-interface'

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
  schema: {
    type: 'object',
    properties: {
      date: {
        type: 'string',
        pattern: '^(LATEST|\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$', // Must be either 'LATEST' or date in YYYY-MM-DD Format
      },
      currency: {
        type: 'string',
        enum: getCurrencyCodes(), // Must be valid ISO 4217 currency code
      },
      rate: {
        type: 'number',
        minimum: 0, // Must be a positive number
      },
    },
    required: ['date', 'currency', 'rate'],
    additionalProperties: false,
  },
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
  },
} as DatasetConfig<CurrencyRate>
