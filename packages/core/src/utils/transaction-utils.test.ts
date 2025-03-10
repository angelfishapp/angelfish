import type { ITag, ITransaction } from '../types'
import {
  createNewTransaction,
  getTransactionCategory,
  splitTransaction,
  updateTransaction,
} from './transaction-utils'

describe('test transactions.utils', () => {
  /**
   * createNewTransaction() Tests
   */
  describe('test createNewTransaction()', () => {
    it('should create new transaction with default values', () => {
      const transaction = createNewTransaction(1, {
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
      })
      expect(transaction.date).toBeInstanceOf(Date)
      expect(transaction.account_id).toEqual(1)
      expect(transaction.title).toEqual('Test Transaction')
      expect(transaction.amount).toEqual(100)
      expect(transaction.currency_code).toEqual('USD')
      expect(transaction.requires_sync).toEqual(true)
      expect(transaction.pending).toEqual(false)
      expect(transaction.is_reviewed).toEqual(false)
      expect(transaction.line_items.length).toEqual(2)
      expect(transaction.line_items[0].account_id).toEqual(1)
      expect(transaction.line_items[0].amount).toEqual(100)
      expect(transaction.line_items[0].local_amount).toEqual(100)
      expect(transaction.line_items[0].note).toBeUndefined()
      expect(transaction.line_items[0].tags).toBeUndefined()
      expect(transaction.line_items[1].account_id).toEqual(2)
      expect(transaction.line_items[1].amount).toEqual(-100)
      expect(transaction.line_items[1].local_amount).toEqual(-100)
      expect(transaction.line_items[1].note).toBeUndefined()
    })
    it('should update all properties if given', () => {
      const date = new Date(2020, 1, 1)
      const transaction = createNewTransaction(1, {
        date,
        title: 'Test',
        amount: 100,
        currency_code: 'GBP',
        currency_exchange_rate: 0.5,
        requires_sync: false,
        pending: true,
        is_reviewed: true,
        category_id: 2,
        note: 'Note',
        add_tags: [{ name: 'Test' }],
      })
      expect(transaction.date).toEqual(date)
      expect(transaction.account_id).toEqual(1)
      expect(transaction.title).toEqual('Test')
      expect(transaction.amount).toEqual(100)
      expect(transaction.currency_code).toEqual('GBP')
      expect(transaction.requires_sync).toEqual(false)
      expect(transaction.pending).toEqual(true)
      expect(transaction.is_reviewed).toEqual(true)
      expect(transaction.line_items.length).toEqual(2)
      expect(transaction.line_items[0].account_id).toEqual(1)
      expect(transaction.line_items[0].amount).toEqual(100)
      expect(transaction.line_items[0].local_amount).toEqual(200)
      expect(transaction.line_items[0].note).toBeUndefined()
      expect(transaction.line_items[0].tags).toBeUndefined()
      expect(transaction.line_items[1].account_id).toEqual(2)
      expect(transaction.line_items[1].amount).toEqual(-100)
      expect(transaction.line_items[1].local_amount).toEqual(-200)
      expect(transaction.line_items[1].note).toEqual('Note')
      expect(transaction.line_items[1].tags).toEqual([{ name: 'Test' }])
    })
  })

  /**
   * updateTransactions() Tests
   */
  describe('test updateTransactions()', () => {
    it('should update all properties if given', () => {
      let transaction = createNewTransaction(1, {
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'GBP',
      })
      const date = new Date(2020, 1, 1)
      transaction = updateTransaction(transaction, {
        date,
        title: 'Test',
        amount: 1000,
        currency_exchange_rate: 0.5,
        requires_sync: false,
        pending: true,
        is_reviewed: true,
        category_id: 3,
        note: 'Note',
        add_tags: [{ name: 'Test' }],
      })
      expect(transaction.account_id).toEqual(1)
      expect(transaction.date).toEqual(date)
      expect(transaction.title).toEqual('Test')
      expect(transaction.amount).toEqual(1000)
      expect(transaction.currency_code).toEqual('GBP')
      expect(transaction.requires_sync).toEqual(false)
      expect(transaction.pending).toEqual(true)
      expect(transaction.is_reviewed).toEqual(true)
      expect(transaction.line_items.length).toEqual(2)
      expect(transaction.line_items[0].account_id).toEqual(1)
      expect(transaction.line_items[0].amount).toEqual(1000)
      expect(transaction.line_items[0].local_amount).toEqual(2000)
      expect(transaction.line_items[0].note).toBeUndefined()
      expect(transaction.line_items[0].tags).toBeUndefined()
      expect(transaction.line_items[1].account_id).toEqual(3)
      expect(transaction.line_items[1].amount).toEqual(-1000)
      expect(transaction.line_items[1].local_amount).toEqual(-2000)
      expect(transaction.line_items[1].note).toEqual('Note')
      expect(transaction.line_items[1].tags).toEqual([{ name: 'Test' }])
    })

    it('should update local amounts if exchange rate given', () => {
      let transaction = createNewTransaction(1, {
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'GBP',
      })
      expect(transaction.amount).toEqual(100)
      expect(transaction.requires_sync).toEqual(true)
      expect(transaction.line_items[0].local_amount).toEqual(100)
      expect(transaction.line_items[1].local_amount).toEqual(-100)
      transaction = updateTransaction(transaction, {
        currency_exchange_rate: 0.5,
        requires_sync: false,
      })
      expect(transaction.amount).toEqual(100)
      expect(transaction.requires_sync).toEqual(false)
      expect(transaction.line_items[0].local_amount).toEqual(200)
      expect(transaction.line_items[1].local_amount).toEqual(-200)
    })

    it('should update only category and amount if given', () => {
      let transaction = createNewTransaction(1, {
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'GBP',
        currency_exchange_rate: 0.8052,
      })
      transaction = updateTransaction(transaction, {
        amount: 1000,
        category_id: 3,
      })
      expect(transaction.account_id).toEqual(1)
      expect(transaction.title).toEqual('Test Transaction')
      expect(transaction.amount).toEqual(1000)
      expect(transaction.currency_code).toEqual('GBP')
      expect(transaction.line_items.length).toEqual(2)
      expect(transaction.line_items[0].account_id).toEqual(1)
      expect(transaction.line_items[0].amount).toEqual(1000)
      expect(transaction.line_items[0].local_amount).toEqual(805.22)
      expect(transaction.line_items[1].account_id).toEqual(3)
      expect(transaction.line_items[1].amount).toEqual(-1000)
      expect(transaction.line_items[1].local_amount).toEqual(-805.22)
      expect(transaction.line_items[1].note).toEqual(undefined)
      expect(transaction.line_items[1].tags).toEqual([])
    })

    it('should update tags if tag properties set', () => {
      const tag: ITag = { id: 1, name: 'Test', created_on: new Date(), modified_on: new Date() }
      let transaction = createNewTransaction(1, {
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
        overwrite_tags: [tag],
      })
      expect(transaction.line_items[1].tags).toEqual([tag])

      // Add another tag
      const tag2 = { id: 2, name: 'Test 2', createdOn: new Date() }
      transaction = updateTransaction(transaction, {
        add_tags: [tag2],
      })
      expect(transaction.line_items[1].tags?.length).toEqual(2)
      expect(transaction.line_items[1].tags).toEqual([tag, tag2])

      // Remove tag
      transaction = updateTransaction(transaction, {
        remove_tags: [tag],
      })
      expect(transaction.line_items[1].tags?.length).toEqual(1)
      expect(transaction.line_items[1].tags).toEqual([tag2])

      // Overwrite tags
      const tag3 = { id: 3, name: 'Test 3', createdOn: new Date() }
      transaction = updateTransaction(transaction, {
        overwrite_tags: [tag3],
      })
      expect(transaction.line_items[1].tags?.length).toEqual(1)
      expect(transaction.line_items[1].tags).toEqual([tag3])
    })

    it('should remove category if null', () => {
      let transaction = createNewTransaction(1, {
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
      })
      expect(transaction.line_items[1].account_id).toEqual(2)
      transaction = updateTransaction(transaction, {
        category_id: null,
      })
      expect(transaction.line_items[1].account_id).toEqual(undefined)
    })

    it('should update ISO currency', () => {
      let transaction = createNewTransaction(1, {
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
        requires_sync: false,
      })
      expect(transaction.currency_code).toEqual('USD')
      expect(transaction.requires_sync).toEqual(false)
      transaction = updateTransaction(transaction, {
        currency_code: 'CAD',
      })
      expect(transaction.currency_code).toEqual('CAD')
      expect(transaction.requires_sync).toEqual(true)
    })
  })

  /**
   * splitTransaction() Tests
   */
  describe('test splitTransaction()', () => {
    it('should split a transaction into 3 categories', () => {
      let transaction = createNewTransaction(1, {
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
      })
      transaction = splitTransaction(transaction, [
        { category_id: 3, amount: 50 },
        { category_id: 4, amount: 30 },
        { category_id: 5, amount: 20 },
      ])
      expect(transaction.account_id).toEqual(1)
      expect(transaction.title).toEqual('Test Transaction')
      expect(transaction.amount).toEqual(100)
      expect(transaction.line_items.length).toEqual(4)
      expect(transaction.line_items[0].account_id).toEqual(1)
      expect(transaction.line_items[0].amount).toEqual(100)
      expect(transaction.line_items[1].account_id).toEqual(3)
      expect(transaction.line_items[1].amount).toEqual(-50)
      expect(transaction.line_items[2].account_id).toEqual(4)
      expect(transaction.line_items[2].amount).toEqual(-30)
      expect(transaction.line_items[3].account_id).toEqual(5)
      expect(transaction.line_items[3].amount).toEqual(-20)
    })

    it('should throw error if splits dont add up', () => {
      const transaction = createNewTransaction(1, {
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
      })
      expect(() =>
        splitTransaction(transaction, [
          { category_id: 3, amount: 50 },
          { category_id: 4, amount: 30 },
          { category_id: 5, amount: 30 },
        ]),
      ).toThrowError('Split amounts must add up to transaction amount')
    })

    it('should update all properties if given', () => {
      let transaction = createNewTransaction(1, {
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
      })
      transaction = splitTransaction(
        transaction,
        [
          { category_id: 3, amount: 500 },
          { category_id: 4, amount: 300 },
          { category_id: 5, amount: 200 },
        ],
        {
          date: new Date(2020, 1, 1),
          title: 'Test',
          amount: 1000,
        },
      )
      expect(transaction.account_id).toEqual(1)
      expect(transaction.date).toEqual(new Date(2020, 1, 1))
      expect(transaction.title).toEqual('Test')
      expect(transaction.amount).toEqual(1000)
      expect(transaction.line_items.length).toEqual(4)
      expect(transaction.line_items[0].amount).toEqual(1000)
      expect(transaction.line_items[1].amount).toEqual(-500)
      expect(transaction.line_items[2].amount).toEqual(-300)
      expect(transaction.line_items[3].amount).toEqual(-200)
    })

    it('should update split line items', () => {
      let transaction = createNewTransaction(1, {
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
      })
      transaction = splitTransaction(transaction, [
        { id: 2, category_id: 3, amount: 50 },
        { id: 3, category_id: 4, amount: 30 },
        { id: 4, category_id: 5, amount: 20 },
      ])
      expect(transaction.account_id).toEqual(1)
      expect(transaction.amount).toEqual(100)
      expect(transaction.line_items.length).toEqual(4)
      expect(transaction.line_items[0].amount).toEqual(100)
      expect(transaction.line_items[1].amount).toEqual(-50)
      expect(transaction.line_items[2].amount).toEqual(-30)
      expect(transaction.line_items[3].amount).toEqual(-20)

      // Update line items
      transaction = splitTransaction(transaction, [
        { id: 2, category_id: 3, amount: 50 },
        { id: 3, category_id: 4, amount: 50, note: 'Note', tags: [{ name: 'Test' }] },
      ])
      expect(transaction.account_id).toEqual(1)
      expect(transaction.amount).toEqual(100)
      expect(transaction.line_items.length).toEqual(3)
      expect(transaction.line_items[0].amount).toEqual(100)
      expect(transaction.line_items[1].amount).toEqual(-50)
      expect(transaction.line_items[2].amount).toEqual(-50)
    })
  })

  /**
   * getTransactionCategory() Tests
   */
  describe('test getTransactionCategory()', () => {
    it('should return null if split', () => {
      let transaction = createNewTransaction(1, {
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
      })
      transaction = splitTransaction(transaction, [
        { id: 2, category_id: 3, amount: 50 },
        { id: 3, category_id: 4, amount: 30 },
        { id: 4, category_id: 5, amount: 20 },
      ])
      const category = getTransactionCategory(transaction as ITransaction)
      expect(category).toEqual(null)
    })

    it('should return category if not split', () => {
      const transaction = createNewTransaction(1, {
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
      })
      const category = getTransactionCategory(transaction as ITransaction)
      expect(category).toEqual(2)
    })

    it('should return null if not split', () => {
      const transaction = createNewTransaction(1, {
        title: 'Test Transaction',
        category_id: null,
        amount: 100,
        currency_code: 'USD',
      })
      const category = getTransactionCategory(transaction as ITransaction)
      expect(category).toEqual(null)
    })
  })
})
