import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import type { SortDirection } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import React from 'react'

import type { TableHeaderGroupProps } from '@/components/Table'
import type { ReconciledTransactionRow } from '../ReviewTransactionsTable.data'

/**
 * Table Header Group Component used to render a header group in the table.
 * Provides support for sorting and resizing if enabled
 */
export default React.forwardRef<
  HTMLTableRowElement,
  TableHeaderGroupProps<ReconciledTransactionRow>
>(function ReconciliationTableHeader<ReconciledTransactionRow>(
  {
    headerGroup,
    className,
    isFooterGroup = false,
  }: TableHeaderGroupProps<ReconciledTransactionRow>,
  ref: React.Ref<HTMLTableRowElement>,
) {
  return (
    <TableRow className={className} ref={ref}>
      {headerGroup.headers
        .filter((header) => header.id !== 'account_id')
        .map((header) => (
          <TableCell
            key={header.id}
            colSpan={header.colSpan}
            className={
              header.column.getIsPinned() ? `isPinned ${header.column.getIsPinned()}` : undefined
            }
            style={{
              width: header.getSize(),
            }}
          >
            {header.column.getCanSort() && !isFooterGroup ? (
              <TableSortLabel
                active={header.column.getIsSorted() ? true : false}
                direction={(header.column.getIsSorted() as SortDirection) == 'asc' ? 'asc' : 'desc'}
                className="sortable"
                onClick={
                  header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined
                }
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableSortLabel>
            ) : (
              <>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      isFooterGroup
                        ? header.column.columnDef.footer
                        : header.column.columnDef.header,
                      header.getContext(),
                    )}
              </>
            )}
            {header.column.getCanResize() && !isFooterGroup && (
              <div
                {...{
                  onMouseDown: header.getResizeHandler(),
                  onTouchStart: header.getResizeHandler(),
                  className: clsx(
                    'resizer',
                    header.column.getIsResizing() ? 'isResizing' : undefined,
                  ),
                  id: `resizer-${header.id}`,
                }}
              />
            )}
          </TableCell>
        ))}
    </TableRow>
  )
})
