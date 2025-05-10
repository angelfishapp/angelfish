import type { Column, Table } from '@tanstack/react-table'

import type { TransactionRow } from '../../data'

/**
 * FilterView Component Properties
 */
export interface FilterViewProps {
  /**
   * TransactionTable to render Filter View for
   */
  table: Table<TransactionRow>
  /**
   * Table Column to render Filter View for
   */
  column: Column<TransactionRow, unknown>
  /**
   * Callback to close Popover
   */
  onClose: () => void
}
