import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import type { ColumnDef } from '@tanstack/react-table'
import { isEqual } from 'lodash'
import React from 'react'

import { CurrencyLabel } from '@/components/CurrencyLabel'
import { CategoryField } from '@/components/forms/CategoryField'
import { Table } from '@/components/Table'
import { updateTransaction } from '@angelfish/core'
import type { ReconciledTransaction } from '@angelfish/core/src/types'

import HeaderRow from './components/TableHeaderGroup'
import TableRow from './components/TableRow'
import type { ReconciledTransactionRow } from './ReviewTransactionsTable.data'
import { flattenRowData, getSelectedRowState } from './ReviewTransactionsTable.data'
import type { ReviewTransactionsTableProps } from './ReviewTransactionsTable.interface'
import IconButton from "@mui/material/IconButton"
import { Edit as EditIcon } from "@mui/icons-material"
import { tags as tagsData } from '@angelfish/tests/fixtures'

/**
 * Render the status tag for the transaction
 */
function renderStatusTag(status: 'new' | 'transfer' | 'duplicate') {
  switch (status) {
    case 'transfer':
      return <Chip label="Transfer" color="warning" size="small" />
    case 'duplicate':
      return <Chip label="Duplicate" color="error" size="small" />
    default:
      // Return new tag for anything else
      return <Chip label="New" color="success" size="small" />
  }
}

/**
 * Show a table with the transactions to be imported so user can review and edit any
 * reconciliation issues before importing them.
 */
export default function ReviewTransactionsTable({
  accountsWithRelations,
  transactions,
  onUpdateTransactions,
  scrollElement,
}: ReviewTransactionsTableProps) {
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null)

  // Flatten Row Data and select all rows with import==true
  const [rows, initialSelectedRows] = React.useMemo(() => {
    return [flattenRowData(transactions, accountsWithRelations), getSelectedRowState(transactions)]
  }, [accountsWithRelations, transactions])

  // Handler for updating individual transactions
  const handleEditTransaction = (rowIndex: number, updates: Partial<ReconciledTransaction>) => {
    const updatedTransaction = updateTransaction(rows[rowIndex].transaction, updates) as ReconciledTransaction

    onUpdateTransactions(
      rows.map((transaction, index) => {
        return index === rowIndex ? updatedTransaction : transaction.transaction
      }),
    )
  }

  // Handler for double-click to expand/collapse rows
  const handleRowDoubleClick = (event: React.MouseEvent, row: any) => {
    setExpandedRow(expandedRow === row.id ? null : row.id)
  }

  /**
   * Define the columns for the table
   */
  const columns = React.useMemo<ColumnDef<ReconciledTransactionRow>[]>(() => {
    return [
      {
        id: 'select',
        size: 45,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            color="secondary"
            sx={{ color: 'white' }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <Checkbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
      },
      {
        id: 'date',
        header: 'Date',
        accessorKey: 'date',
        size: 105,
        cell: ({ row }) => {
          return row.original.date?.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        },
      },
      {
        id: "title",
        header: "Payee",
        accessorKey: "title",
        size: 250,
        cell: ({ row }) => {
          // Updated to check for new field names
          const hasNotes = row.original.transaction.note || row.original.transaction.notes
          const hasTags = row.original.transaction.tags?.length > 0
          const isReviewed = row.original.transaction.is_reviewed

          return (
            <div>
              <div style={{ fontWeight: isReviewed ? "normal" : "bold" }}>
                {row.original.title}
                {hasNotes && <span style={{ color: "#1976d2", marginLeft: 4 }}>📝</span>}
                {hasTags && <span style={{ color: "#ed6c02", marginLeft: 4 }}>🏷️</span>}
                {isReviewed && <span style={{ color: "#2e7d32", marginLeft: 4 }}>✓</span>}
              </div>
              {renderStatusTag(row.original.reconciliation)}
            </div>
          )
        },
      },
      {
        id: 'category',
        header: 'Category',
        accessorKey: 'category',
        size: 200,
        cell: ({ row }) => {
          return (
            <CategoryField
              margin="none"
              accountsWithRelations={accountsWithRelations}
              fullWidth
              value={row.original.category || null}
              onChange={(account) => {
                if (typeof account === 'object') {
                  handleEditTransaction(row.index, {
                    category_id: account ? account.id : null,
                  })
                }
              }}
            />
          )
        },
      },
      {
        id: 'amount',
        header: 'Amount',
        accessorKey: 'amount',
        size: 130,
        cell: ({ row }) => {
          return <CurrencyLabel value={row.original.amount} />
        },
      },
      {
        id: 'account_id',
        header: 'Account',
        accessorKey: 'account_id',
      },
      {
        id: "actions",
        header: "",
        size: 50,
        cell: ({ row }) => {
          const rowId = `row-${row.index}`
          return (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                setExpandedRow(expandedRow === rowId ? null : rowId)
              }}
              sx={{
                color: expandedRow === rowId ? "primary.main" : "text.secondary",
                backgroundColor: expandedRow === rowId ? "primary.light" : "transparent",
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )
        },
      },
    ]
  }, [accountsWithRelations, expandedRow, handleEditTransaction])

  // Render
  return (
    <Table
      sx={{ tableLayout: "auto" }}
      columns={columns}
      data={rows}
      scrollElement={scrollElement}
      estimateSize={() => (expandedRow ? 200 : 40)}
      stickyHeader
      displayFooter={false}
      enableRowSelection={true}
      enableMultiRowSelection={true}
      enableSorting={true}
      expandAllRows={true}
      HeaderElement={HeaderRow}
      RowElement={(props) => (
        <TableRow
          {...props}
          expandedRow={expandedRow}
          accountsWithRelations={accountsWithRelations}
          allTags={tagsData} // just for testing Pass tags data to TableRow
          onUpdate={handleEditTransaction}
          onCloseEdit={() => setExpandedRow(null)}
        />
      )}
      initialState={{
        sorting: [{ id: 'date', desc: true }],
        grouping: ['account_id'],
        rowSelection: initialSelectedRows,
      }}
      onStateChange={({ rowSelection }) => {
        // Only execute if rowSelection has changed from initial state
        if (!isEqual(rowSelection, initialSelectedRows)) {
          // Update the import flag on the transactions
          onUpdateTransactions(
            rows.map((row, index) => {
              const transaction = row.transaction
              transaction.import = index in rowSelection ? rowSelection[index] : false
              return transaction
            }),
          )
        }
      }}
      onRowDoubleClick={handleRowDoubleClick}
      disableRowClick={true}
      disableRowDoubleClick={false}
      disableRowContextMenu={true}
    />
  )
}