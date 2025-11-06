import type { CategorySpendReportResults } from '@angelfish/core'

/**
 * Interface for IncomeAndExpensesSankey Component Props
 */
export interface IncomeAndExpensesSankeyProps {
  /**
   * Currency to display in chart, should be book's
   * default ISO currency
   */
  currency: string
  /**
   * Data from Reports API
   */
  data: CategorySpendReportResults
  /**
   * No of periods to show till current month
   */
  periods?: number
}
