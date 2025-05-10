import type { CategoryType } from './account-interface'
import type { CategoryGroupType } from './category-group-interface'
import type { IUser } from './user-interface'

/**
 * ReportsDataRow interface for Table Rows
 */

export interface ReportsDataRow {
  /**
   * Category Group ID, Null if unclassified
   */
  id: number | null
  /**
   * Category Group Name
   */
  name: string
  /**
   * Category Group Icon
   */
  icon: string
  /**
   * Hex Color Code for Row
   */
  color?: string
  /**
   * Category Group Type, Income or Expense, or 'net' for Net row data showing the
   * period difference between income and expenses
   */
  type: CategoryGroupType | 'net'
  /**
   * Array of category rows
   */
  categories?: ReportsDataCategoryRow[]
  /**
   * total amount of that CategroyGroup i.e sum of all periods
   */
  total: number
  /**
   * Totals Stored Against Period Key
   * Will be number type
   */
  [key: string]: number | any
}

/**
 * ReportsDataCategoryRow interface for Table Rows so CategroyGroup rows can be expanded to show
 * category breakdown
 */

export interface ReportsDataCategoryRow {
  /**
   * Category ID, Null if unclassified
   */
  id: number | null
  /**
   * Category Name
   */
  name: string
  /**
   * Category Icon
   */
  icon: string
  /**
   * Category Type
   */
  type: CategoryType | 'Unknown'
  /**
   * total amount of that CategroyGroup i.e sun of all periods
   */
  total: number
  /**
   * Totals Stored Against Period Key
   * Will be number type
   */
  [key: string]: number | any
}

/**
 * Main ReportsData interface Returned from
 * ReportsService for rendering reports
 */

export interface ReportsData {
  /**
   * An array of periods in dataset so columns
   * can be easily rendered
   */
  periods: string[]
  /**
   * An array of rows with category group and
   * category properties and totals to render
   */
  rows: ReportsDataRow[]
}

/**
 * ReportsQuery interface for ReportsService to fetch
 * data for a report
 */
export interface ReportsQuery {
  /**
   * The start date of the report in YYYY-MM-DD Format
   */
  start_date: string
  /**
   * The end date of the report in YYYY-MM-DD Format
   */
  end_date: string
  /**
   * Should unclassified income/expenses be included in report
   * @default true
   */
  include_unclassified?: boolean
  /**
   * Optionally filter report to only show transactions from Accounts belonging
   * to a specific user. If not provided, all user Accounts will be included
   */
  filterByUser?: IUser['id']
}
