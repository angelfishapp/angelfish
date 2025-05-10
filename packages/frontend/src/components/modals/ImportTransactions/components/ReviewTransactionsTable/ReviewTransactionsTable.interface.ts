import type { IAccount } from '@angelfish/core'
import type { ReconciledTransaction } from '@angelfish/core/src/types'

/**
 * ReviewTransactionsTable Component Properties
 */
export interface ReviewTransactionsTableProps {
  /**
   * Full list of available Accounts for Categorising
   * Transactions in the Table with Parent Relations Attached
   */
  accountsWithRelations: IAccount[]
  /**
   * List of reconciled transactions for user to review
   * and edit as needed
   */
  transactions: ReconciledTransaction[]
  /**
   * Callback to create/update Reconciled Transactions
   */
  onUpdateTransactions: (transactions: ReconciledTransaction[]) => void
  /**
   * HTML Div Element to use as Scroll Container for Table Virtualization
   */
  scrollElement: HTMLDivElement | null
}
