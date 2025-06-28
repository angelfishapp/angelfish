import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import type { ColumnDef } from '@tanstack/react-table'
import { isEqual } from 'lodash'
import React, { type JSX } from 'react'

import { CurrencyLabel } from '@/components/CurrencyLabel'
import { CategoryField } from '@/components/forms/CategoryField'
import { Table } from '@/components/Table'

import { Edit as EditIcon } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import HeaderRow from './components/TableHeaderGroup'
import TableRow from './components/TableRow'
import type { ReconciledTransactionRow } from './ReviewTransactionsTable.data'
import { flattenRowData, getSelectedRowState } from './ReviewTransactionsTable.data'
import type { ReviewTransactionsTableProps } from './ReviewTransactionsTable.interface'
// TO-DO : this the only thing we need to fix it's import
import type { ITag } from '@angelfish/core'
import { tags as tagsData } from '@angelfish/tests/fixtures'

/**
 * Renders a chip representing the status of a transaction.
 * @param {"new" | "transfer" | "duplicate"} status - The reconciliation status of the transaction
 * @returns {JSX.Element}
 */
function renderStatusTag(status: 'new' | 'transfer' | 'duplicate') {
  switch (status) {
    case 'transfer':
      return <Chip label="Transfer" color="warning" size="small" />
    case 'duplicate':
      return <Chip label="Duplicate" color="error" size="small" />
    default:
      return <Chip label="New" color="success" size="small" />
  }
}

/**
 * Displays a table for reviewing and editing reconciled transactions.
 *
 * @param {ReviewTransactionsTableProps} props - Props for the table
 * @returns {JSX.Element}
 */
export default function ReviewTransactionsTable({
  accountsWithRelations,
  transactions,
  onUpdateTransactions,
  scrollElement,
}: ReviewTransactionsTableProps): JSX.Element {
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null)

  const [rows, initialSelectedRows] = React.useMemo(() => {
    return [flattenRowData(transactions, accountsWithRelations), getSelectedRowState(transactions)]
  }, [accountsWithRelations, transactions])

  /**
   * Handles updates made from the transaction edit form.
   *
   * @param {number} transactionIndex - Index of the transaction to update
   * @param {object} updates - Fields to update
   */
  const handleSaveTransaction = React.useCallback(
    (
      transactionIndex: number,
      updates: {
        note?: string
        tags?: Partial<ITag>[]
        isReviewed?: boolean
      },
    ) => {
      if (transactionIndex < 0 || transactionIndex >= transactions.length) return

      const updatedTransactions = transactions.map((transaction, index) => {
        if (index === transactionIndex) {
          const updatedTransaction = {
            ...transaction,
            ...(updates.isReviewed !== undefined && { is_reviewed: updates.isReviewed }),
            line_items: transaction.line_items.map((lineItem, lineIndex) => {
              if (lineIndex === 0) {
                return {
                  ...lineItem,
                  ...(updates.note !== undefined && { note: updates.note }),
                  ...(updates.tags !== undefined && { tags: updates.tags }),
                }
              }
              return lineItem
            }),
          }
          return updatedTransaction
        }
        return transaction
      })

      onUpdateTransactions(updatedTransactions)
    },
    [transactions, onUpdateTransactions],
  )

  /**
   * Handles account category updates from the category field.
   *
   * @param {number} transactionIndex - Index of the transaction
   * @param {string | null} newAccountId - Updated account ID
   */
  const handleTransactionUpdate = React.useCallback(
    (transactionIndex: number, newAccountId: string | null) => {
      const updatedTransactions = transactions.map((transaction, index) => {
        if (index === transactionIndex) {
          return {
            ...transaction,
            line_items: transaction.line_items.map((lineItem) => ({
              ...lineItem,
              account_id: newAccountId ? Number(newAccountId) : null,
            })),
          }
        }
        return transaction
      })
      onUpdateTransactions(updatedTransactions)
    },
    [transactions, onUpdateTransactions],
  )

  /**
   * Handles double-clicking on a table row to expand/collapse it.
   *
   * @param {React.MouseEvent} event
   * @param {object} row - The clicked row
   */
  const handleRowDoubleClick = React.useCallback(
    (
      event: React.MouseEvent<Element, MouseEvent>,
      row: { id: string; index: number; original: ReconciledTransactionRow },
    ) => {
      const rowId = `row-${row.index}`
      setExpandedRow(expandedRow === rowId ? null : rowId)
    },
    [expandedRow],
  )

  /**
   * Column definitions for the transactions table.
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
        cell: ({ row }) =>
          row.original.date?.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
      },
      {
        id: 'title',
        header: 'Payee',
        accessorKey: 'title',
        size: 250,
        cell: ({ row }) => {
          const hasNotes = row.original.transaction.line_items?.[0]?.note
          const hasTags = (row.original.transaction.line_items?.[0]?.tags?.length ?? 0) > 0
          const isReviewed = row.original.transaction.is_reviewed

          return (
            <div>
              <div style={{ fontWeight: isReviewed ? 'normal' : 'bold' }}>
                {row.original.title}
                {hasNotes && <span style={{ color: '#1976d2', marginLeft: 4 }}>📝</span>}
                {hasTags && <span style={{ color: '#ed6c02', marginLeft: 4 }}>🏷️</span>}
                {isReviewed && <span style={{ color: '#2e7d32', marginLeft: 4 }}>✓</span>}
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
          const currentAccountId = row.original.transaction.line_items?.[0]?.account_id
          const currentCategory =
            accountsWithRelations.find((acc) => acc.id === currentAccountId) || null

          return (
            <CategoryField
              margin="none"
              accountsWithRelations={accountsWithRelations}
              fullWidth
              value={currentCategory}
              onChange={(account) => {
                const newAccountId =
                  account && typeof account === 'object' && 'id' in account
                    ? String(account.id)
                    : typeof account === 'string'
                      ? account
                      : null

                if (currentAccountId !== Number(newAccountId)) {
                  handleTransactionUpdate(row.index, newAccountId)
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
        cell: ({ row }) => <CurrencyLabel value={row.original.amount} />,
      },
      {
        id: 'account_id',
        header: 'Account',
        accessorKey: 'account_id',
      },
      {
        id: 'actions',
        header: '',
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
                color: expandedRow === rowId ? 'primary.main' : 'text.secondary',
                backgroundColor: expandedRow === rowId ? 'primary.light' : 'transparent',
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )
        },
      },
    ]
  }, [accountsWithRelations, expandedRow, handleTransactionUpdate])

  return (
    <Table
      sx={{ tableLayout: 'auto' }}
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
          allTags={tagsData}
          onSave={handleSaveTransaction}
          onCloseEdit={() => setExpandedRow(null)}
        />
      )}
      initialState={{
        sorting: [{ id: 'date', desc: true }],
        grouping: ['account_id'],
        rowSelection: initialSelectedRows,
      }}
      onStateChange={({ rowSelection }) => {
        if (!isEqual(rowSelection, initialSelectedRows)) {
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
