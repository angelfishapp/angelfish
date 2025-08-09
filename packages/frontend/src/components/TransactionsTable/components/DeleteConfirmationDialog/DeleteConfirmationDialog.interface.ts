import type { Table } from '@tanstack/react-table'

import type { TransactionRow } from '@/components/TransactionsTable/data'

/**
 * Props for the DeleteConfirmationDialog component.
 *
 * Used to control the state and behavior of the delete confirmation dialog,
 * including modal visibility, closing, confirming, and the transactions being acted upon.
 */
export interface DeleteConfirmationDialogProps {
  /**
   * Whether the modal is currently open.
   */
  isOpen: boolean
  /**
   * The table instance containing the transaction rows.
   */
  table?: Table<TransactionRow>
  /**
   * Function to call when the modal should be closed (e.g. cancel or backdrop click).
   */
  onClose: () => void
}
