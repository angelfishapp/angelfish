import type { ITag, ITransaction } from '../../types'
import {
  createNewTransaction,
  duplicateTransaction,
  getTransactionCategory,
  updateTransaction,
} from './transaction-utils'

describe('test transactions.utils', () => {
  /**
   * createNewTransaction() Tests
   */
  describe('test createNewTransaction()', () => {
    it('should create new transaction with default values', () => {
      const transaction = createNewTransaction({
        account_id: 1,
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
      expect(transaction.line_items.length).toEqual(1)
      expect(transaction.line_items[0].account_id).toEqual(2)
      expect(transaction.line_items[0].amount).toEqual(100)
      expect(transaction.line_items[0].local_amount).toEqual(100)
      expect(transaction.line_items[0].note).toBeUndefined()
      expect(transaction.line_items[0].tags).toEqual([])
    })
    it('should update all properties if given', () => {
      const date = new Date(2020, 1, 1)
      const transaction = createNewTransaction({
        account_id: 1,
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
        tags: [{ name: 'Test' }],
      })
      expect(transaction.date).toEqual(date)
      expect(transaction.account_id).toEqual(1)
      expect(transaction.title).toEqual('Test')
      expect(transaction.amount).toEqual(100)
      expect(transaction.currency_code).toEqual('GBP')
      expect(transaction.requires_sync).toEqual(false)
      expect(transaction.pending).toEqual(true)
      expect(transaction.is_reviewed).toEqual(true)
      expect(transaction.line_items.length).toEqual(1)
      expect(transaction.line_items[0].account_id).toEqual(2)
      expect(transaction.line_items[0].amount).toEqual(100)
      expect(transaction.line_items[0].local_amount).toEqual(200)
      expect(transaction.line_items[0].note).toEqual('Note')
      expect(transaction.line_items[0].tags).toEqual([{ name: 'Test' }])
    })
  })

  /**
   * updateTransaction() Tests
   */
  describe('test updateTransaction()', () => {
    it('should update all properties if given', () => {
      let transaction = createNewTransaction({
        account_id: 1,
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
      expect(transaction.line_items.length).toEqual(1)
      expect(transaction.line_items[0].account_id).toEqual(3)
      expect(transaction.line_items[0].amount).toEqual(1000)
      expect(transaction.line_items[0].local_amount).toEqual(2000)
      expect(transaction.line_items[0].note).toEqual('Note')
      expect(transaction.line_items[0].tags).toEqual([{ name: 'Test' }])
    })

    it('should update local amounts if exchange rate given', () => {
      let transaction = createNewTransaction({
        account_id: 1,
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'GBP',
      })
      expect(transaction.amount).toEqual(100)
      expect(transaction.requires_sync).toEqual(true)
      expect(transaction.line_items[0].local_amount).toEqual(100)
      transaction = updateTransaction(transaction, {
        currency_exchange_rate: 0.5,
        requires_sync: false,
      })
      expect(transaction.amount).toEqual(100)
      expect(transaction.requires_sync).toEqual(false)
      expect(transaction.line_items[0].local_amount).toEqual(200)
    })

    it('should update only category and amount if given', () => {
      let transaction = createNewTransaction({
        account_id: 1,
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'GBP',
        currency_exchange_rate: 0.8052,
      })
      expect(transaction.line_items.length).toEqual(1)
      expect(transaction.line_items[0].amount).toEqual(100)
      expect(transaction.line_items[0].local_amount).toEqual(124.19)

      transaction = updateTransaction(transaction, {
        amount: 1000,
        category_id: 3,
      })
      expect(transaction.account_id).toEqual(1)
      expect(transaction.title).toEqual('Test Transaction')
      expect(transaction.amount).toEqual(1000)
      expect(transaction.currency_code).toEqual('GBP')
      expect(transaction.line_items.length).toEqual(1)
      expect(transaction.line_items[0].amount).toEqual(1000)
      expect(transaction.line_items[0].local_amount).toEqual(1241.9)
      expect(transaction.line_items[0].note).toBeUndefined()
      expect(transaction.line_items[0].tags).toEqual([])
    })

    it('should update tags if tag properties set', () => {
      const tag: ITag = { id: 1, name: 'Test', created_on: new Date(), modified_on: new Date() }
      let transaction = createNewTransaction({
        account_id: 1,
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
        tags: [tag],
      })
      expect(transaction.line_items[0].tags).toEqual([tag])

      // Add another tag
      const tag2 = { id: 2, name: 'Test 2', createdOn: new Date() }
      transaction = updateTransaction(transaction, {
        add_tags: [tag2],
      })
      expect(transaction.line_items[0].tags?.length).toEqual(2)
      expect(transaction.line_items[0].tags).toEqual([tag, tag2])

      // Remove tag
      transaction = updateTransaction(transaction, {
        remove_tags: [tag],
      })
      expect(transaction.line_items[0].tags?.length).toEqual(1)
      expect(transaction.line_items[0].tags).toEqual([tag2])

      // Overwrite tags
      const tag3 = { id: 3, name: 'Test 3', createdOn: new Date() }
      transaction = updateTransaction(transaction, {
        overwrite_tags: [tag3],
      })
      expect(transaction.line_items[0].tags?.length).toEqual(1)
      expect(transaction.line_items[0].tags).toEqual([tag3])
    })

    it('should remove category if null', () => {
      let transaction = createNewTransaction({
        account_id: 1,
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
      })
      expect(transaction.line_items[0].account_id).toEqual(2)
      transaction = updateTransaction(transaction, {
        category_id: null,
      })
      expect(transaction.line_items[0].account_id).toEqual(undefined)
    })

    it('should update ISO currency', () => {
      let transaction = createNewTransaction({
        account_id: 1,
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
   * split Transaction Tests
   */
  describe('test split Transactions', () => {
    it('should split a transaction into 3 categories', () => {
      let transaction = createNewTransaction({
        account_id: 1,
        title: 'Test Transaction',
        category_id: 2,
        amount: -100,
        currency_code: 'USD',
      })
      transaction = updateTransaction(transaction, {
        splits: [
          { account_id: 3, amount: -50 },
          { account_id: 4, amount: -30 },
          { account_id: 5, amount: -20 },
        ],
      })
      expect(transaction.account_id).toEqual(1)
      expect(transaction.title).toEqual('Test Transaction')
      expect(transaction.amount).toEqual(-100)
      expect(transaction.line_items.length).toEqual(3)
      expect(transaction.line_items[0].account_id).toEqual(3)
      expect(transaction.line_items[0].amount).toEqual(-50)
      expect(transaction.line_items[0].local_amount).toEqual(-50)
      expect(transaction.line_items[1].account_id).toEqual(4)
      expect(transaction.line_items[1].amount).toEqual(-30)
      expect(transaction.line_items[1].local_amount).toEqual(-30)
      expect(transaction.line_items[2].account_id).toEqual(5)
      expect(transaction.line_items[2].amount).toEqual(-20)
      expect(transaction.line_items[2].local_amount).toEqual(-20)
    })

    it('should throw error if splits dont add up', () => {
      const transaction = createNewTransaction({
        account_id: 1,
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
      })
      expect(() =>
        updateTransaction(transaction, {
          splits: [
            { account_id: 3, amount: 50 },
            { account_id: 4, amount: 30 },
            { account_id: 5, amount: 30 },
          ],
        }),
      ).toThrowError('Split amounts must add up to transaction amount: 100 !== 110')
    })

    it('should update all properties if given', () => {
      let transaction = createNewTransaction({
        account_id: 1,
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
      })
      transaction = updateTransaction(transaction, {
        date: new Date(2020, 1, 1),
        title: 'Test',
        amount: 1000,
        splits: [
          { account_id: 3, amount: 500 },
          { account_id: 4, amount: 300 },
          { account_id: 5, amount: 200 },
        ],
      })

      expect(transaction.account_id).toEqual(1)
      expect(transaction.date).toEqual(new Date(2020, 1, 1))
      expect(transaction.title).toEqual('Test')
      expect(transaction.amount).toEqual(1000)
      expect(transaction.line_items.length).toEqual(3)
      expect(transaction.line_items[0].amount).toEqual(500)
      expect(transaction.line_items[0].local_amount).toEqual(500)
      expect(transaction.line_items[0].account_id).toEqual(3)
      expect(transaction.line_items[1].amount).toEqual(300)
      expect(transaction.line_items[1].local_amount).toEqual(300)
      expect(transaction.line_items[1].account_id).toEqual(4)
      expect(transaction.line_items[2].amount).toEqual(200)
      expect(transaction.line_items[2].local_amount).toEqual(200)
      expect(transaction.line_items[2].account_id).toEqual(5)
    })

    it('should update split line items', () => {
      let transaction = createNewTransaction({
        account_id: 1,
        title: 'Test Transaction',
        category_id: 2,
        amount: -100,
        currency_code: 'GBP',
        currency_exchange_rate: 0.75,
      })
      expect(transaction.account_id).toEqual(1)
      expect(transaction.amount).toEqual(-100)
      expect(transaction.line_items.length).toEqual(1)
      expect(transaction.line_items[0].amount).toEqual(-100)
      expect(transaction.line_items[0].local_amount).toEqual(-133.33)

      transaction = updateTransaction(transaction, {
        splits: [
          { id: 1, account_id: 3, amount: -50 },
          { account_id: 4, amount: -30 },
          { account_id: 5, amount: -20 },
        ],
      })
      expect(transaction.account_id).toEqual(1)
      expect(transaction.amount).toEqual(-100)
      expect(transaction.line_items.length).toEqual(3)
      expect(transaction.line_items[0].amount).toEqual(-50)
      expect(transaction.line_items[0].local_amount).toEqual(-66.67)
      expect(transaction.line_items[1].amount).toEqual(-30)
      expect(transaction.line_items[1].local_amount).toEqual(-40)
      expect(transaction.line_items[2].amount).toEqual(-20)
      expect(transaction.line_items[2].local_amount).toEqual(-26.67)

      // Update line items
      transaction = updateTransaction(transaction, {
        splits: [
          { id: 1, account_id: 3, amount: -50 },
          { account_id: 4, amount: -50, note: 'Note', tags: [{ name: 'Test' }] },
        ],
      })
      expect(transaction.account_id).toEqual(1)
      expect(transaction.amount).toEqual(-100)
      expect(transaction.line_items.length).toEqual(2)
      expect(transaction.line_items[0].amount).toEqual(-50)
      expect(transaction.line_items[0].local_amount).toEqual(-66.67)
      expect(transaction.line_items[1].amount).toEqual(-50)
      expect(transaction.line_items[1].local_amount).toEqual(-66.67)
    })
  })

  /**
   * Test Duplicating Transactions
   */
  describe('test duplicateTransaction()', () => {
    it('should duplicate a transaction', () => {
      const transaction = createNewTransaction({
        account_id: 1,
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
      })
      // Set IDs to 1
      transaction.id = 1
      transaction.line_items[0].id = 1
      const duplicated = duplicateTransaction(transaction as ITransaction)
      expect(duplicated).toEqual({
        ...transaction,
        id: undefined,
        created_on: undefined,
        modified_on: undefined,
        is_reviewed: false,
        requires_sync: true,
        line_items: transaction.line_items.map((item) => ({
          ...item,
          id: undefined,
        })),
      })
    })
  })

  /**
   * getTransactionCategory() Tests
   */
  describe('test getTransactionCategory()', () => {
    it('should return null if split', () => {
      const transaction = createNewTransaction({
        account_id: 1,
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
      })
      transaction.line_items = [
        { id: 1, account_id: 3, amount: -50, local_amount: -50 },
        { account_id: 4, amount: -30, local_amount: -30 },
        { account_id: 5, amount: -20, local_amount: -20 },
      ]
      const category = getTransactionCategory(transaction as ITransaction)
      expect(category).toEqual(null)
    })

    it('should return category if not split', () => {
      const transaction = createNewTransaction({
        account_id: 1,
        title: 'Test Transaction',
        category_id: 2,
        amount: 100,
        currency_code: 'USD',
      })
      const category = getTransactionCategory(transaction as ITransaction)
      expect(category).toEqual(2)
    })

    it('should return null if not split', () => {
      const transaction = createNewTransaction({
        account_id: 1,
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
