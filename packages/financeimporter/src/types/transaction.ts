import type { LineItem } from './line-item'

/**
 * Interface for Transaction object parsed from data.
 */
export interface Transaction {
  /**
   * Primary ID for Transaction
   */
  id?: string

  /**
   * The UTC date the transaction occurred
   */
  date: Date

  /**
   * Account ID of the Account the Transaction belongs to
   */
  account_id?: string

  /**
   * The merchant name or transaction description.
   */
  name: string

  /**
   * Memo/description for transaction if available
   */
  memo?: string

  /**
   * LineItems will only be added if the Transaction contains a Category
   * or Split Transactions are present to ensure existing Categories and Splits
   * from imported files are maintained.
   */
  lineItems?: LineItem[]

  /**
   * Transaction amount. +ve=Deposit, -ve=Withdrawal
   */
  amount: number

  /**
   * Is Transaction Pending (True) or Not (False)
   */
  pending: boolean

  /**
   * The ISO-4217 currency code of the transaction.
   */
  iso_currency_code?: string

  /**
   * An identifier for the type of transaction. The type field will be one of the following values:
   *
   * adjustment: Bank adjustment
   * atm: Cash deposit or withdrawal via an automated teller machine
   * bank charge: Charge or fee levied by the institution
   * bill payment: Payment of a bill
   * cash: Cash deposit or withdrawal
   * cashback: Cash withdrawal while making a debit card purchase
   * cheque: Document ordering the payment of money to another person or organization
   * direct debit: Automatic withdrawal of funds initiated by a third party at a regular interval
   * interest: Interest earned or incurred
   * purchase: Purchase made with a debit or credit card
   * standing order: Payment instructed by the account holder to a third party at a regular interval
   * transfer: Transfer of money between accounts
   */
  transaction_type?:
    | 'adjustment'
    | 'atm'
    | 'bank charge'
    | 'bill payment'
    | 'cash'
    | 'cashback'
    | 'cheque'
    | 'direct debit'
    | 'interest'
    | 'purchase'
    | ' standing order'
    | ' transfer'

  /**
   * Check Number if available
   */
  check_number?: string
}
