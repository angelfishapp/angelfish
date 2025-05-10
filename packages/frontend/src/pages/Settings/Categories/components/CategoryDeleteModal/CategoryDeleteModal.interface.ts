import type { ConfirmDialogProps } from '@/components/ConfirmDialog/ConfirmDialog.interface'
import type { IAccount, ITransaction } from '@angelfish/core'

/**
 * CategoryDeleteModal Component Properties
 */
export interface CategoryDeleteModalProps extends Partial<Omit<ConfirmDialogProps, 'onConfirm'>> {
  /**
   * Account to delete
   */
  account: IAccount
  /**
   * Callback to delete and reassign any transactions for that Category to a new One
   */
  onConfirm: (id: number, reassignId?: number) => void
  /**
   * List of Accounts to re-assign transactions to
   */
  options: IAccount[]
  /**
   * List of any transactions assigned to the Category already if any
   */
  transactions?: ITransaction[]
}
