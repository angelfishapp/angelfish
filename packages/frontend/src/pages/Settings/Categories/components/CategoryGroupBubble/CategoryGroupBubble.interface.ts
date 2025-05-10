import type { ICategoryGroup } from '@angelfish/core'

/**
 * CategoryGroupBubble Component Properties
 */
export interface CategoryGroupBubbleProps {
  /**
   * The Category Group entity to render
   */
  categoryGroup: ICategoryGroup
  /**
   * Is the Category Group selected or not
   */
  isSelected?: boolean
  /**
   * Function triggered when clicking on Bubble 'Edit' link
   */
  onEdit: () => void
  /**
   * Function triggered when clicking on Bubble to select it
   */
  onClick: () => void
}
