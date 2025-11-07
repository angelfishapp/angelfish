import type { IAccountTypes } from 'src/data/account-types'
import type { CategoryType, IAccount } from './account-interface'
import type { CategoryGroupType } from './category-group-interface'
import type { IUser } from './user-interface'

/**
 * ReportsResultRow interface for Table Rows
 */
export interface CategorySpendReportResultRow {
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
  categories?: CategorySpendReportResultCategoryRow[]
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
 * ReportsResultCategoryRow interface for Table Rows so CategoryGroup rows can be expanded to show
 * category breakdown
 */
export interface CategorySpendReportResultCategoryRow {
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
 * Main ReportsResults interface Returned from
 * ReportsService for rendering reports
 */
export interface CategorySpendReportResults {
  /**
   * An array of periods in dataset so columns
   * can be easily rendered
   */
  periods: string[]
  /**
   * An array of rows with category group and
   * category properties and totals to render
   */
  rows: CategorySpendReportResultRow[]
}

/**
 * ReportsFilterList interface for filtering reports
 * by include/exclude lists of items
 */
export interface ReportsFilterList<T> {
  /**
   * Match any items in this list to include in report
   */
  include?: T[]
  /**
   * Exclude any items in this list to exclude from report
   */
  exclude?: T[]
}

/**
 * ReportsQuery interface for ReportsService to fetch
 * data for a report
 */
export interface CategorySpendReportQuery {
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
   * Optionally filter report to only show transactions from specific
   * Categories. If not provided, all user Categories will be included
   */
  category_ids?: ReportsFilterList<number>
  /**
   * Optionally filter report to only show transactions from specific
   * Category Types. If not provided, all user Category Types will be included
   */
  category_types?: ReportsFilterList<CategoryType>
  /**
   * Optionally filter report to only show transactions from specific
   * Category Groups. If not provided, all user Category Groups will be included
   */
  category_group_ids?: ReportsFilterList<number>
  /**
   * Optionally filter report to only show transactions from specific
   * Category Group Types. If not provided, all user Category Group Types will be included
   */
  category_group_types?: ReportsFilterList<CategoryGroupType>
  /**
   * Optionally filter report to only show transactions from specific
   * Tags. If not provided, all user Tags will be included
   */
  tag_ids?: ReportsFilterList<number>
  /**
   * Optionally filter report to only show transaction from specific Bank Accounts.
   * If not provided, all user Accounts will be included
   */
  account_ids?: ReportsFilterList<IAccount['id']>
  /**
   * Optionally filter report to only show transactions from Accounts belonging
   * to a specific user. If not provided, all user Accounts will be included
   */
  account_owner?: IUser['id']
}

/**
 * Query for Net Worth Report
 */
export interface NetWorthReportQuery {
  /**
   * The start date of the report in YYYY-MM-DD Format
   */
  start_date: string
  /**
   * The end date of the report in YYYY-MM-DD Format
   */
  end_date: string
}

/**
 * Row for Net Worth Report. Object with acc_type and
 * period keys with number values
 */
export type NetWorthReportRow = {
  /**
   * Account Type
   */
  acc_type: IAccountTypes
} & Partial<Record<string, number>>

/**
 * Results for Net Worth Report
 */
export interface NetWorthReportResults {
  /**
   * An array of periods in dataset so columns
   * can be easily rendered
   */
  periods: string[]
  /**
   * Totals Stored Against Period Key
   * Will be number type
   */
  rows: NetWorthReportRow[]
}

/**
 * Request interface for Category Spend Report
 */
interface CategorySpendReportQueryRequest {
  report_type: 'category_spend'
  query: CategorySpendReportQuery
}

/**
 * Response interface for Category Spend Report
 */
interface CategorySpendReportQueryResponse {
  report_type: 'category_spend'
  results: CategorySpendReportResults
}

/**
 * Request interface for Net Worth Report
 */
interface NetWorthReportQueryRequest {
  report_type: 'net_worth'
  query: NetWorthReportQuery
}

/**
 * Response interface for Net Worth Report
 */
interface NetWorthReportQueryResponse {
  report_type: 'net_worth'
  results: NetWorthReportResults
}

/**
 * Exports for ReportsService Command
 */
export type ReportsQueryRequest = CategorySpendReportQueryRequest | NetWorthReportQueryRequest
export type ReportsQueryResponse = CategorySpendReportQueryResponse | NetWorthReportQueryResponse
