import { validate } from 'class-validator'

import { LineItemEntity, TransactionEntity } from '.'

import { TestLogger } from '@angelfish/tests'

/**
 * Tests
 */

describe('TestValidation', () => {
  test('test TransactionEntity validation', async () => {
    // Create new Transaction
    const transaction = new TransactionEntity()
    transaction.account_id = 122
    transaction.title = 'Test Transaction'
    transaction.amount = -10.01
    transaction.date = new Date()
    transaction.created_on = new Date()
    transaction.modified_on = new Date()
    transaction.currency_code = 'USD'
    transaction.requires_sync = false

    let errors = await validate(transaction)
    expect(errors.length).toEqual(1)

    // Add line invalid items
    const unclassifiedLineItem = new LineItemEntity()
    unclassifiedLineItem.amount = -20.02
    transaction.line_items = [unclassifiedLineItem]

    errors = await validate(transaction)
    expect(errors.length).toEqual(1)
    expect(errors[0]?.constraints?.isLineItemTotalValid).toEqual(
      'line_items Split amounts must add up to transaction amount: -10.01 !== -20.02',
    )

    // Fix Account ID error
    transaction.line_items[0].account_id = transaction.account_id

    errors = await validate(transaction)
    expect(errors.length).toEqual(1)
    expect(errors[0]?.constraints?.isLineItemTotalValid).toEqual(
      'line_items Split amounts must add up to transaction amount: -10.01 !== -20.02',
    )

    // Fix amount error
    transaction.line_items[0].amount = transaction.amount

    errors = await validate(transaction)
    if (errors.length) {
      TestLogger.error('Unexpected Validation Errors', errors)
    }
    expect(errors.length).toEqual(0)
  })

  test('test getClassInstance', async () => {
    // Create new Transaction
    const transaction = new TransactionEntity()
    transaction.account_id = 122
    transaction.title = 'Test Transaction'
    transaction.amount = -10.01
    transaction.date = new Date()
    transaction.currency_code = 'USD'
    expect(transaction instanceof TransactionEntity).toEqual(true)

    // Copy to plain JS Object
    const copiedTransaction = { ...transaction }
    expect(copiedTransaction instanceof TransactionEntity).toEqual(false)

    // Convert to Class Instance
    const copiedTransaction2 = TransactionEntity.getClassInstance(copiedTransaction)
    expect(copiedTransaction2 instanceof TransactionEntity).toEqual(true)
  })
})
