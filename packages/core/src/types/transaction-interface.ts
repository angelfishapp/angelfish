import type { IAccount } from './account-interface'
import type { ILineItem, ILineItemUpdate } from './line-item-interface'

/**
 * Interface for Transaction Model
 */
export interface ITransaction {
  /* Primary ID for Transaction */
  id: number

  /* The date the transaction occurred */
  date: Date

  /* The date the transaction was created */
  created_on: Date

  /* The date the transaction was last modified */
  modified_on: Date

  /* Account ID of the Account the Transaction belongs to  */
  account_id: number

  /* The Account the Transaction belongs to */
  account?: IAccount

  /* The merchant name or transaction description. */
  title: string

  /* Transaction amount. +ve=Expense, -ve=Deposit */
  amount: number

  /* The ISO-4217 currency code of the transaction. */
  currency_code: string

  /**
   * Indicates if the Transaction requires updating on the next sync. This can happen
   * if the transaction was created/updated while the user was offline.
   *
   * For example when the transaction is created/updated with a date that doesn't have
   * a currency exchange rate downloaded yet, it will use last known currency exchange rate temporarily,
   * and will be marked as requires_sync, to be updated during the next sync (and marked as requires_sync=false) so
   * future queries/reports are accurate.
   */
  requires_sync: boolean

  /*
   * Is Transaction Pending (True) or Not (False)
   * Pending transactions are transactions that have been authorized but have not cleared the account.
   * @default false
   */
  pending: boolean

  /*
   * Is Transaction Reviewed (True) or Not (False)
   * Reviewed transactions are transactions that have been reviewed by the user.
   * @default false
   */
  is_reviewed: boolean

  /* Any remote ID for the transaction. This is the ID that the bank provides. */
  import_id?: string

  /* List of associated line items for transaction */
  line_items: ILineItem[]
}

/**
 * Interface for Transaction Update Model
 */
export interface ITransactionUpdate extends Partial<Omit<ITransaction, 'line_items'>> {
  line_items: ILineItemUpdate[]
}
