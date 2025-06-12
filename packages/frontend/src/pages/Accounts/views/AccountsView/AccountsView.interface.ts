import type { IAccount, ITag, ITransaction, ITransactionUpdate } from '@angelfish/core'

/**
 * AccountView Component Properties
 */

export interface AccountsViewProps {
  /**
   * Account being viewed
   */
  account?: IAccount
  /**
   * Full list of available Accounts for Categorising
   * Transactions in the Table with Parent Relations Attached
   */
  accountsWithRelations: IAccount[]
  /**
   * Any error that occurred while loading the Account/Transactions
   * @default null
   */
  error: null | Error
  /**
   * Is the Account/Transactions currently being loaded via IPC
   * @default false
   */
  isLoading: boolean
  /**
   * Array of Transactions to Render in Table
   */
  transactions: ITransaction[]
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
  onSaveTransaction: (transactions: ITransactionUpdate[]) => void
  /**
   * Callback to open Import Transactions Modal to import Transactions
   * from a file
   */
  onImportTransactions: () => void
}
