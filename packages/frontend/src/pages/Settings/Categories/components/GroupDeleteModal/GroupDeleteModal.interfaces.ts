import type { ConfirmDialogProps } from '@/components/ConfirmDialog/ConfirmDialog.interface'
import type { IAccount, ICategoryGroup } from '@angelfish/core'

/**
 * Group Delete Modal Properties
 */
export interface GroupDeleteModalProps extends Partial<Omit<ConfirmDialogProps, 'onConfirm'>> {
  /**
   * Category Group being deleted
   */
  categoryGroup: ICategoryGroup
  /**
   * List of categories that belong to this group, if any, and need to be
   * transferred to another group before deleting this one.
   */
  accounts?: IAccount[]
  /**
   * List of Category Groups to transfer the categories to
   */
  options: ICategoryGroup[]
  /**
   * Callback to execute when the user confirms the deletion
   */
  onConfirm: (reassignId?: number) => void
}
