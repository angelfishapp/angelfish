import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import type { Row, Table } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import React from 'react'

/**
 * Default Table Row Component Props
 */
export interface DefaultTableRowProps<T> {
  /**
   * Optional class name to apply to the row
   */
  className?: string
  /**
   * The react-table Row to render
   */
  row: Row<T>
  /**
   * Optional Reference to react-table instance if needed
   */
  table: Table<T>
}

/**
 * Default TableRow which can be used to render react-table Rows
 **/
export default React.forwardRef<HTMLTableRowElement, DefaultTableRowProps<any>>(
  function DefaultTableRow<T>(
    { className, row }: DefaultTableRowProps<T>,
    ref: React.Ref<HTMLTableRowElement>,
  ) {
    // Render the row
    return (
      <TableRow
        ref={ref}
        selected={row.getIsSelected()}
        data-row-id={row.id}
        className={clsx(
          className,
          row.getIsExpanded() ? 'expanded' : undefined,
          row.depth >= 1 ? 'subRow' : undefined,
        )}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            className={clsx(
              `col-id-${cell.column.id}`,
              cell.column.getIsPinned() ? `isPinned ${cell.column.getIsPinned()}` : undefined,
            )}
            style={{
              width: cell.column.getSize(),
            }}
          >
            {cell.getIsAggregated()
              ? // If the cell is aggregated, use the Aggregated
                // renderer for cell
                flexRender(
                  cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                  cell.getContext(),
                )
              : cell.getIsPlaceholder()
                ? null // For cells with repeated values, render null
                : // Otherwise, just render the regular cell
                  flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    )
  },
)
