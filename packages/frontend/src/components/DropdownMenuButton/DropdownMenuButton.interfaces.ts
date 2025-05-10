import type { ButtonBaseProps } from '@mui/material/ButtonBase'
import type { PopoverOrigin } from '@mui/material/Popover'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import type React from 'react'

import type { PalletColors } from '@/utils/palette.utils'

/**
 * Interface for the MenuItem
 */
export interface DropdownMenuItem {
  /**
   * Optional className to apply to the MenuItem.
   */
  className?: string
  /**
   * Optionally set the color of the menu item.
   */
  color?: PalletColors | string
  /**
   * If true, the menu item is disabled.
   * @default false
   */
  disabled?: boolean
  /**
   * If true, a 1px light border is added to the bottom of the menu item.
   * @default false
   */
  divider?: boolean
  /**
   * Optional icon to display in the menu item.
   */
  icon?: React.ComponentType<SvgIconProps>
  /**
   * The label to display in the menu item.
   */
  label: string
  /**
   * If true, the menu item is selected.
   * @default false
   */
  selected?: boolean
  /**
   * The function to call when the menu item is clicked.
   * If not provided, the menu item will be displayed as a
   * submenu header
   */
  onClick?: () => void
}

/**
 * DropdownMenuButton Component Properties
 */
export interface DropdownMenuButtonProps
  extends Omit<ButtonBaseProps, 'children' | 'color' | 'title'> {
  /**
   * The color of the button
   * @default 'primary'
   */
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  /**
   * The dropdown menu items
   */
  menuItems: DropdownMenuItem[]
  /**
   * Whether the Button is full width if not Icon variant
   * @default false
   */
  fullWidth?: boolean
  /**
   * Set the width of the menu
   */
  menuWidth?: number
  /**
   * The SVGIcon to display. For non-icon variants, the icon will be
   * displayed on the right side of the button.
   *
   * @default for icon variant: '@mui/icons-material/MoreHoriz'
   * @default for text, outlined, and contained variants: '@mui/icons-material/ExpandMoreIcon'
   */
  Icon?: React.ComponentType<SvgIconProps>
  /**
   * The text label for the button. For icon variant, the label is shown
   * on hover.
   */
  label: string
  /**
   * The origin for the menu to appear relative to the button
   * @default { vertical: 'bottom', horizontal: 'center' }
   */
  position?: PopoverOrigin
  /**
   * Whether the dropdown menu is open or not
   *
   * @default false
   */
  open?: boolean
  /**
   * The size of the button
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * The variant of the button to open the menu:
   *
   * - 'text': A button with text label and no borders
   * - 'outlined': A button with text label and a border
   * - 'contained': A button with text label and a background color
   * - 'icon': A button with an icon and no borders
   *
   * @default 'icon'
   */
  variant?: 'text' | 'outlined' | 'contained' | 'icon'
}
