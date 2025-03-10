import type { IAccount } from './account-interface'

/**
 * Category Group Types
 */
export type CategoryGroupType = 'Income' | 'Expense'

/**
 * Interface for CategoryGroup Model
 *
 * Groups group together common categories so user's can see
 * their spending in a particular area
 */
export interface ICategoryGroup {
  /* Primary unique ID for Category Group */
  id: number

  /* Date Category Group was Created On */
  created_on: Date

  /* Date Category Group was last Updated On */
  modified_on: Date

  /* Name (title) for Category Group */
  name: string

  /* Emoji icon short name for Category Group */
  icon: string

  /* Category Group type: Income or Expense */
  type: CategoryGroupType

  /* Full text description for what Categories belong in Category Group */
  description: string

  /* Optional HEX Color used to set series color on report graphs */
  color?: string

  /* List of Categories for Category Group */
  categories?: IAccount[]

  /**
   * Calculated Virtual Fields
   */

  /* Number of Categories (Accounts) that belong to Category Group */
  total_categories: number
}
