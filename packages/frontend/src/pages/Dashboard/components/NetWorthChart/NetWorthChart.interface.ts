import type { NetWorthReportResults } from '@angelfish/core'

/**
 * Interface for NetWorthChart Component Props
 */
export interface NetWorthChartProps {
  /**
   * Currency to display in chart, should be book's
   * default ISO currency
   */
  currency: string
  /**
   * Data from Reports API
   */
  data: NetWorthReportResults
}
