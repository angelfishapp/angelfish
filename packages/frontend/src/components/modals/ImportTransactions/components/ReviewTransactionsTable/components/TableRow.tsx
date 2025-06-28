import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import { flexRender } from "@tanstack/react-table"
import clsx from "clsx"
import React from "react"

import { CategoryLabel } from "@/components/CategoryLabel"
import type { DefaultTableRowProps } from "@/components/Table"
import type { ReconciledTransactionRow } from "../ReviewTransactionsTable.data"
import TransactionEditForm from "./TransactionEditForm"
import type { ITag } from "@angelfish/core"

/**
 * Props for the extended table row used in the transaction review table.
 */
interface ExtendedTableRowProps extends DefaultTableRowProps<ReconciledTransactionRow> {
  /** The ID of the currently expanded row, if any */
  expandedRow?: string | null

  /** All available tags to be used in the edit form */
  allTags?: ITag[]

  /**
   * Function called when the edit form is saved
   * @param transactionIndex - Index of the transaction being updated
   * @param updates - Updated transaction data
   */
  onSave?: (transactionIndex: number, updates: {
    note?: string
    tags?: Partial<ITag>[]
    isReviewed?: boolean
  }) => void

  /** Function called to close the edit form */
  onCloseEdit: () => void
}

/**
 * A table row component for the transaction reconciliation table.
 * Renders both normal and grouped rows, and optionally an editable transaction form below.
 *
 * @param {ExtendedTableRowProps} props - Props for the table row
 * @param {React.Ref<HTMLTableRowElement>} ref - Ref for the table row element
 * @returns {JSX.Element} The rendered table row
 */
export default React.forwardRef<HTMLTableRowElement, ExtendedTableRowProps>(function ReconciliationTableRow(
  { className, row, expandedRow, allTags = [], onSave, onCloseEdit }: ExtendedTableRowProps,
  ref,
) {
  const rowId = `row-${row.index}`
  const isExpanded = expandedRow === rowId

  /** Whether the current row is in edit mode */
  const isEditMode = React.useMemo(() => isExpanded, [isExpanded])

  const transactionIndex = row.index

  /**
   * Handles saving updated transaction data.
   *
   * @param {Object} updates - The updated fields
   * @param {string} [updates.note] - Updated note
   * @param {Partial<ITag>[]} [updates.tags] - Updated tags
   * @param {boolean} [updates.isReviewed] - Updated review status
   */
  const handleSave = React.useCallback(
    (updates: {
      note?: string
      tags?: Partial<ITag>[]
      isReviewed?: boolean
    }) => {
      if (transactionIndex === undefined || transactionIndex === null) {
        return
      }

      if (onSave) {
        onSave(transactionIndex, updates)
      }
    },
    [transactionIndex, onSave],
  )

  if (row.getIsGrouped()) {
    return (
      <TableRow
        ref={ref}
        selected={row.getIsSelected()}
        className={clsx(className, row.getIsExpanded() ? "expanded" : undefined, row.depth >= 1 ? "subRow" : undefined)}
      >
        <TableCell
          key={row.id}
          colSpan={row.getVisibleCells().length - 1}
          sx={{
            backgroundColor: (theme) => `${theme.palette.primary.light} !important`,
            color: (theme) => `${theme.palette.primary.contrastText} !important`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {row.getIsExpanded() ? (
              <ExpandMoreIcon className="expand-arrow" onClick={() => row.toggleExpanded()} />
            ) : (
              <ChevronRightIcon className="expand-arrow" onClick={() => row.toggleExpanded()} />
            )}
            <CategoryLabel iconSize={30} account={row.original.account} />
            <Typography sx={{ marginLeft: 1 }}>{`(${row.getLeafRows().length})`}</Typography>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <>
      <TableRow
        ref={ref}
        selected={row.getIsSelected()}
        className={clsx(
          className,
          row.getIsExpanded() ? "expanded" : undefined,
          row.depth >= 1 ? "subRow" : undefined,
          isEditMode ? "editExpanded" : undefined,
        )}
        sx={{
          backgroundColor: isEditMode ? "#f8f9fa" : "inherit",
          transition: "background-color 0.2s ease",
        }}
      >
        {row
          .getVisibleCells()
          .filter((cell) => cell.column.id !== "account_id")
          .map((cell) => (
            <TableCell
              key={cell.id}
              className={cell.column.getIsPinned() ? `isPinned ${cell.column.getIsPinned()}` : undefined}
              style={{
                width: cell.column.getSize(),
              }}
            >
              {cell.getIsAggregated()
                ? flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext())
                : cell.getIsPlaceholder()
                  ? null
                  : flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
      </TableRow>

      {isEditMode && (
        <TableRow>
          <TableCell
            colSpan={row.getVisibleCells().filter((cell) => cell.column.id !== "account_id").length}
            style={{
              padding: 0,
              backgroundColor: "#f8f9fa",
              borderTop: "2px solid #e9ecef",
            }}
          >
            <TransactionEditForm
              transaction={row.original.transaction}
              allTags={allTags}
              onSave={handleSave}
              onClose={onCloseEdit}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  )
})
