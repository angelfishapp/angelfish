/**
 * Tests for all the TransactionService Methods
 */

import type { IAccount, ITag, ITransactionUpdate } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import {
  AccountEntity,
  InstitutionEntity,
  LineItemEntity,
  TransactionEntity,
  UserEntity,
} from '../../database/entities'

import { institutions, TestLogger, users } from '@angelfish/tests'

import { TransactionService } from '.'

// Keep reference to test bank account created in setup
let newAccount: IAccount | null = null

/**
 * Initialise in-memory SQLIte Database for use during tests
 */
beforeAll(async () => {
  await DatabaseManager.initConnection(':memory:')
  // Need to setup database with User, Instutition and Account to import Transactions
  // Do this directly on database without using services to isolate tests from bugs in other
  // service
  const userRepo = DatabaseManager.getConnection().getRepository(UserEntity)
  await userRepo.save(users)
  const institutionRepo = DatabaseManager.getConnection().getRepository(InstitutionEntity)
  await institutionRepo.save(institutions)
  const accountRepo = DatabaseManager.getConnection().getRepository(AccountEntity)
  newAccount = await accountRepo.save({
    class: 'ACCOUNT',
    name: 'Checking Account',
    acc_institution_id: 1,
    acc_owners: [users[0]],
    acc_mask: '2033',
    acc_type: 'depository',
    acc_subtype: 'checking',
    acc_iso_currency: 'usd',
    acc_start_balance: 0,
    acc_interest_rate: 0,
    acc_limit: 0,
    acc_is_open: true,
  })
})

/**
 * Make sure we close Database connection at end of tests
 */
afterAll(async () => {
  await DatabaseManager.close()
})

/**
 * Helper Functions
 */

async function getAllLineItems() {
  const lineItemRepo = DatabaseManager.getConnection().getRepository(LineItemEntity)
  return await lineItemRepo.find()
}

/**
 * Tests
 */

describe('TransactionService', () => {
  test('test get-transactions-date-range empty database', async () => {
    const response = await TransactionService.getTransactionsDateRange()
    expect(response.start_date).toEqual(null)
    expect(response.end_date).toEqual(null)
  })

  test('test save-transaction', async () => {
    const transaction = {
      account_id: newAccount?.id,
      title: 'Test Transaction',
      amount: -10.01,
      date: new Date(),
      currency_code: 'USD',
    } as ITransactionUpdate

    // Create Transaction
    TestLogger.log('Creating Transaction...')
    const response = await TransactionService.saveTransactions([transaction])
    TestLogger.debug('Saved Transaction', response)
    expect(response.length).toEqual(1)
    expect(response[0].id).toBeDefined()
    expect(response[0].line_items.length).toEqual(1)

    // Update Transaction
    TestLogger.log('Updating Transaction...')
    response[0].title = 'Updated Test Transaction'
    const updatedTransaction = await TransactionService.saveTransactions(response)
    expect(response.length).toEqual(1)
    expect(response[0].id).toBeDefined()
    expect(updatedTransaction[0].line_items.length).toEqual(1)
    expect(updatedTransaction[0].title).toBe('Updated Test Transaction')

    // Get Transaction
    const getResponse = await TransactionService.getTransaction({ id: updatedTransaction[0].id })
    expect(updatedTransaction[0].id).toEqual(getResponse?.id)
  })

  test('test ERRORS for save-transaction', async () => {
    // Get Transaction
    TestLogger.log('Running ERRORS tests...')
    const errorTransaction = {
      account_id: newAccount?.id,
      amount: -10,
      title: 'Error Transaction',
      date: new Date(),
      currency_code: 'USD',
      requires_sync: false,
      line_items: [
        {
          amount: -9, // Invalid amount, should be -10 like Transaction
          local_amount: -9,
        },
        {
          amount: 9,
          local_amount: 9,
        },
      ],
    } as ITransactionUpdate

    // Test Bank Account Line Item amount is invalid
    await expect(TransactionService.saveTransactions([errorTransaction])).rejects.toThrow(
      'Cannot save TransactionEntity as it failed validation',
    )

    // Test Sum of Line Items is not 0
    errorTransaction.line_items[1].amount = 5
    errorTransaction.line_items[1].local_amount = 5
    await expect(TransactionService.saveTransactions([errorTransaction])).rejects.toThrow(
      'Cannot save TransactionEntity as it failed validation',
    )
  })

  test('test SPLIT for save-transaction', async () => {
    // Update transaction to split transaction and ensure old line items are cleaned up

    // Get Transaction
    const transaction = (await TransactionService.getTransaction({ id: 1 })) as TransactionEntity
    expect(transaction).toBeDefined()
    expect(transaction.amount).toEqual(-10.01)

    // Check only 2 line items in Database
    let lineItems = await getAllLineItems()
    TestLogger.log('line_items before SPLIT:', lineItems)
    expect(lineItems.length).toEqual(1)

    const splitLineItem1 = new LineItemEntity()
    splitLineItem1.account_id = 3
    splitLineItem1.amount = -5.0
    splitLineItem1.local_amount = -5.0
    const splitLineItem2 = new LineItemEntity()
    splitLineItem2.account_id = 4
    splitLineItem2.amount = -5.01
    splitLineItem2.local_amount = -5.01

    transaction.line_items = []
    transaction.line_items = [splitLineItem1, splitLineItem2]
    await TransactionService.saveTransactions([transaction])

    // Check only 3 line items in Database
    lineItems = await getAllLineItems()
    TestLogger.log('line_items after SPLIT:', lineItems)
    expect(lineItems.length).toEqual(2)
  })

  test('test save-array', async () => {
    // Add 10 Transactions
    const transactions: TransactionEntity[] = []
    for (let i = 0; i < 10; i++) {
      const transaction = new TransactionEntity()
      transaction.title = `Transaction ${i}`
      transaction.amount = 1 + i
      transaction.account_id = newAccount?.id as number
      transaction.currency_code = 'USD'
      transactions.push(transaction)
    }

    await TransactionService.saveTransactions(transactions)
    const list = await TransactionService.listTransactions({ account_id: newAccount?.id })
    expect(list.length).toEqual(11)
    const lineItems = await getAllLineItems()
    expect(lineItems.length).toEqual(12)
  })

  test('test list-transactions', async () => {
    // Test Getting all Transactions for Account in DB
    const response = await TransactionService.listTransactions({ account_id: newAccount?.id })
    expect(response.length).toEqual(11)

    // Test Getting all Transactions for Category in DB
    const categoryResponse = await TransactionService.listTransactions({ cat_id: 3 })
    expect(categoryResponse.length).toEqual(1)
    // Make sure all line items are returned for transaction
    expect(categoryResponse[0].line_items.length).toEqual(2)

    // TODO - Add more tests for dates and category group
  })

  test('test get-transaction', async () => {
    // Test Getting a single transaction
    const transaction = await TransactionService.getTransaction({ id: 1 })
    expect(transaction).toBeDefined()
    expect(transaction?.id).toEqual(1)
  })

  test('test get-transactions-date-range with data', async () => {
    const response = await TransactionService.getTransactionsDateRange()
    TestLogger.info('getTransactionsDateRange', response)
    expect(response.start_date).toBeDefined()
    expect(response.end_date).toBeDefined()
  })

  test('test delete-transaction', async () => {
    await TransactionService.deleteTransaction({ id: 1 })

    // Check counts of each table has decreased
    const list = await TransactionService.listTransactions({ account_id: newAccount?.id })
    expect(list.length).toEqual(10)
    const lineItems = await getAllLineItems()
    expect(lineItems.length).toEqual(10)
  })

  test('test line_item_tags relations', async () => {
    TestLogger.log('Running line_item_tags relations tests...')
    // Create new transaction
    const newTransaction = {
      account_id: newAccount?.id as number,
      title: 'Test Line Item Transaction',
      amount: -10.01,
      date: new Date(),
      currency_code: 'USD',
    } as ITransactionUpdate
    const transactions = await TransactionService.saveTransactions([newTransaction])
    expect(transactions.length).toEqual(1)

    // Add Tag to line item
    const tag = {
      name: 'Test',
    } as ITag
    transactions[0].line_items[0].tags = [tag]
    const taggedTransactions = await TransactionService.saveTransactions(transactions)
    // Make sure join table has 1 row
    let count = await DatabaseManager.getConnection().query('SELECT COUNT(*) FROM line_item_tags')
    expect(count[0]['COUNT(*)']).toEqual(1)

    // Remove the new Tag from line item
    taggedTransactions[0].line_items[0].tags = []
    const updatedTaggedTransactions = await TransactionService.saveTransactions(taggedTransactions)
    // Make sure join table has no rows
    count = await DatabaseManager.getConnection().query('SELECT COUNT(*) FROM line_item_tags')
    expect(count[0]['COUNT(*)']).toEqual(0)

    // Add another tag
    updatedTaggedTransactions[0].line_items[0].tags = [tag]
    await TransactionService.saveTransactions(updatedTaggedTransactions)
    // Make sure join table has 1 row
    count = await DatabaseManager.getConnection().query('SELECT COUNT(*) FROM line_item_tags')
    expect(count[0]['COUNT(*)']).toEqual(1)

    // Finally delete transaction and ensure all entries are removed
    // from join table
    await TransactionService.deleteTransaction({ id: transactions[0].id })
    // Make sure join table has 0 row
    count = await DatabaseManager.getConnection().query('SELECT COUNT(*) FROM line_item_tags')
    expect(count[0]['COUNT(*)']).toEqual(0)
  })

  /**
   * Run last or other tests will fail as no Institution relation
   */
  test('test cascade-delete institution', async () => {
    // Delete institution and check that all child entities including
    // Accounts, Transactions & LineItems are deleted automatically too
    await DatabaseManager.getConnection().getRepository(InstitutionEntity).delete(1)

    const account = await DatabaseManager.getConnection()
      .getRepository(AccountEntity)
      .findOne({ where: { id: newAccount?.id } })
    expect(account).toBeNull()
    const list = await TransactionService.listTransactions({ account_id: newAccount?.id })
    expect(list.length).toEqual(0)
    const lineItems = await getAllLineItems()
    expect(lineItems.length).toEqual(0)
  })
})
