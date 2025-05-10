import type { CategoryGroupType, IAccount, ICategoryGroup } from '@angelfish/core'

/**
 * Category Draw Component Properties
 */

export interface CategoryDrawerProps {
  /**
   * Array of CategoryGroups from Database
   */
  categoryGroups: ICategoryGroup[]
  /**
   * Function triggered when clicking save button
   */
  onSave: (category: IAccount) => void
  /**
   * Function triggered when deleting Category
   */
  onDelete: (category: IAccount) => void
  /**
   * Optional Category, will use these values as initial state of form
   */
  initialValue?: IAccount
  /**
   * Optional - set the initial Group Type if editing a category
   * to ensure we render the correct list of Category Types
   */
  initialGroupType?: CategoryGroupType
  /**
   * Show (true) or hide (false) the drawer (Default: true)
   */
  open?: boolean
  /**
   * Function triggered when closing drawer
   */
  onClose?: () => void
}
