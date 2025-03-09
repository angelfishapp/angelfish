/**
 * interface for Parsed Account from data
 */
export interface Account {
  /**
   * Bank ID for Account
   */
  id: string

  /**
   * Name of the account
   */
  name: string

  /**
   * Current balance of the account
   */
  balances?: {
    /*
     * The total amount of funds in or owed by the account.
     */
    current?: number
    /*
     * The amount of funds available to be withdrawn from the account, as determined by the financial institution.
     */
    available?: number
    /*
     * The ISO-4217 currency code of the balance.
     */
    iso_currency_code?: string
  }
}
