import type { CategorySpendReportData } from '@angelfish/core'

/**
 * ReportsChart Component Properties
 */
export interface ReportsChartProps {
  /**
   * Report results data from the ReportsService
   * IPC API
   */
  data: CategorySpendReportData
  chartWidth: number
}
