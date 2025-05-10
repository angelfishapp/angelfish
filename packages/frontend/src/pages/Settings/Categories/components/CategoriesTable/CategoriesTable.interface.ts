import type { TableProps } from '@/components/Table/Table.interface'
import type { IAccount } from '@angelfish/core'

/**
 * Main Table Component Properties
 */

export interface CategoriesTableProps extends Pick<TableProps<IAccount>, 'EmptyView'> {
  /**
   * Filter to only show categories for particular Category Group. Will display
   * all categories in store if not set
   */
  categories: IAccount[]
  /**
   * Set the marginLeft position for the top pointer (default 40px)
   */
  pointerPosition?: string | number
  /**
   * Function triggered when a row is selected
   */
  onSelect: (category: IAccount) => void
}
