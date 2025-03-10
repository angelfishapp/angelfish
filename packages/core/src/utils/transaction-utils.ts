/**
 * Provides Utility functions to manipulate and edit transactions as double entry accounting model can be confusing
 */

import type { ILineItemUpdate, ITag, ITransaction, ITransactionUpdate } from '../types'

/**
 * Properties that can be set on a new or existing transaction
 */
export interface TransactionProperties {
  /**
   * Date of the Transaction.
   * @default Current Date for createNewTransaction()
   */
  date?: Date
  /**
   * Title for the Transaction
   */
  title: string
  /**
   * Amount for the Transaction.
   * @default 0 for createNewTransaction()
   */
  amount?: number
  /**
   * Currency Code for the Transaction.
   */
  currency_code: string
  /**
   * A currency exchange rate for the currency from the Book's base (default) currency.
   * If not provided, will default to 1 (which means it is the same as the base currency).
   * @default 1 for createNewTransaction()
   */
  currency_exchange_rate?: number
  /**
   * Indicates if the Transaction requires updating on the next sync. Will be set
   * to true on new Transactions if not explicitly set to false to ensure it is updated
   * to correct values during the next sync.
   * @default true for createNewTransaction()
   */
  requires_sync?: boolean
  /**
   * Marks Transaction as Reviewed (true) or Not Reviewed (false).
   * @default false for createNewTransaction()
   */
  is_reviewed?: boolean
  /**
   * Is Transaction Pending (true) or Not Pending (false).
   * @default false for createNewTransaction()
   */
  pending?: boolean
  /**
   * A unique import ID from import source for reconciliation during import.
   */
  import_id?: string

  // line_item properties

  /**
   * Category ID for the Transaction. If not provided, defaults to null (Uncategorised)
   * @default null for createNewTransaction()
   */
  category_id?: number | null
  /**
   * Optional note/memo for the Transaction
   */
  note?: string
  /**
   * Add additional tags to the Transaction if provided
   */
  add_tags?: Partial<ITag>[]
  /**
   * Remove specified tags from the Transaction if provided
   */
  remove_tags?: ITag[]
  /**
   * Overwrite all tags for the Transaction with the provided tags if provided
   */
  overwrite_tags?: Partial<ITag>[]
}

/**
 * Properties that can be set on a new or existing split line item
 */
export interface SplitLineItem {
  /**
   * LineItem ID. If provided, will update existing line item in DB
   */
  id?: number
  /**
   * Amount for the split LineItem
   */
  amount: number
  /**
   * Category ID for the split LineItem, null if uncategorised
   */
  category_id: number | null
  /**
   * Optional note/memo for the split LineItem
   */
  note?: string
  /**
   * Optional tags for the split LineItem
   */
  tags?: Partial<ITag>[]
}

/**
 * Helper function to create a new transaction object. Will create 2 line items for the transaction, one for the bank account and one for the category.
 * All parameters are optional apart from bank account transaction belongs to. If no parameters are provided, will create a transaction with default values.
 *
 * @param account_id    Set the bank account ID the transaction belongs to
 * @param properties    Optional properties to set on the transaction
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
 *                        - category_id               If provided, sets category Account ID or defaults to null (Uncategorised)
 *                        - note                      If provided, sets note or defaults to empty string
 *                        - add_tags                  If provided, sets tags or defaults to empty array
 *                        - remove_tags               Ignored as new transaction so no tags to remove
 *                        - overwrite_tags            If provided, sets tags or defaults to empty array
 * @returns             The new transaction
 */
export function createNewTransaction(
  account_id: number,
  properties: TransactionProperties,
): ITransactionUpdate {
  const tags = properties?.overwrite_tags || properties?.add_tags || []
  const exchangeRate = properties?.currency_exchange_rate || 1

  return {
    account_id,
    date: properties?.date || new Date(),
    title: properties?.title || '',
    amount: properties?.amount || 0,
    currency_code: properties?.currency_code ? properties.currency_code : undefined,
    is_reviewed: properties?.is_reviewed !== undefined ? properties.is_reviewed : false,
    requires_sync: properties?.requires_sync !== undefined ? properties.requires_sync : true,
    pending: properties?.pending !== undefined ? properties.pending : false,
    import_id: properties?.import_id || undefined,
    line_items: [
      {
        account_id,
        amount: properties?.amount || 0,
        local_amount: properties?.amount
          ? parseFloat((properties.amount / exchangeRate).toFixed(2))
          : 0,
      },
      {
        account_id: properties?.category_id || undefined,
        amount: properties?.amount ? properties?.amount * -1 : 0,
        local_amount: properties?.amount
          ? parseFloat(((properties.amount * -1) / exchangeRate).toFixed(2))
          : 0,
        note: properties?.note || undefined,
        tags,
      },
    ],
  }
}

/**
 * Update the properties of the transaction. If split transaction is provided, will throw error if trying to update category, amount or notes as we can't determine
 * which line item to update. Use `splitTransaction` function instead.
 *
 * Apart from Split transactions, every transaction will have 2 line items associated with it as per double entry accounting rules:
 *
 *  - One line item will be a debit (positive amount) and the other will be a credit (negative amount)
 *  - The sum of the amounts of the line items will always be 0
 *  - One line item will be for the bank account the transaction belongs too, the other line item will be for the category the transaction belongs too
 *  - Tags and notes are attached to the line item for the category to allow filtering of transactions by tags for reports
 *
 * @param transaction   The Transaction to edit
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
 *                        - note                      If provided, updates all transaction notes to new note
 *                        - add_tags                  If provided, will merge new tags with existing tags to add them
 *                        - remove_tags               If provided, will remove tags from existing tags if set
 *                        - overwrite_tags            If provided, sets tags or defaults to empty array
 *
 * @returns             The updated transaction
 * @throws              Error if trying to update category, amount, notes or tags of a split transaction
 */
export function updateTransaction(
  transaction: ITransactionUpdate,
  properties?: Partial<TransactionProperties>,
): ITransactionUpdate {
  return updateTransactions([transaction], properties)[0]
}

/**
 * Given an array of transactions, will update the properties of the transactions. If split transaction is provided, will throw error if trying to update category, amount or notes as we can't determine
 * which line item to update. Use `splitTransaction` function instead.
 *
 * Apart from Split transactions, every transaction will have 2 line items associated with it as per double entry accounting rules:
 *
 *  - One line item will be a debit (positive amount) and the other will be a credit (negative amount)
 *  - The sum of the amounts of the line items will always be 0
 *  - One line item will be for the bank account the transaction belongs too, the other line item will be for the category the transaction belongs too
 *  - Tags and notes are attached to the line item for the category to allow filtering of transactions by tags for reports
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
 *                        - note                      If provided, updates all transaction notes to new note
 *                        - add_tags                  If provided, will merge new tags with existing tags to add them
 *                        - remove_tags               If provided, will remove tags from existing tags if set
 *                        - overwrite_tags            If provided, sets tags or defaults to empty array
 *
 * @returns             The updated transactions
 * @throws              Error if trying to update category, amount, notes or tags of a split transaction
 */
export function updateTransactions(
  transactions: ITransactionUpdate[],
  properties?: Partial<TransactionProperties>,
): ITransactionUpdate[] {
  return transactions.map((transaction) => {
    // Throw error if trying to update certain properties of a split transaction
    if (transaction.line_items.length > 2) {
      if (
        properties?.category_id ||
        properties?.amount ||
        properties?.note ||
        properties?.add_tags ||
        properties?.remove_tags
      ) {
        throw new Error('Cannot update category, amount, notes or tags of a split transaction')
      }
    }

    // If updating currency without a new exchange rate, mark transaction as requires_sync
    if (
      properties?.currency_code !== undefined &&
      properties.currency_code !== transaction.currency_code &&
      properties.currency_exchange_rate === undefined
    ) {
      properties.requires_sync = true
    }

    // Otherwise update the transaction
    return {
      ...transaction,
      date: properties?.date !== undefined ? properties.date : transaction.date,
      title: properties?.title !== undefined ? properties.title : transaction.title,
      amount: properties?.amount !== undefined ? properties.amount : transaction.amount,
      currency_code:
        properties?.currency_code !== undefined
          ? properties.currency_code
          : transaction.currency_code,
      requires_sync:
        properties?.requires_sync !== undefined
          ? properties.requires_sync
          : transaction.requires_sync,
      pending: properties?.pending !== undefined ? properties.pending : transaction.pending,
      is_reviewed:
        properties?.is_reviewed !== undefined ? properties.is_reviewed : transaction.is_reviewed,
      import_id: properties?.import_id !== undefined ? properties.import_id : transaction.import_id,
      line_items: transaction.line_items.map((lineItem) => {
        // Calculate amounts and local amounts based on properties or existing values
        const amount =
          properties?.amount !== undefined
            ? properties.amount * (lineItem.account_id === transaction.account_id ? 1 : -1)
            : lineItem.amount || 0
        const exchangeRate =
          properties?.currency_exchange_rate ||
          (lineItem.local_amount ?? 0) / (lineItem.amount ?? 0)
        const local_amount = parseFloat((amount / exchangeRate).toFixed(2))

        // Update the line item for the bank account
        if (lineItem.account_id === transaction.account_id) {
          return {
            ...lineItem,
            amount,
            local_amount,
          }
        }

        // Update tags
        let tags = lineItem.tags || []
        if (properties?.overwrite_tags) {
          // Overwrite all tags to be same as overwrite_tags
          tags = properties.overwrite_tags
        } else {
          // Merge new tags with existing tags or remove tags from existing tags if present
          tags = tags
            .filter((tag) => !properties?.remove_tags?.find((removeTag) => removeTag.id === tag.id))
            .concat(properties?.add_tags || [])
        }

        // Update the line item for the category
        return {
          ...lineItem,
          amount,
          local_amount,
          account_id:
            properties?.category_id !== undefined
              ? properties.category_id !== null
                ? properties.category_id
                : undefined
              : lineItem.account_id,
          note: properties?.note !== undefined ? properties.note : lineItem.note,
          tags,
        }
      }),
    }
  })
}

/**
 * Update a transaction to become a split transaction or update the splits of an existing split transaction.
 *
 * A split transaction is simply a transaction that has more than 2 line items. This allows a transaction to be split into multiple categories, each
 * with their own amount, note and tags so that the transaction can be filtered by category/tags for reports. As above, the total amount of the transaction
 * must equal the sum of the splits, which together must equal 0.
 *
 * @param transaction   The transaction to update
 * @param properties    Optional properties to set on the transaction, will only accept transaction properties, not line item properties
 * @returns             The updated transaction
 * @throws              Error if amount does need match sum of split amounts
 */
export function splitTransaction(
  transaction: ITransactionUpdate,
  splits: SplitLineItem[],
  properties?: Partial<
    Pick<
      TransactionProperties,
      | 'date'
      | 'title'
      | 'amount'
      | 'import_id'
      | 'pending'
      | 'currency_code'
      | 'is_reviewed'
      | 'requires_sync'
      | 'currency_exchange_rate'
    >
  >,
): ITransactionUpdate {
  // Throw error if split amounts don't add up to transaction amount
  const expectedAmount = properties?.amount !== undefined ? properties.amount : transaction.amount
  const splitAmount = parseFloat(
    splits.reduce((total, split) => total + split.amount, 0).toFixed(2),
  )
  if (splitAmount !== expectedAmount) {
    throw new Error('Split amounts must add up to transaction amount')
  }

  // Get bank account line item to ensure it is added to line items for split transaction
  const bankAccountLineItem = structuredClone(
    transaction.line_items.find((lineItem) => lineItem.account_id === transaction.account_id),
  )
  if (bankAccountLineItem === undefined) {
    throw new Error('Corrupted Transaction. Bank account line item not found')
  }
  if (bankAccountLineItem.amount !== expectedAmount) {
    // Update total amount of bank account line item to match expected amount
    bankAccountLineItem.amount = expectedAmount
  }

  // Get the exchange rate for the transaction
  const exchangeRate =
    properties?.currency_exchange_rate || expectedAmount / (bankAccountLineItem.local_amount || 1)
  bankAccountLineItem.local_amount = parseFloat((expectedAmount / exchangeRate).toFixed(2))

  return {
    ...transaction,
    date: properties?.date !== undefined ? properties.date : transaction.date,
    title: properties?.title !== undefined ? properties.title : transaction.title,
    amount: properties?.amount !== undefined ? properties.amount : transaction.amount,
    currency_code:
      properties?.currency_code !== undefined
        ? properties.currency_code
        : transaction.currency_code,
    requires_sync:
      properties?.requires_sync !== undefined
        ? properties.requires_sync
        : transaction.requires_sync,
    pending: properties?.pending !== undefined ? properties.pending : transaction.pending,
    is_reviewed:
      properties?.is_reviewed !== undefined ? properties.is_reviewed : transaction.is_reviewed,
    import_id: properties?.import_id !== undefined ? properties.import_id : transaction.import_id,
    line_items: [bankAccountLineItem].concat(
      splits.map((split) => {
        const line_item: ILineItemUpdate = {
          account_id: split.category_id || undefined,
          amount: split.amount * -1,
          local_amount: parseFloat(((split.amount * -1) / exchangeRate).toFixed(2)),
          note: split.note || '',
          tags: split.tags || [],
        }
        // Only add ID if provided, this will update existing line item in DB
        if (split.id) {
          line_item['id'] = split.id
        }
        return line_item
      }),
    ),
  }
}

/**
 * Check if a transaction is a split transaction
 *
 * @param transaction   The transaction to check
 * @returns             True if the transaction is a split transaction, false otherwise
 */
export function isSplitTransaction(transaction: ITransaction): boolean {
  return transaction.line_items.length > 2
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
