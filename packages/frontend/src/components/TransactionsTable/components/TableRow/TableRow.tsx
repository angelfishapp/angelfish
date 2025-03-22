import Collapse from '@mui/material/Collapse'
import clsx from 'clsx'
import React from 'react'

import type { DefaultTableRowProps } from '@/components/Table'
import { DefaultTableRow } from '@/components/Table'
import type { TransactionRow } from '../../data'
import TableRowEdit from './TableRowEdit'

/**
 * Default TableRow for TransactionTable
 */
export default React.forwardRef<HTMLTableRowElement, DefaultTableRowProps<TransactionRow>>(
  function TableRow({ className, row, table }: DefaultTableRowProps<TransactionRow>, ref) {
    // Only render parent rows
    if (row.depth > 0) {
      return null
    }

    // If Table is in Edit Mode, render TableRowEdit
    if (table.options.meta?.transactionsTable?.isEditMode(row.id) || row.original.isNew) {
      return <TableRowEdit className={className} row={row} table={table} />
    }

    // Render row - show subrows in collapse component if any
    return (
      <React.Fragment>
        <DefaultTableRow className={className} row={row} table={table} ref={ref} />
        {row.subRows?.length > 1 && (
          <tr onContextMenu={(event) => event.preventDefault()}>
            <td
              colSpan={row.getVisibleCells().length}
              style={{
                padding: 0,
              }}
            >
              <Collapse in={row.getIsExpanded()} timeout="auto">
                <table
                  className="subTable"
                  style={{
                    width: '100%',
                    tableLayout: 'fixed',
                    borderSpacing: 0,
                  }}
                >
                  <tbody>
                    {row.subRows?.map((subRow) => (
                      <DefaultTableRow
                        key={subRow.id}
                        className={clsx(
                          className,
                          row.getIsSelected() ? 'Mui-selected' : undefined,
                        )}
                        row={subRow}
                        table={table}
                        ref={ref}
                      />
                    ))}
                  </tbody>
                </table>
              </Collapse>
            </td>
          </tr>
        )}
      </React.Fragment>
    )
  },
)
