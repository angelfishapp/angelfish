/**
 * Tests for all the ImportService Methods
 */

import type { IAccount } from '@angelfish/core'
import { AppCommandIds } from '@angelfish/core'
import {
  TEST_FILE_DIR,
  accounts,
  getLongTransactions,
  mockRegisterTypedAppCommand,
} from '@angelfish/tests'

import { ImportService } from '.'

/**
 * Initialise in-memory SQLIte Database for use during tests
 */
beforeAll(async () => {
  mockRegisterTypedAppCommand(AppCommandIds.GET_ACCOUNT, async ({ id }) => {
    return accounts.find((account) => account.id === id) as IAccount
  })
  mockRegisterTypedAppCommand(AppCommandIds.LIST_TRANSACTIONS, async ({ account_id }) => {
    if (account_id === 125) {
      return getLongTransactions()
    }
    return []
  })
})

/**
 * Make sure we close Database connection at end of tests
 */
afterAll(async () => {})

/**
 * Tests
 */

describe('ImportService', () => {
  test('test import OFX file', async () => {
    const reconciledTransactions = await ImportService.readTransactionsFile({
      filePath: TEST_FILE_DIR + '/creditcard.ofx',
      mapper: {
        fileType: 'ofx',
        defaultAccountId: 125,
      },
    })
    expect(reconciledTransactions.length).toBe(35)
  })

  test('test import QFX file', async () => {
    const reconciledTransactions = await ImportService.readTransactionsFile({
      filePath: TEST_FILE_DIR + '/bankaccount.qfx',
      mapper: {
        fileType: 'qfx',
        defaultAccountId: 125,
      },
    })

    expect(reconciledTransactions.length).toBe(8)
  })

  test('test import QIF file', async () => {
    const reconciledTransactions = await ImportService.readTransactionsFile({
      filePath: TEST_FILE_DIR + '/statement1_us.qif',
      mapper: {
        fileType: 'qif',
        defaultAccountId: 125,
      },
    })

    expect(reconciledTransactions.length).toBe(52)
  })

  test('test import multi-account QIF file', async () => {
    const filePath = TEST_FILE_DIR + '/banktivity_export.qif'

    // Test reading mapping
    const fileMappings = await ImportService.readFileMappings({ filePath })
    expect(fileMappings).toEqual({
      fileType: 'qif',
      categories: [
        'Bank Charges:Interest Paid',
        'Bank Charges:Service Charges',
        'Car Expenses',
        'Car:Purchase',
        'Food:Dining Out',
        'Home:Rent',
        'Investment Income:Interest',
        'Leisure & Entertainment:Movie Rentals',
        'Taxes:Income Tax',
        'Wages & Salary:Gross Pay',
        '[Acme Bank Checking]',
        '[Acme Joint Savings]',
        '[Acme Personal Checking]',
        '[Checking Account]',
        '[Savings Account]',
      ],
      accounts: [
        { id: '1', name: 'Checking Account' },
        { id: '2', name: 'Savings Account' },
      ],
    })

    const reconciledTransactions = await ImportService.readTransactionsFile({
      filePath,
      mapper: {
        fileType: 'qif',
        defaultAccountId: 125,
        accountsMapper: { '1': 125, '2': 126 },
        categoriesMapper: {
          'Bank Charges:Service Charges': 2,
          'Food:Dining Out': 66,
          'Home:Rent': 11,
          'Investment Income:Interest': 107,
          'Leisure & Entertainment:Movie Rentals': 50,
          'Taxes:Income Tax': 94,
          'Wages & Salary:Gross Pay': 119,
          '[Acme Bank Checking]': 122,
          '[Acme Joint Savings]': 124,
          '[Savings Account]': 123,
        },
      },
    })

    expect(reconciledTransactions.length).toBe(61)
  })

  test('test import CSV file', async () => {
    const filePath = TEST_FILE_DIR + '/statement.csv'

    // Test reading headers
    const fileMappings = await ImportService.readFileMappings({ filePath })
    expect(fileMappings).toEqual({
      fileType: 'csv',
      csvHeaders: [
        {
          header: 'Details',
          samples: ['DEBIT', 'DEBIT', 'DEBIT', 'DEBIT', 'DEBIT'],
        },
        {
          header: 'Posting Date',
          samples: ['8/21/23', '8/21/23', '8/21/23', '8/21/23', '8/21/23'],
        },
        {
          header: 'Description',
          samples: ['PayPal', 'Uber', 'CHASE CREDIT CRD AUTOPAY', 'ATM WITHDRAWAL', 'Macdonalds'],
        },
        {
          header: 'Amount',
          samples: ['-1400', '-22.7', '-2332.34', '-330', '-88.12'],
        },
        {
          header: 'Type',
          samples: ['ACH_DEBIT', 'DEBIT_CARD', 'ACH_DEBIT', 'ATM', 'ACH_DEBIT'],
        },
        {
          header: 'Balance',
          samples: ['12859.3', '14259.3', '14282', '16614.34', '16944.34'],
        },
        {
          header: 'Check or Slip #',
          samples: ['', '', '', '', ''],
        },
      ],
    })

    const reconciledTransactions = await ImportService.readTransactionsFile({
      filePath,
      mapper: {
        fileType: 'csv',
        defaultAccountId: 125,
        csvMapper: {
          fields: {
            date: 'Posting Date',
            amount: 'Amount',
            name: 'Description',
            check_number: 'Check or Slip #',
          },
          settings: {
            csv_delimiter: ',',
            date_format: 'MM DD YY',
          },
        },
      },
    })

    expect(reconciledTransactions.length).toBe(39)
  })
})
