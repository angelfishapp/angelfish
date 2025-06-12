import type { ReactNode } from 'react'

import type { DropdownMenuItem } from '@/components/DropdownMenuButton'

/**
 * Drawer Component Properties
 */

export interface DrawerProps {
  /**
   * React component to render inside drawer
   */
  children: ReactNode
  /**
   * True - user can click on blur backdrop to close drawer
   * @default false
   */
  disableBackdropClose?: boolean
  /**
   * Only for Right Drawer. Disable save button in drawer if
   * onSave() is provided and button is disaplyed
   * @default false
   */
  disableSaveButton?: boolean
  /**
   * Optionally turn off blurring on backdrop so user can see the rest
   * of the screen while drawer is open
   * @default false
   */
  hideBackdrop?: boolean
  /**
   * Keep the drawer mounted in the DOM when closed
   * This can be useful for performance reasons if you want to avoid
   * unmounting and remounting the drawer every time it opens and closes.
   * If set to false, the drawer will be unmounted when closed.
   * @default false
   */
  keepMounted?: boolean
  /**
   * Optionally Add List of Menu Items to Top of Drawer with ... button
   */
  menuItems?: DropdownMenuItem[]
  /**
   * Function triggered when closing drawer
   */
  onClose?: (
    reason: 'escapeKeyDown' | 'backdropClick' | 'closeButtonClick' | 'saveButtonClick',
  ) => void
  /**
   * Only for Right Drawer. If provided will show a save button at the bottom of the
   * drawer that triggers this function
   */
  onSave?: () => void
  /**
   * Show (true) or hide (false) the drawer
   * @default true
   */
  open?: boolean
  /**
   * Where should drawer appear from?
   * @default 'right'
   */
  position?: 'right' | 'bottom'
  /**
   * Display Title for Drawer
   */
  title: string
}
