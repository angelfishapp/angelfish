import type { IAccount, ITag, ITransaction } from '@angelfish/core'

/**
 * LoanAccountView Component Properties
 */

export interface LoanAccountProps {
  /**
   * Account being viewed
   */
  account: IAccount
  /**
   * Array of Transactions to Render in Table
   */
  transactions: ITransaction[]
  /**
   * Full list of available Accounts for Categorising
   * Transactions in the Table with Parent Relations Attached
   */
  accountsWithRelations: IAccount[]
  /**
   * Full list of available Tags for Tagging Transactions
   * in the Table
   */
  tags: ITag[]
}
