import type { IAccount, ITag, ITransaction, ITransactionUpdate } from '@angelfish/core'

/**
 * PeriodDetailDrawer Component Properties
 */

export interface PeriodDetailDrawerProps {
  /**
   * Full list of available Accounts for Categorising
   * Transactions in the Table with Parent Relations Attached
   */
  accountsWithRelations: IAccount[]
  /**
   * Show (true) or hide (false) the drawer
   * @default true
   */
  open?: boolean
  /**
   * Function triggered when closing drawer
   */
  onClose: () => void
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
   * Full list of available Tags for Tagging Transactions
   * in the Table
   */
  tags: ITag[]
  /**
   * Title to display in the drawer header
   */
  title: string
  /**
   * Transactions to display in the drawer
   */
  transactions: ITransaction[]
}
