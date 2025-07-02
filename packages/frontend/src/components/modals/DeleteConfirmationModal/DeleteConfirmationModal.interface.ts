import type { TransactionRow } from '@/components/TransactionsTable/data'

/**
 * Props for the DeleteConfirmationModal component.
 *
 * Used to control the state and behavior of the delete confirmation dialog,
 * including modal visibility, closing, confirming, and the transactions being acted upon.
 */
export interface DeleteConfirmationModalProps {
  /**
   * Whether the modal is currently open.
   */
  isOpen: boolean

  /**
   * Function to call when the modal should be closed (e.g. cancel or backdrop click).
   */
  onClose: () => void

  /**
   * Function to call when the user confirms the deletion action.
   */
  onConfirm: () => void

  /**
   * Array of transaction rows to be deleted.
   */
  transactions: TransactionRow[]
}
