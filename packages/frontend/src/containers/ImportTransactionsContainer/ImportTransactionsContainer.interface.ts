import type { IAccount } from '@angelfish/core'

/**
 * ImportTransactionsContainer Component Properties
 */
export interface ImportTransactionsContainerProps {
  /**
   * The Default Account to import Transactions into
   */
  defaultAccount: IAccount
  /**
   * Modal open state
   * @default false
   */
  open?: boolean
  /**
   * Callback to close the modal
   */
  onClose?: () => void
}
