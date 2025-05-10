import type { JSONSchemaType } from 'ajv'

import { getCurrencyCodes } from '@angelfish/core'
import type { CurrencyRate } from './currencies'

export const CurrenciesSchema: JSONSchemaType<CurrencyRate> = {
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
}
