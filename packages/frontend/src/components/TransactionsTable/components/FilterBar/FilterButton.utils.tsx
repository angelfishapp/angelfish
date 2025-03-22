import type { Column, Table } from '@tanstack/react-table'

import type { TransactionRow } from '../../data'
import {
  AmountFilterView,
  CategoryFilterView,
  DateFilterView,
  IsReviewedFilterView,
  PayeeFilterView,
  TagsFilterView,
} from '../FilterViews'

/**
 * Helper Function to Select FilterView Component
 * To Render in Button Dropdown
 *
 * @param table           The TransactionTable to Render Filters For
 * @param column          The Table Column to render Filter Dropdown for
 * @param onClose         Callback to Close Popover
 * @returns               React Component to render
 */
export function renderFilterView(
  table: Table<TransactionRow>,
  column: Column<TransactionRow, unknown>,
  onClose: () => void,
) {
  switch (column.id) {
    case 'amount':
      return <AmountFilterView table={table} column={column} onClose={onClose} />
    case 'category':
      return <CategoryFilterView table={table} column={column} onClose={onClose} />
    case 'date':
      return <DateFilterView table={table} column={column} onClose={onClose} />
    case 'title':
      return <PayeeFilterView table={table} column={column} onClose={onClose} />
    case 'tags':
      return <TagsFilterView table={table} column={column} onClose={onClose} />
    case 'is_reviewed':
      return <IsReviewedFilterView table={table} column={column} onClose={onClose} />
    default:
      return <div>{column.id} Not Found</div>
  }
}
