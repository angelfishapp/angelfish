import type { CategorySpendReportQuery, IAccount, ITag } from '@angelfish/core'

/**
 * ReportsSettingsDrawer Properties
 */
export interface ReportsSettingsDrawerProps {
  /**
   * Accounts with relations to display in the form
   */
  accountsWithRelations: IAccount[]
  /**
   * Initial query to populate form
   */
  initialQuery: CategorySpendReportQuery
  /**
   * Show (true) or hide (false) the drawer
   * @default true
   */
  open?: boolean
  /**
   * Callback triggered when closing drawer
   */
  onClose: () => void
  /**
   * Callback to update report query
   */
  onSave: (reportQuery: CategorySpendReportQuery) => void
  /**
   * Tags to filter the report by
   */
  tags: ITag[]
}
