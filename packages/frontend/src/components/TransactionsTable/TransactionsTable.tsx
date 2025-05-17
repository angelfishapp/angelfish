import { type Table as ReactTable, type RowData } from '@tanstack/react-table'
import React from 'react'

import { CurrencyLabel } from '@/components/CurrencyLabel'
import type { TableProps } from '@/components/Table'
import { handleRowContextMenu, handleRowSelection } from '@/components/Table'
import type { ITransaction, UpdateTransactionProperties } from '@angelfish/core'
import { createNewTransaction, duplicateTransaction, updateTransactions } from '@angelfish/core'
import { ContextMenu } from './components/ContextMenu'
import { FilterBar } from './components/FilterBar'
import TableRow from './components/TableRow/TableRow'
import type { TransactionRow } from './data'
import {
  buildColumns,
  buildTransactionRow,
  buildTransactionRows,
  getRecentCategories,
} from './data'
import type { TransactionsTableProps } from './TransactionsTable.interface'
import { StyledTransactionTable } from './TransactionsTable.styles'

/*
 * Extend react-table to add custom metadata for TransactionsTable
 */
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    transactionsTable?: {
      /**
       * Parent bank account of transactions if viewing single account
       */
      account: TransactionsTableProps['account']
      /**
       * All categories/accounts with relations from database
       */
      accountsWithRelations: TransactionsTableProps['accountsWithRelations']
      /**
       * Recent categories/accounts used in transactions
       */
      recentCategories: TransactionsTableProps['accountsWithRelations']
      /**
       * All tags available in database
       */
      allTags: TransactionsTableProps['allTags']
      /**
       * Is the row currently in edit mode
       *
       * @param id  Row ID
       * @returns   True - Row is in edit mode, False - Row is not in edit mode
       */
      isEditMode: (id: string) => boolean
      /**
       * Toggle edit mode for row. If row is already in edit mode, it will be removed from edit mode unless
       * value is specifically set to true
       *
       * @param id      The row ID to toggle edit mode for
       * @param value   Optional value to set edit mode to for row, if not provided will toggle edit mode
       */
      toggleEditMode: (id: string, value?: boolean) => void
      /**
       * Insert a new row into the table in edit mode to create new transaction
       *
       * @param date  Optional date to set for new transaction, defaults to current date
       */
      insertNewRow: (date?: Date) => void
      /**
       * Remove a new row from the table if one is currently added
       */
      removeNewRow: () => void
      /**
       * Bulk update an array of rows with new properties
       *
       * @param rows        Array of rows to update
       * @param properties  Properties to update on rows
       */
      updateRows: (rows: TData[], properties: UpdateTransactionProperties) => void
      /**
       * Duplicate an array of rows in the table
       *
       * @param rows  The Table rows to duplicate
       */
      duplicateRows: (rows: TData[]) => void
      /**
       * Delete an array of rows
       *
       * @param rows  The Table rows to delete
       */
      deleteRows: (rows: TData[]) => void
      /**
       * Callback for when a new category is created in CategoryField
       */
      onCreateCategory: TransactionsTableProps['onCreateCategory']
      /**
       * Callback to start Import Transactions Modal
       */
      onImportTransactions?: TransactionsTableProps['onImportTransactions']
    }
  }
}

/**
 * Provides DataGrid Table to display list of Transactions and allow user to select
 * and Edit them.
 *
 * - Provides right-click context menu and multi-row selection so user can quickly edit multiple rows
 *   at once
 * - Uses localstorage to save view settings such as column visibility and column widths if the
 *   user adjusts them so the table will be the same when they return when `id` provided.
 * - Can be embedded in drawer or full screen page using `variant` prop
 * - Provides filter bar at top for editing table settings, adding new transactions, and filtering the table
 */
export default function TransactionsTable({
  account,
  accountsWithRelations,
  columns,
  onCreateCategory,
  onDeleteTransaction,
  onSaveTransactions,
  onImportTransactions,
  scrollElement,
  showFilterBar = false,
  allTags,
  transactions,
  id,
  variant = 'raised',
}: TransactionsTableProps) {
  // Component State
  const showFooter = (account && account.acc_start_balance != 0) || false
  // Keep track of rows which are in edit state when double clicked
  const [editRows, setEditRows] = React.useState<Record<string, boolean>>({})
  // Hold new row if creating new transaction so we can merge it into transactionRows
  // This also ensures only one new row can be created at a time
  const [newRow, setNewRow] = React.useState<TransactionRow | undefined>(undefined)

  // Setup columns and normalise table data
  const displayColumns = React.useMemo(() => buildColumns(columns), [columns])
  const transactionRows = React.useMemo(
    () => buildTransactionRows(transactions, accountsWithRelations),
    [transactions, accountsWithRelations],
  )
  const recentCategories = React.useMemo(
    () => getRecentCategories(transactionRows),
    [transactionRows],
  )

  // React-Table State
  const initialState: TableProps<TransactionRow>['initialState'] = React.useMemo(() => {
    // Load view settings from localStorage if id given
    if (id) {
      const persistedSettings = localStorage.getItem(`${id}-transaction-table`) ?? '{}'
      const settings = JSON.parse(persistedSettings)
      if (!!Object.keys(settings).length) {
        return {
          sorting: [{ id: 'date', desc: true }],
          columnSizing: settings.columnSizing,
          columnVisibility: settings.columnVisibility,
        }
      }
    }
    // By default sort by date descending
    return {
      sorting: [{ id: 'date', desc: true }],
    }
  }, [id])
  const [table, setTable] = React.useState<ReactTable<TransactionRow> | undefined>(undefined)

  // Render
  return (
    <StyledTransactionTable
      tableVarient={variant}
      data={[...transactionRows, ...(newRow !== undefined ? [newRow] : [])]}
      columns={displayColumns}
      scrollElement={scrollElement}
      estimateSize={() => 40}
      scrollMarginAdjustment={94}
      overscan={10}
      initialState={initialState}
      enableSorting={true}
      enableSortingRemoval={false}
      enableMultiSort={false}
      enableRowSelection={true}
      enableMultiRowSelection={true}
      enableColumnResizing={true}
      enableColumnFilters={true}
      enableGlobalFilter={true}
      enableHiding={true}
      enableExpanding={true}
      stickyHeader={true}
      globalFilterFn="includesString"
      maxLeafRowFilterDepth={0}
      displayFooter={showFooter}
      size="small"
      EmptyView={<>No Transaction Data</>}
      RowElement={TableRow}
      onRowClick={(event, row, tableInstance) => {
        // Stop clicking on edit rows from selecting them
        if (row.id in editRows) return
        handleRowSelection(event, row, tableInstance)
      }}
      onRowDoubleClick={(_, row) => {
        // Toggle Edit Mode for Row if row already isn't in edit mode
        if (row.id in editRows) return
        table?.options.meta?.transactionsTable?.toggleEditMode(row.id)
      }}
      onRowContextMenu={(event, row, tableInstance) => {
        // Disable context menu on edit rows
        if (row.id in editRows) return { top: 0, left: 0 }
        return handleRowContextMenu(event, row, tableInstance)
      }}
      getSubRows={(row) => (row.isSplit ? row.rows : undefined)}
      FilterBarElement={showFilterBar ? FilterBar : undefined}
      FooterElement={({ headerGroup }) => {
        return (
          <tr>
            <td
              colSpan={headerGroup.headers.length}
              style={{ padding: 5, fontWeight: 700, textAlign: 'center' }}
            >
              Starting Balance:{' '}
              <CurrencyLabel
                value={account?.acc_start_balance ?? 0}
                currency={account?.acc_iso_currency}
              />
            </td>
          </tr>
        )
      }}
      ContextMenuElement={ContextMenu}
      onStateChange={(state, reactTable) => {
        setTable(reactTable)
        // Persist view settings to localStorage if id given
        if (id) {
          localStorage.setItem(
            `${id}-transaction-table`,
            JSON.stringify({
              columnSizing: state.columnSizing,
              columnVisibility: state.columnVisibility,
            }),
          )
        }
      }}
      meta={{
        transactionsTable: {
          account,
          accountsWithRelations,
          recentCategories,
          allTags,
          isEditMode: (id) => id in editRows,
          toggleEditMode: (id, value) => {
            // Determine if row should be in edit mode
            let shouldEdit = false
            if (typeof value === 'boolean') {
              shouldEdit = value
            } else {
              shouldEdit = !(id in editRows)
            }

            // Update editRows state
            const updated = structuredClone(editRows)
            if (shouldEdit) {
              updated[id] = true
            } else {
              delete updated[id]
            }
            setEditRows(updated)
          },
          insertNewRow: (date: Date = new Date()) => {
            // Insert new row into transactionRows with date set so it appears
            // in correct place in table (if sorted by date). To keep things simple
            // we will only allow one new row at a time and reset any rows that are
            // currently open for editing
            if (account) {
              const newTransaction = createNewTransaction({
                account_id: account.id,
                title: '',
                date,
                currency_code: account.acc_iso_currency as string,
              })
              const newRow = buildTransactionRow(
                accountsWithRelations,
                newTransaction as ITransaction,
              )
              setNewRow(newRow)
              // Reset editRows state
              setEditRows({})
            }
          },
          removeNewRow: () => {
            // Remove new row
            setNewRow(undefined)
            // Reset editRows state
            setEditRows({})
          },
          updateRows: (rows, properties) => {
            const originalTransactions = rows.map((row) => row.transaction)
            const updatedTransactions = updateTransactions(originalTransactions, properties)
            onSaveTransactions(updatedTransactions)
            if (rows.length === 1 && rows[0].isNew) {
              // Close new row form
              table?.options.meta?.transactionsTable?.removeNewRow()
            }
          },
          duplicateRows: (rows) => {
            const duplicateTransactions = rows.map((row) => duplicateTransaction(row.transaction))
            onSaveTransactions(duplicateTransactions)
          },
          deleteRows: (rows) => {
            for (const row of rows) {
              onDeleteTransaction(row.transaction.id)
            }
            // Reset selection and editRows as indexes will change
            table?.resetRowSelection()
            setEditRows({})
          },
          onCreateCategory,
          onImportTransactions,
        },
      }}
    />
  )
}
