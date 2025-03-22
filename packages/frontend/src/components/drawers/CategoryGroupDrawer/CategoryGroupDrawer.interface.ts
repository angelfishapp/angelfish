import type { ICategoryGroup } from '@angelfish/core'

/**
 * CategoryGroup Draw Component Properties
 */

export interface CategoryGroupDrawerProps {
  /**
   * Optional Category Group, if provided will open in Edit mode
   */
  categoryGroup?: ICategoryGroup
  /**
   * Function triggered when clicking save button
   */
  onSave: (categoryGroup: ICategoryGroup) => void
  /**
   * Function triggered when deleting Category Group
   */
  onDelete: (categoryGroup: ICategoryGroup) => void
  /**
   * Function triggered when closing drawer
   */
  onClose?: () => void
  /**
   * Show (true) or hide (false) the drawer (Default: true)
   */
  open?: boolean
}
