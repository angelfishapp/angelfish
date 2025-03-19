import type { ITransaction, ITransactionUpdate } from '@angelfish/core'
import { createNewTransaction } from '@angelfish/core'
import { getLongTransactions } from '@angelfish/tests'

import { ReconciliationHelper } from './reconciliation-helper'

// ReconciliationHelper to use during tests
let service: ReconciliationHelper

const longTransactions: ITransaction[] = getLongTransactions()

beforeAll(async () => {
  // Setup ReconciliationHelper with example transactions
  service = new ReconciliationHelper(longTransactions)
})

/**
 * Tests
 */

describe('ReconciliationHelper', () => {
  /**
   * match() Tests
   */
  describe('test match()', () => {
    it('test import_id match', async () => {
      const match = service.match(
        createNewTransaction(125, {
          date: new Date('2022-03-20'),
          title: 'Spotify #122121',
          import_id: '83DXMgpp3bTb6ZQwN9kKuXLAVOJ6gDHJEE7Xy',
          amount: -15.99,
          currency_code: 'USD',
        }) as ITransaction,
      )
      expect(match.length).toEqual(1)
      expect(match[0].id).toEqual(37)
    })

    it('test fuzzy date match', async () => {
      const testTransaction = longTransactions[57]
      const date = new Date(testTransaction.date)
      date.setDate(date.getDate() + 4)

      const match = service.match(
        createNewTransaction(125, {
          date,
          title: 'REI Store#1234455',
          amount: -216.89,
          currency_code: 'USD',
        }) as ITransaction,
      )
      expect(match.length).toEqual(1)
      expect(match[0].id).toEqual(57)
    })

    it('test multiple matches', async () => {
      const testTransaction = longTransactions[253]
      const date = new Date(testTransaction.date)
      date.setDate(date.getDate() + 4)

      const matches = service.match(
        createNewTransaction(125, {
          date,
          title: 'ACME AIRLINES',
          amount: -158.2,
          currency_code: 'USD',
        }) as ITransaction,
      )
      expect(matches.length).toEqual(4)
    })
  })

  /**
   * predictCategory() Tests
   */
  describe('test predictCategory()', () => {
    it('safeway', () => {
      const category = service.predictCategory(
        createNewTransaction(125, {
          title: 'SAFEWAY #12231',
          amount: 100,
          currency_code: 'USD',
        }) as ITransaction,
      )
      expect(category).toEqual(42)
    })

    it('starbucks', () => {
      const category = service.predictCategory(
        createNewTransaction(125, {
          title: 'STARBUCKS STORE 55555',
          amount: 100,
          currency_code: 'USD',
        }) as ITransaction,
      )
      expect(category).toEqual(44)
    })

    it('exxon', () => {
      const category = service.predictCategory(
        createNewTransaction(125, {
          title: 'EXXON MOBIL',
          amount: 100,
          currency_code: 'USD',
        }) as ITransaction,
      )
      expect(category).toEqual(25)
    })

    it('lyft', () => {
      const category = service.predictCategory(
        createNewTransaction(125, {
          title: 'LYFT   *2 RIDES 01-13',
          amount: 100,
          currency_code: 'USD',
        }) as ITransaction,
      )
      expect(category).toEqual(74)
    })

    it('bonito tacos', () => {
      const category = service.predictCategory(
        createNewTransaction(125, {
          title: 'BONITO TACOS',
          amount: 100,
          currency_code: 'USD',
        }) as ITransaction,
      )
      expect(category).toEqual(44)
    })

    it('bogus payee', () => {
      const category = service.predictCategory(
        createNewTransaction(125, {
          title: 'BOGUS PAYEE',
          amount: 100,
          currency_code: 'USD',
        }) as ITransaction,
      )
      expect(category).toEqual(null)
    })
  })

  /**
   * reconcile() Tests
   */
  describe('test reconciliation', () => {
    it('test mass reconciliation', async () => {
      // Get a subset of 'new' transactions to test
      const importTransactions = getMockImportTransactions()
      const transactions = importTransactions.concat(longTransactions)
      const reconciledTransactions = service.reconcile(transactions as ITransaction[])
      expect(reconciledTransactions.length).toEqual(755)
      expect(reconciledTransactions.filter((t) => t.reconciliation === 'new').length).toEqual(24)
      expect(reconciledTransactions.filter((t) => t.reconciliation === 'duplicate').length).toEqual(
        731,
      )
    })
  })
})

/**
 * Returns a list of uncategorized transactions for testing adjusted to the current
 * date. Useful for testing importing new transactions.
 */
function getMockImportTransactions(): ITransactionUpdate[] {
  // Get yesterday's date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  // Get date DESC sorted transactions
  const sortedTransactions = getLongTransactions()
    .slice(0, 27)
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  // Calculate the number of days between the last transaction date and yesterday
  const diff = Math.floor(
    (yesterday.getTime() - sortedTransactions[0].date.getTime()) / (1000 * 60 * 60 * 24),
  )

  // Update the date of each transaction and remove and IDs/categories
  const updatedTransactions: ITransactionUpdate[] = []
  for (const transaction of sortedTransactions) {
    const transDate = new Date(transaction.date)
    const updatedTransaction: ITransactionUpdate = {
      date: new Date(transDate.setDate(transDate.getDate() + diff)),
      account_id: transaction.account_id,
      title: transaction.title,
      amount: transaction.amount,
      currency_code: transaction.currency_code,
      pending: transaction.pending,
      line_items: transaction.line_items.map((lineItem) => {
        if (lineItem.account_id === transaction.account_id) {
          return {
            account_id: lineItem.account_id,
            amount: lineItem.amount,
            note: lineItem.note,
            tags: lineItem.tags,
          }
        }

        // Remove category from other line items
        return {
          amount: lineItem.amount,
          note: lineItem.note,
          tags: lineItem.tags,
        }
      }),
    }
    updatedTransactions.push(updatedTransaction)
  }

  // Return date sorted transactions
  return updatedTransactions
}
