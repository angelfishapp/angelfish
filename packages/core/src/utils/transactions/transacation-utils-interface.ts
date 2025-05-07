import type { ILineItemUpdate, ITag } from '../../types'

/**
 * Common Transaction properties that can be set on a new or existing Transaction
 */
interface CommonTransactionProperties {
  /**
   * Set the bank account ID the transaction belongs to
   */
  account_id: number
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
}

/**
 * Properties for creating a new Transaction
 * @extends CommonTransactionProperties
 */
export interface CreateTransactionProperties extends CommonTransactionProperties {
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
   * Any tags to add to the Transaction
   */
  tags?: Partial<ITag>[]
}

/**
 * Properties for updating an existing Unsplit Transaction
 * @extends CommonTransactionProperties
 */
interface UpdateUnsplitTransactionProperties extends Partial<CommonTransactionProperties> {
  splits?: undefined
  /**
   * Category ID for the Transaction. If not provided, defaults to null (Uncategorised)
   * Will only update non-Split Transactions and throw error if provided for Split Transactions if set.
   * @default null for createNewTransaction()
   */
  category_id?: number | null
  /**
   * Optional note/memo for the Transaction
   * Will only update non-Split Transactions and throw error if provided for Split Transactions if set.
   */
  note?: string
  /**
   * Add additional tags to the Transaction if provided
   * Will only update non-Split Transactions and throw error if provided for Split Transactions if set.
   */
  add_tags?: Partial<ITag>[]
  /**
   * Remove specified tags from the Transaction if provided
   * Will only update non-Split Transactions and throw error if provided for Split Transactions if set.
   */
  remove_tags?: ITag[]
  /**
   * Overwrite all tags for the Transaction with the provided tags if provided
   * Will only update non-Split Transactions and throw error if provided for Split Transactions if set.
   */
  overwrite_tags?: Partial<ITag>[]
}

/**
 * Properties for updating an existing Split Transaction
 * @extends CommonTransactionProperties
 */
interface UpdateSplitTransactionProperties extends Partial<CommonTransactionProperties> {
  /**
   * Update the Transaction Splits
   */
  splits: ILineItemUpdate[]

  // All line item properties should be undefined
  category_id?: undefined
  note?: undefined
  add_tags?: undefined
  remove_tags?: undefined
  overwrite_tags?: undefined
}

/**
 * Properties for updating an existing Transaction
 * @extends CommonTransactionProperties
 */
export type UpdateTransactionProperties =
  | UpdateUnsplitTransactionProperties
  | UpdateSplitTransactionProperties
