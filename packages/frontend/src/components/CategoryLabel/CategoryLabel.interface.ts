import type { IAccount } from '@angelfish/core'

/**
 * CategoryLabel Component Properties
 */

export interface CategoryLabelProps {
  /**
   * Account to render - should be normalised with associated relations
   * like institution/category group populated. If null will render
   * unclassified
   */
  account?: IAccount
  /**
   * Optional className for component
   */
  className?: string
  /**
   * Optionally change icon size
   * @default 24
   */
  iconSize?: number
}
