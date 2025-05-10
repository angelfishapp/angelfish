import type { IBook } from '@angelfish/core'

/**
 * Default test book
 */
export const book: IBook = {
  id: 1,
  created_on: new Date('2021-08-13T18:02:40.000Z'),
  modified_on: new Date('2021-08-13T18:02:40.000Z'),
  name: 'Test Book',
  entity: 'HOUSEHOLD',
  country: 'US',
  default_currency: 'USD',
  logo: '',
}
