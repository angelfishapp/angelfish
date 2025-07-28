/**
 * Provides Utility functions to manipulate and edit transactions
 */

import type { ILineItemUpdate, ITransaction, ITransactionUpdate } from '../../types'
import { roundNumber } from '../numbers'
import type {
  CreateTransactionProperties,
  UpdateTransactionProperties,
} from './transacation-utils-interface'

/**
 * Helper function to create a new transaction object. Will create a line item for the transaction with its category (or null for unclassified).
 * All parameters are optional apart from bank account transaction belongs to. If no parameters are provided, will create a transaction with default
 * values. Returns an Unsplit Transaction with 1 line item, which can them be modified to a Split Transaction by updating the line items.
 *
 * @param properties    Optional properties to set on the transaction
 *
 *                      Transaction Properties:
 *
 *                        - account_id                (Required) Set the bank account ID the transaction belongs to
 *                        - date                      If provided, sets date or defaults to current date
 *                        - title                     Sets the title of the Transaction
 *                        - amount                    If provided, sets amount or defaults to 0
 *                        - currency_code             Sets the ISO 8601 currency code for the Transaction
 *                        - currency_exchange_rate    If provided, sets currency exchange rate for local_amount, or defaults to 1
 *                        - requires_sync             If provided, sets requires_sync or defaults to true
 *                        - is_reviewed               If provided, sets is_reviewed or defaults to false
 *                        - pending                   If provided, sets pending or defaults to false
 *                        - import_id                 If provided, updates all transaction import_id to new import_id
 *
 *                      Line Item Properties:
 *
 *                        - category_id               If provided, sets category Account ID or defaults to null (Uncategorised)
 *                        - note                      If provided, sets note or defaults to empty string
 *                        - add_tags                  If provided, sets tags or defaults to empty array
 * @returns             A new unsplit Transaction
 */
export function createNewTransaction({
  account_id,
  date = new Date(),
  title = '',
  amount = 0,
  currency_code,
  currency_exchange_rate = 1,
  requires_sync = true,
  is_reviewed = false,
  pending = false,
  import_id,
  category_id,
  note,
  tags = [],
}: CreateTransactionProperties): ITransactionUpdate {
  if (!account_id) {
    throw new Error('Account ID is required to create a new transaction')
  }

  return {
    account_id,
    date,
    title,
    amount,
    currency_code,
    is_reviewed,
    requires_sync,
    pending,
    import_id,
    line_items: [
      {
        account_id: category_id || undefined,
        amount,
        local_amount: parseFloat((amount / currency_exchange_rate).toFixed(2)),
        note,
        tags,
      },
    ],
  }
}

/**
 * Update the properties of the transaction. Will throw an error if trying to update any Line Item properties on a Split Transaction.
 *
 * If you are updating the transaction amount on a Split Transaction, you must also update the line items to ensure the split amounts
 * add up to the Transaction amount or it will throw an error while updating the Transaction.
 *
 * @param transaction   The Transaction to edit
 * @param properties    Optional properties to set on the transaction:
 *
 *                      Transaction Properties:
 *
 *                        - date                      If provided, updates the transaction dates to new date
 *                        - title                     If provided, updates the transaction titles to new title
 *                        - amount                    If provided, updates the transaction amounts to new amount
 *                        - currency_code             If provided, updates the transactions currency_code to new currency_code
 *                        - currency_exchange_rate    If provided, updates the LineItem local_amount to new local_amount with the new currency exchange rate
 *                        - requires_sync             If provided, marks the Transaction for updating on next sync (true) or not (false)
 *                        - is_reviewed               If provided, updates the transaction is_reviewed to new is_reviewed
 *                        - pending                   If provided, sets pending field to new pending value
 *                        - import_id                 If provided, updates the Transactionsimport_id to new import_id. Note import_ids should be unique
 *
 *                      Line Item Properties:
 *
 *                        - category_id               If provided, updates the transaction category to new category ID, null is Uncategorised
 *                        - note                      If provided, updates the transaction note to new note, null will remove the note
 *                        - add_tags                  If provided, will merge new tags with existing tags to add them
 *                        - remove_tags               If provided, will remove tags from existing tags if set
 *                        - overwrite_tags            If provided, sets tags or defaults to empty array
 *
 * @returns             The updated Transaction
 * @throws              Error if trying to update category, notes or tags of a split transaction
 */
export function updateTransaction(
  transaction: ITransactionUpdate,
  {
    account_id,
    date,
    title,
    amount,
    currency_code,
    currency_exchange_rate,
    requires_sync,
    is_reviewed,
    pending,
    import_id,
    splits,
    category_id,
    note,
    add_tags,
    remove_tags,
    overwrite_tags,
  }: UpdateTransactionProperties,
): ITransactionUpdate {
  // If updating currency without a new exchange rate, mark transaction as requires_sync
  if (
    currency_code !== undefined &&
    currency_code !== transaction.currency_code &&
    currency_exchange_rate === undefined
  ) {
    requires_sync = true
  }

  const isSplit = isSplitTransaction(transaction as ITransaction) || splits !== undefined
  if (isSplit && (category_id || note || add_tags || remove_tags)) {
    throw new Error('Cannot update category, notes or tags of a split Transaction')
  }

  // Get the exchange rate for the transaction. If currency_exchange_rate isn't provided, we infer the exchange rate from the
  // transaction line items.
  const exchangeRate =
    currency_exchange_rate ||
    (() => {
      const totalAmount = roundNumber(
        transaction.line_items.reduce(
          (sum, li) => sum + Math.abs(li.local_amount ? li.amount : 0),
          0,
        ),
      )
      return totalAmount === 0
        ? 1
        : totalAmount /
            roundNumber(
              transaction.line_items.reduce((sum, li) => sum + Math.abs(li.local_amount ?? 0), 0),
            )
    })()

  // Update the line items for the transaction
  let line_items: ILineItemUpdate[] = splits
    ? splits.map((split) => {
        return {
          ...split,
          local_amount: roundNumber(split.amount / exchangeRate),
        }
      })
    : structuredClone(transaction.line_items)
  if (isSplit) {
    if (currency_exchange_rate) {
      // Update split transaction with new exchange rate
      line_items = line_items.map((lineItem) => {
        return {
          ...lineItem,
          local_amount: roundNumber(lineItem.amount / exchangeRate),
        }
      })
    }
  } else if (
    amount ||
    currency_exchange_rate ||
    category_id !== undefined ||
    note !== undefined ||
    add_tags ||
    remove_tags ||
    overwrite_tags
  ) {
    // Update unsplit transaction with new properties
    line_items = line_items.map((lineItem) => {
      const lineItemAmount = amount !== undefined ? amount : lineItem.amount
      // Update tags
      let tags = lineItem.tags || []
      if (overwrite_tags) {
        // Overwrite all tags to be same as overwrite_tags
        tags = overwrite_tags
      } else {
        // Merge new tags with existing tags or remove tags from existing tags if present
        tags = tags
          .filter((tag) => !remove_tags?.find((removeTag) => removeTag.id === tag.id))
          // Add only new tags that don't already exist
          .concat(
            (add_tags || []).filter(
              (addTag) => !tags.some((existingTag) => existingTag.id === addTag.id),
            ),
          )
      }
      return {
        ...lineItem,
        amount: lineItemAmount,
        account_id:
          category_id !== undefined
            ? category_id !== null
              ? category_id
              : null
            : lineItem.account_id,
        local_amount: roundNumber(lineItemAmount / exchangeRate),
        note: note !== undefined ? (note !== null ? note.trim() : null) : lineItem.note,
        tags,
      }
    })
  }
  // Check if line items are valid
  const isValid = validateLineItems(
    line_items,
    amount !== undefined ? amount : (transaction.amount ?? 0),
  )
  if (!isValid.valid) {
    throw new Error(isValid.message)
  }

  return {
    ...transaction,
    account_id: account_id !== undefined ? account_id : transaction.account_id,
    date: date !== undefined ? date : transaction.date,
    title: title !== undefined ? title : transaction.title,
    amount: amount !== undefined ? amount : transaction.amount,
    currency_code: currency_code !== undefined ? currency_code : transaction.currency_code,
    requires_sync: requires_sync !== undefined ? requires_sync : transaction.requires_sync,
    pending: pending !== undefined ? pending : transaction.pending,
    is_reviewed: is_reviewed !== undefined ? is_reviewed : transaction.is_reviewed,
    import_id: import_id !== undefined ? import_id : transaction.import_id,
    line_items,
  }
}

/**
 * Given an array of transactions, will update the properties of the transactions. Will throw an error if trying to update any Line Item properties on a Split Transaction.
 *
 * @param transactions  The Transactions to edit
 * @param properties    Optional properties to set on the transaction:
 *
 *                        - date                      If provided, updates all transaction dates to new date
 *                        - title                     If provided, updates all transaction titles to new title
 *                        - amount                    If provided, updates all transaction amounts to new amount
 *                        - currency_code             If provided, updates all transactions currency_code to new currency_code
 *                        - currency_exchange_rate    If provided, updates all LineItem local_amount to new local_amount with the new currency exchange rate
 *                        - requires_sync             If provided, marks the Transaction for updating on next sync (true) or not (false)
 *                        - is_reviewed               If provided, updates all transaction is_reviewed to new is_reviewed
 *                        - pending                   If provided, sets pending field to new pending value
 *                        - import_id                 If provided, updates all Transactions import_id to new import_id. Note import_ids should be unique so will only work if
 *                                                    updating one Transaction
 *
 *                        - category_id               If provided, updates all transaction categories to new category ID, null is Uncategorised
 *                        - note                      If provided, updates all transaction notes to new note, null will remove the note
 *                        - add_tags                  If provided, will merge new tags with existing tags to add them
 *                        - remove_tags               If provided, will remove tags from existing tags if set
 *                        - overwrite_tags            If provided, sets tags or defaults to empty array
 *
 * @returns             The updated Transactions
 * @throws              Error if trying to update category, notes or tags of a split transaction
 */
export function updateTransactions(
  transactions: ITransactionUpdate[],
  properties: UpdateTransactionProperties,
): ITransactionUpdate[] {
  return transactions.map((transaction) => {
    return updateTransaction(transaction, properties)
  })
}

/**
 * Creates a duplicate of the transaction. Will remove:
 *
 *   - all IDs from the transaction and line items so it can be saved as a new transaction
 *   - Any import_id from the transaction
 *   - Sets requires_sync to true to ensure any currency exchange rates are updated in next sync
 *   - Sets is_reviewed to false
 *   - Removes any created_on and modified_on dates
 *
 * @param transaction The transaction to duplicate
 * @returns           A new transaction object with no IDs
 */
export function duplicateTransaction(transaction: ITransaction): ITransactionUpdate {
  return {
    ...transaction,
    id: undefined,
    created_on: undefined,
    modified_on: undefined,
    import_id: undefined,
    is_reviewed: false,
    requires_sync: true,
    line_items: transaction.line_items.map((lineItem) => ({
      ...lineItem,
      id: undefined,
    })),
  }
}

/**
 * Check if a transaction is a split transaction
 *
 * @param transaction   The transaction to check
 * @returns             True if the transaction is a split transaction, false otherwise
 */
export function isSplitTransaction(transaction: ITransaction): boolean {
  return Array.isArray(transaction.line_items) && transaction.line_items.length > 1
}

/**
 * Determine if any of the transactions are split transactions
 *
 * @param transactions The list of transactions to check
 * @returns             True if any of the transactions are split transactions, false otherwise
 */
export function hasSplitTransaction(transactions: ITransaction[]): boolean {
  return transactions.some((transaction) => isSplitTransaction(transaction))
}

/**
 * Helper function to return the category of a transaction. If the transaction is a split transaction, will
 * return null as we can't determine the category.
 *
 * @param transaction The transaction to get the category for
 * @returns           The category ID of the transaction. Will return null if the transaction is a split transaction
 *                    or the category isn't set (Uncategorised)
 */
export function getTransactionCategory(transaction: ITransaction): number | null {
  // Skip if split transaction
  if (isSplitTransaction(transaction)) {
    return null
  }

  // Get first line item where accountID does not match the tranaction accountID
  const categoryLineItem = transaction.line_items.find(
    (lineItem) => lineItem.account_id !== transaction.account_id,
  )
  return categoryLineItem?.account_id || null
}

/**
 * Helper function to validate line items for a transaction. The total amount of the line items must equal
 * the transaction amount.
 *
 * @param line_items          The line items to validate
 * @param transactionAmount   The transaction amount to compare against
 * @returns
 */
export function validateLineItems(
  line_items: ILineItemUpdate[],
  transactionAmount: number,
): { valid: boolean; message?: string } {
  // Check if line items are empty
  if (line_items.length === 0) {
    return { valid: false, message: 'Line items cannot be empty' }
  }

  // Check if line items sum to transaction amount
  const splitAmount = roundNumber(line_items.reduce((total, split) => total + split.amount, 0))
  if (splitAmount !== transactionAmount) {
    return {
      valid: false,
      message: `Split amounts must add up to transaction amount: ${transactionAmount} !== ${splitAmount}`,
    }
  }

  return { valid: true }
}
