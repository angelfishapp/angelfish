import type { IAccount, ITag, ITransaction, ITransactionUpdate } from '@angelfish/core'
import type { SupportedColumnNames } from './data'

/**
 * TransactionsTable Component Properties
 */
export interface TransactionsTableProps {
  /**
   * The current Account being viewed
   */
  account?: IAccount
  /**
   * Full list of available Accounts for Categorising
   * Transactions in the Table with Parent Relations Attached
   */
  accountsWithRelations: IAccount[]
  /**
   * List of fieldname Columns to Display on Table
   */
  columns?: SupportedColumnNames[]
  /**
   * Unique ID, used to pull localstorage settings for table
   */
  id?: string
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
  onImportTransactions?: () => void
  /**
   * HTML Div Element to use as Scroll Container for Table Virtualization
   */
  scrollElement: HTMLDivElement | null
  /**
   * (Optional) Hide (false) or Show (true) the Top Filter Bar
   * @default false
   */
  showFilterBar?: boolean
  /**
   * Full list of available Tags for Tagging Transactions
   * in the Table
   */
  allTags: ITag[]
  /**
   * Array of Transactions to Render in Table
   */
  transactions: ITransaction[]
  /**
   * Display variant of the table
   *    - 'raised' - use for page tables with rounded corners and shadow
   *    - 'flat' - use for embedded tables with no rounded corners or shadow
   * @default 'raised'
   */
  variant?: 'raised' | 'flat'
}
