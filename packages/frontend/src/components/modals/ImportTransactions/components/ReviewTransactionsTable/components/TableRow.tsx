import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typeography from '@mui/material/Typography'
import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import React from 'react'

import { CategoryLabel } from '@/components/CategoryLabel'
import type { DefaultTableRowProps } from '@/components/Table'
import type { ReconciledTransactionRow } from '../ReviewTransactionsTable.data'

/**
 * Table Row Component to use in the ReviewTransactionsTable
 **/
/**
 * Default TableRow for TransactionTable
 */
export default React.forwardRef<
  HTMLTableRowElement,
  DefaultTableRowProps<ReconciledTransactionRow>
>(function ReconiliationTableRow(
  { className, row }: DefaultTableRowProps<ReconciledTransactionRow>,
  ref,
) {
  if (row.getIsGrouped()) {
    return (
      <TableRow
        ref={ref}
        selected={row.getIsSelected()}
        className={clsx(
          className,
          row.getIsExpanded() ? 'expanded' : undefined,
          row.depth >= 1 ? 'subRow' : undefined,
        )}
      >
        <TableCell
          key={row.id}
          colSpan={row.getVisibleCells().length - 1}
          sx={{
            backgroundColor: (theme) => `${theme.palette.primary.light} !important`,
            color: (theme) => `${theme.palette.primary.contrastText} !important`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {row.getIsExpanded() ? (
              <ExpandMoreIcon className="expand-arrow" onClick={() => row.toggleExpanded()} />
            ) : (
              <ChevronRightIcon className="expand-arrow" onClick={() => row.toggleExpanded()} />
            )}{' '}
            <CategoryLabel iconSize={30} account={row.original.account} />
            <Typeography sx={{ marginLeft: 1 }}>{`(${row.getLeafRows().length})`}</Typeography>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  // Render the row
  return (
    <TableRow
      ref={ref}
      selected={row.getIsSelected()}
      className={clsx(
        className,
        row.getIsExpanded() ? 'expanded' : undefined,
        row.depth >= 1 ? 'subRow' : undefined,
      )}
    >
      {row
        .getVisibleCells()
        .filter((cell) => cell.column.id !== 'account_id')
        .map((cell) => (
          <TableCell
            key={cell.id}
            className={
              cell.column.getIsPinned() ? `isPinned ${cell.column.getIsPinned()}` : undefined
            }
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
})
