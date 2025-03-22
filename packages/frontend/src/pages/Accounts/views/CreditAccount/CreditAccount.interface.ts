import type { IAccount, ITag, ITransaction, ITransactionUpdate } from '@angelfish/core'

/**
 * CreditAccountView Component Properties
 */

export interface CreditAccountProps {
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
  /**
   * Callback to create new Category from CategoryField
   */
  onCreateCategory: (name?: string) => void
  /**
   * Callback to delete a Transaction
   */
  onDeleteTransaction: (id: number) => void
  /**
   * Callback to create/update Transactions
   */
  onSaveTransactions: (transactions: ITransactionUpdate[]) => void
  /**
   * Callback to open Import Transactions Modal to import Transactions
   * from a file
   */
  onImportTransactions: () => void
}
