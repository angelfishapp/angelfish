import type { PopoverPosition } from '@mui/material/Popover'
import type { ReactNode } from 'react'

import type { DropdownMenuItem } from '@/components/DropdownMenuButton/DropdownMenuButton.interfaces'

/**
 * ContextMenu Menu Item
 */

export interface ContextMenuItem extends Omit<DropdownMenuItem, 'label'> {
  /**
   * Set optional title for when user hovers over disabled item
   * to explain why the option is disabled.
   */
  disabledText?: string
  /**
   * Menu Item Title (string) or Component to render
   */
  item: string | ReactNode
  /**
   * Menu Item Hover Handler. Passes in disabled flag for item
   * to change behaviour based on if disabled or not
   */
  onHover?: (isDisabled: boolean) => void
  /**
   * Menu Item Children
   */
  subMenu?: ContextMenuItem[]
  /**
   * Optional Menu Item Sub Menu Class Name
   */
  subMenuClassName?: string
  /**
   * Force Sub Menu to be open
   * @default false
   */
  subMenuIsOpen?: boolean
}

/**
 * ContextMenu Component Properties
 */

export interface ContextMenuProps {
  /**
   * Menu Items/Elements to render in Context Menu
   * You can render a single level of menu items or a nested array of menu
   * items if you want to group menu items using a divider in between.
   */
  items: ContextMenuItem[]
  /**
   * Is context menu open (true) or hidden/closed (false)
   */
  open: boolean
  /**
   * Mouse position to render context menu
   */
  anchorPosition: PopoverPosition
  /**
   * onClose Handler
   */
  onClose: () => void
  /**
   * Optional flag to unmount the context menu when it is closed
   * @default false
   */
  unMountOnExit?: boolean
  /**
   * Optional margin from right window edge to determine which direction to show submenus
   * @default 200
   */
  windowMarginX?: number
  /**
   * Optional margin from right window edge to determine which direction to show submenus
   * @default 200
   */
  windowMarginY?: number
}
