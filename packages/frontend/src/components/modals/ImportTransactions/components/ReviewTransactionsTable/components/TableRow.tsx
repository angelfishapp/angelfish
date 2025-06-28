import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import React from 'react'

import { CategoryLabel } from '@/components/CategoryLabel'
import type { DefaultTableRowProps } from '@/components/Table'
import type { ReconciledTransactionRow } from '../ReviewTransactionsTable.data'
import TransactionEditForm from './TransactionEditForm'
import type { ITag } from "@angelfish/core"

/**
 * Table Row Component to use in the ReviewTransactionsTable
 **/

interface ExtendedTableRowProps extends DefaultTableRowProps<ReconciledTransactionRow> {
  expandedRow?: string | null
  accountsWithRelations?: any[]
  allTags?: ITag[] // Add allTags prop
  onUpdate?: (rowIndex: number, updates: any) => void
  onCloseEdit?: () => void
}

/**
 * Default TableRow for TransactionTable
 */
export default React.forwardRef<HTMLTableRowElement, ExtendedTableRowProps>(
  function ReconciliationTableRow(
    {
      className,
      row,
      expandedRow,
      allTags = [], // Default empty array
      onUpdate,
    }: ExtendedTableRowProps,
    ref,
  ) {
    // Fix: Use row.index instead of row.id for consistency
    const rowId = `row-${row.index}`
    const isExpanded = expandedRow === rowId

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
              <Typography sx={{ marginLeft: 1 }}>{`(${row.getLeafRows().length})`}</Typography>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    // Render the main row and expanded edit form
    return (
      <>
        <TableRow
          ref={ref}
          selected={row.getIsSelected()}
          className={clsx(
            className,
            row.getIsExpanded() ? 'expanded' : undefined,
            row.depth >= 1 ? 'subRow' : undefined,
            isExpanded ? 'editExpanded' : undefined,
          )}
          sx={{
            backgroundColor: isExpanded ? '#f8f9fa' : 'inherit',
          }}
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

        {/* Expanded Edit Form Row */}
        {isExpanded && (
          <TableRow>
            <TableCell
              colSpan={row.getVisibleCells().filter((cell) => cell.column.id !== 'account_id').length}
              style={{ padding: 0, backgroundColor: '#f8f9fa' }}
            >
              <TransactionEditForm
                transaction={row.original.transaction}
                allTags={allTags} // Pass allTags to edit form
                onUpdate={(updates) => onUpdate?.(row.index, updates)}
              />
            </TableCell>
          </TableRow>
        )}
      </>
    )
  },
)