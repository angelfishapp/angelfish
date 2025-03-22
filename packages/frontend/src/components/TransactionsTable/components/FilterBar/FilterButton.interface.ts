import type { Column, Table } from '@tanstack/react-table'

import type { TransactionRow } from '../../data'

/**
 * FilterButton Component Properties
 */
export interface FilterButtonProps {
  /**
   * TransactionTable to Render Filters For
   */
  table: Table<TransactionRow>
  /**
   * Table Column to render Filter Dropdown for
   */
  column: Column<TransactionRow, unknown>
}
