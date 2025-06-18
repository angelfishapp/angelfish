import type { CategorySpendReportQuery } from '@angelfish/core'

/**
 * ReportsSettingsDrawer Properties
 */
export interface ReportsSettingsDrawerProps {
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
}
