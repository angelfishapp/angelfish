import type { Table as ReactTable, RowData } from '@tanstack/react-table'

import type { ITransaction, UpdateTransactionProperties } from '@angelfish/core'
import { createNewTransaction, duplicateTransaction, updateTransactions } from '@angelfish/core'

import { CurrencyLabel } from '@/components/CurrencyLabel'
import type { TableProps } from '@/components/Table'
import { handleRowContextMenu, handleRowSelection } from '@/components/Table'
import React from 'react'
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
import {
  FilterBarWrapper,
  PositionedContainer,
  StickySentinel,
  StickyTableContainer,
  StyledTransactionTable,
} from './TransactionsTable.styles'

/* Extend react-table to add custom metadata for TransactionsTable */
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
  // Add sticky detection state
  const [isSticky, setIsSticky] = React.useState(false)
  const [filterBarHeight, setFilterBarHeight] = React.useState(0)
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const filterBarRef = React.useRef<HTMLDivElement>(null)

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
  const [tableWidth, setTableWidth] = React.useState<number | string>('100%')

  // Measure filter bar height
  React.useEffect(() => {
    if (filterBarRef.current && table) {
      setFilterBarHeight(filterBarRef.current.offsetHeight)
    }
  }, [showFilterBar, table])

  // Intersection Observer to detect when header becomes sticky
  React.useEffect(() => {
    if (!sentinelRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting)
      },
      {
        threshold: 0,
        rootMargin: '-1px 0px 0px 0px',
      },
    )

    observer.observe(sentinelRef.current)

    return () => observer.disconnect()
  }, [])
  React.useEffect(() => {
    const styleId = 'transaction-sticky-style'
    let styleTag = document.getElementById(styleId) as HTMLStyleElement | null

    const top = showFilterBar && filterBarHeight > 0 ? `${filterBarHeight - 5}px` : '0px'

    const css = `
    .sticky-table-container thead th {
      position: sticky !important;
      top: ${top} !important;
      z-index: 101 !important;
    }

    .sticky-table-container table thead {
      position: sticky !important;
      top: ${top} !important;
      z-index: 101 !important;
    }
  `

    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = styleId
      document.head.appendChild(styleTag)
    }

    styleTag.innerHTML = css

    return () => {
      // optional cleanup
      styleTag?.remove()
    }
  }, [showFilterBar, filterBarHeight, isSticky])
  // Render
  return (
    <PositionedContainer>
      {/* Sentinel element to detect when header should be sticky */}
      <StickySentinel ref={sentinelRef} />
      {/* Sticky Filter Bar */}
      {showFilterBar && table && (
        <FilterBarWrapper isSticky={isSticky} ref={filterBarRef} width={tableWidth}>
          <FilterBar table={table} />
        </FilterBarWrapper>
      )}
      {/* Table container with custom CSS for sticky header positioning */}
      <StickyTableContainer className="sticky-table-container">
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
          maxLeafRowFilterDepth={0}
          displayFooter={showFooter}
          size="small"
          EmptyView={<>No Transaction Data</>}
          RowElement={TableRow}
          onRowClick={(event, row, tableInstance) => {
            if (row.id in editRows) return
            handleRowSelection(event, row, tableInstance)
          }}
          onRowDoubleClick={(_, row) => {
            if (row.id in editRows) return
            table?.options.meta?.transactionsTable?.toggleEditMode(row.id)
          }}
          onRowContextMenu={(event, row, tableInstance) => {
            if (row.id in editRows) return { top: 0, left: 0 }
            return handleRowContextMenu(event, row, tableInstance)
          }}
          getSubRows={(row) => (row.isSplit ? row.rows : undefined)}
          FilterBarElement={undefined}
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
            // handling getting table width and breaking point for table width
            const offset = window.innerWidth - 1672
            setTableWidth(reactTable.getTotalSize() + offset)
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
                let shouldEdit = false
                if (typeof value === 'boolean') {
                  shouldEdit = value
                } else {
                  shouldEdit = !(id in editRows)
                }
                const updated = structuredClone(editRows)
                if (shouldEdit) {
                  updated[id] = true
                } else {
                  delete updated[id]
                }
                setEditRows(updated)
              },
              insertNewRow: (date: Date = new Date()) => {
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
                  setEditRows({})
                }
              },
              removeNewRow: () => {
                setNewRow(undefined)
                setEditRows({})
              },
              updateRows: (rows, properties) => {
                const originalTransactions = rows.map((row) => row.transaction)
                const updatedTransactions = updateTransactions(originalTransactions, properties)
                onSaveTransactions(updatedTransactions)
                if (rows.length === 1 && rows[0].isNew) {
                  table?.options.meta?.transactionsTable?.removeNewRow()
                }
              },
              duplicateRows: (rows) => {
                const duplicateTransactions = rows.map((row) =>
                  duplicateTransaction(row.transaction),
                )
                onSaveTransactions(duplicateTransactions)
              },
              deleteRows: (rows) => {
                for (const row of rows) {
                  onDeleteTransaction(row.transaction.id)
                }
                table?.resetRowSelection()
                setEditRows({})
              },
              onCreateCategory,
              onImportTransactions,
            },
          }}
        />
      </StickyTableContainer>
    </PositionedContainer>
  )
}
