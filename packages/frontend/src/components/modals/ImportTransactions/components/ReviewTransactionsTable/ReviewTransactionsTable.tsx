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
  // Flatten Row Data and select all rows with import==true
  const [rows, initialSelectedRows] = React.useMemo(() => {
    return [flattenRowData(transactions, accountsWithRelations), getSelectedRowState(transactions)]
  }, [accountsWithRelations, transactions])

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
        id: 'title',
        header: 'Payee',
        accessorKey: 'title',
        size: 300,
        cell: ({ row }) => {
          return (
            <>
              {row.original.title}
              <br />
              {renderStatusTag(row.original.reconciliation)}
            </>
          )
        },
      },
      {
        id: 'category',
        header: 'Category',
        accessorKey: 'category',
        size: 330,
        cell: ({ row }) => {
          return (
            <CategoryField
              margin="none"
              accountsWithRelations={accountsWithRelations}
              fullWidth
              value={row.original.category || null}
              onChange={(account) => {
                if (typeof account === 'object') {
                  const updatedTransaction = updateTransaction(rows[row.index].transaction, {
                    category_id: account ? account.id : null,
                  }) as ReconciledTransaction
                  onUpdateTransactions(
                    rows.map((transaction, index) => {
                      return index === row.index ? updatedTransaction : transaction.transaction
                    }),
                  )
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
    ]
  }, [accountsWithRelations, onUpdateTransactions, rows])

  // Render
  return (
    <Table
      columns={columns}
      data={rows}
      scrollElement={scrollElement}
      estimateSize={() => 40}
      stickyHeader
      displayFooter={false}
      enableRowSelection={true}
      enableMultiRowSelection={true}
      enableSorting={true}
      expandAllRows={true}
      HeaderElement={HeaderRow}
      RowElement={TableRow}
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
      disableRowClick={true} // Disable row click
      disableRowDoubleClick={true} // Disable row double click
      disableRowContextMenu={true} // Disable context menu
    />
  )
}
