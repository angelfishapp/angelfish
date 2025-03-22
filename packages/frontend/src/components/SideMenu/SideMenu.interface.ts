import type { ReactNode } from 'react'

/**
 * SideMenu Component Properties
 */

export interface SideMenuProps {
  /**
   * Child elements to display in Side Menu
   */
  children: ReactNode
  /**
   * Is the side menu collapsable?
   * @default true
   */
  collapsable?: boolean
  /**
   * Unique ID, used to pull localstorage settings for width if resized
   */
  id: string
  /**
   * Minimum width of the side menu in pixels. If resizable is false, menu will be fixed to this width.
   * @default MIN_WIDTH
   */
  minWidth?: number
  /**
   * Is the side menu sticky?
   * @default false
   */
  sticky?: boolean
  /**
   * Is the side menu resizable?
   * @default true
   */
  resizeable?: boolean
  /**
   * Callback function to call when the side menu is resized
   * with current width
   */
  onResize?: (width: number) => void
}
