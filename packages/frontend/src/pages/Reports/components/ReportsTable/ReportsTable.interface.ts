import type { ReportsData } from '@angelfish/core'

/**
 * ReportsTable Component Properties
 */

export interface ReportsTableProps {
  /**
   * Report results data from the ReportsService
   * IPC API
   */
  data: ReportsData
  /**
   * Callback function to handle clicking on cell value on table so user
   * can see transactions for that period and category or group.
   */
  onClick: (period: string, name: string, id: number, isCategoryGroup: boolean) => void
}
