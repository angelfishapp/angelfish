import type { ITag } from './tag-interface'
import type { ITransaction } from './transaction-interface'

/**
 * Interface for Line Item Model.
 */
export interface ILineItem {
  /* Primary Key ID */
  id: number

  /* Source Transaction ID for Line Item */
  transaction_id: number

  /* Source Transaction for Line Item */
  transaction?: ITransaction

  /* Account (Category) Line Item belongs too
       Can be null if transaction is uncategorised */
  account_id?: number

  /* Signed Amount for Line Item:
       + = credit, - = debit */
  amount: number

  /**
   * Amount converted to Book's default (base) currency. This is used for reports
   * and calculations to ensure amounts are consistent and should be the amount of
   * the line item converted to the base currency on that day's exchange rate. If
   * the Transaction is the same currency as the Book's default currency, this will
   * be the same as the amount.
   */
  local_amount: number

  /* Note for Line Item */
  note?: string

  /* Array of Tags Associated with Line Item */
  tags: ITag[]
}

/**
 * Interface for Line Item Update Model.
 */
export interface ILineItemUpdate
  extends Partial<Omit<ILineItem, 'amount' | 'tags' | 'account_id' | 'note'>> {
  /* Signed Amount for Line Item:
       + = credit, - = debit */
  amount: number
  /* Account (Category) Line Item belongs too
       Can be null if transaction is uncategorised */
  account_id?: number | null
  /* Note for Line Item */
  note?: string | null
  /* Array of Tags Associated with Line Item */
  tags?: Partial<ITag>[]
}
