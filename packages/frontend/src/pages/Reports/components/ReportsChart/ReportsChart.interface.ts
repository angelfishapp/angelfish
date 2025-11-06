import type { CategorySpendReportResults } from '@angelfish/core'

/**
 * ReportsChart Component Properties
 */
export interface ReportsChartProps {
  /**
   * The column/period width of the Table so the graph can line up
   */
  chartPeriodWidth: number
  /**
   * Report results data from the ReportsService
   * IPC API
   */
  data: CategorySpendReportResults
}
