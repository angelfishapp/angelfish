import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import type { PopoverPosition } from '@mui/material/Popover'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import type {
  ColumnFiltersState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  GroupingState,
  Row,
  RowSelectionState,
  SortingState,
  Table,
  VisibilityState,
} from '@tanstack/react-table'
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { VirtualItem } from '@tanstack/react-virtual'
import { useVirtualizer } from '@tanstack/react-virtual'
import clsx from 'clsx'
import React from 'react'

import DefaultTableRow from './components/DefaultTableRow'
import TableHeaderGroup from './components/TableHeaderGroup'
import type { TableProps } from './Table.interface'
import { StyledTable, StyledTableBody } from './Table.styles'
import { handleRowContextMenu, handleRowSelection } from './Table.utils'

/**
 * Generic Table Component based on @tanstack/react-table that can render the table with the following supported features:
 *
 * - Sorting: If a column is sortable, clicking on the column header will sort the table by that column
 * - Grouping: Grouping is used for grouping sub rows under a parent row if a column(s) is given, dynamic grouping is not supported
 * - Filtering: Filtering of columns or global filtering of rows
 * - Expanding: Expanding a row will show the sub rows under that row unless overriden by the `subComponent` prop
 * - Row Selection: Supports single or multi row selection, highlighting the selected rows in the table
 * - Column Resizing: Supports resizing of columns by dragging the column header
 * - Column Visibility: Supports hiding and showing columns
 * - Column Pinning: Supports pinning columns to the left or right of the table
 * - Right mouse context menu if ContextMenuElement is provided
 * - Top filter bar if FilterBarElement is provided
 *
 * If a scrollElement is provided, the table will use virtualization to improve the performance of large tables, otherwise
 * all the rows will be rendered by default. If provided a scrollElement you must also provide an estimateSize function for rows.
 */
export default function Table<T>({
  className,
  disableRowClick = false,
  disableRowDoubleClick = false,
  disableRowContextMenu = false,
  displayFooter = true,
  displayHeader = true,
  EmptyView = <>No Data</>,
  size = 'medium',
  sx,
  estimateSize,
  scrollElement,
  scrollMarginAdjustment = 0,
  stickyHeader = false,
  overscan = 10,
  RowElement = DefaultTableRow,
  FilterBarElement,
  FooterElement = TableHeaderGroup,
  HeaderElement = TableHeaderGroup,
  ContextMenuElement,
  variant = 'primary',
  // Override default value to false for autoResetAll
  // otherwise changing data will keep resetting the table state
  autoResetAll = false,
  onRowClick,
  onRowContextMenu,
  onRowDoubleClick,
  onStateChange,
  initialState,
  enableSorting = false,
  enableExpanding = false,
  getRowCanExpand,
  enableRowSelection = false,
  enableColumnResizing = false,
  enableHiding = false,
  enableGlobalFilter = false,
  enableColumnFilters = false,
  enablePinning = false,
  enableGrouping = false,
  expandAllRows = false,
  ...tableProps
}: TableProps<T>) {
  // React-Table State
  const [sorting, setSorting] = React.useState<SortingState>(
    initialState?.sorting ? initialState.sorting : [],
  )
  const [expanded, setExpanded] = React.useState<ExpandedState>(
    initialState?.expanded ? initialState.expanded : {},
  )
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ? initialState.rowSelection : {},
  )
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    initialState?.columnFilters ? initialState.columnFilters : [],
  )
  const [globalFilter, setGlobalFilter] = React.useState<string>(
    initialState?.globalFilter ? initialState.globalFilter : '',
  )
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>(
    initialState?.columnSizing ? initialState.columnSizing : {},
  )
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    initialState?.columnVisibility ? initialState.columnVisibility : {},
  )
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    initialState?.columnPinning ? initialState.columnPinning : {},
  )
  const [grouping, setGrouping] = React.useState<GroupingState>(
    initialState?.grouping ? initialState.grouping : [],
  )
  // Keep track of initial expand all rows state
  const [initialExpandAllRows, setInitialExpandAllRows] = React.useState<boolean>(false)

  // Configure react-table
  const table = useReactTable<T>({
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    columnResizeMode: 'onChange',
    autoResetAll,
    enableRowSelection,
    enableColumnResizing,
    enableColumnFilters,
    enableSorting,
    enableExpanding,
    getRowCanExpand,
    enableGrouping,
    enableGlobalFilter,
    enableHiding,
    enablePinning,
    initialState,
    state: {
      sorting,
      expanded,
      rowSelection,
      columnFilters,
      globalFilter,
      columnSizing,
      columnVisibility,
      columnPinning,
      grouping,
    },
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    onColumnPinningChange: setColumnPinning,
    onGroupingChange: setGrouping,
    ...tableProps,
  })

  // Listen and pass back state changes from table
  React.useEffect(() => {
    onStateChange?.(table.getState(), table)
  }, [
    sorting,
    expanded,
    rowSelection,
    columnFilters,
    globalFilter,
    columnSizing,
    columnVisibility,
    columnPinning,
    grouping,
    onStateChange,
    table,
  ])

  // Allow user to expand or collapse all rows
  React.useEffect(() => {
    if (expandAllRows !== initialExpandAllRows) {
      setInitialExpandAllRows(expandAllRows)
      table.toggleAllRowsExpanded(expandAllRows)
    }
  }, [expandAllRows, initialExpandAllRows, table])

  if (scrollElement && !estimateSize) {
    throw new Error('Table must be provided an estimateSize function if using virtualization')
  }

  // Configure react-virtual if scrollElement is provided
  const tableContainerRef = React.useRef<HTMLDivElement>(null)
  let paddingTop = 0
  let paddingBottom = 0
  let virtualItems: VirtualItem[] = []
  const isVirtualized = Boolean(scrollElement && estimateSize)
  const tableContainerOffsetRef = React.useRef(0)
  React.useLayoutEffect(() => {
    tableContainerOffsetRef.current = tableContainerRef.current?.offsetTop ?? 0
  }, [])
  const virtualizer = useVirtualizer({
    count: isVirtualized ? table.getRowModel().rows.length : 0,

    estimateSize: isVirtualized ? estimateSize! : () => 0,
    getScrollElement: () => scrollElement || null,
    scrollMargin: isVirtualized ? tableContainerOffsetRef.current + scrollMarginAdjustment : 0,
    overscan: isVirtualized ? overscan : 0,
  })
  if (isVirtualized) {
    // This is where the magic happens, essentially create a large row with height of total rows
    // before and after to position the rendered rows on the page correctly
    virtualItems = virtualizer.getVirtualItems()
    if (virtualItems.length > 0) {
      paddingTop = virtualItems[0].start - virtualizer.options.scrollMargin
      paddingBottom = virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
    }
  }

  /**
   * Row Click Handlers
   */

  // Timer to determine if click or doubleclick on rows
  const timer = React.useRef<NodeJS.Timeout | undefined>(undefined)
  const handleClick = React.useCallback(
    (event: React.MouseEvent, row: Row<T>, table: Table<T>) => {
      const fn = setTimeout(() => {
        if (timer.current) {
          if (onRowClick) {
            onRowClick(event, row, table)
          } else if (enableRowSelection) {
            handleRowSelection(event, row, table)
          }
          timer.current = undefined
        }
      }, 250)
      timer.current = fn
    },
    [onRowClick, enableRowSelection],
  )
  const handleDoubleClick = React.useCallback(
    (event: React.MouseEvent, row: Row<T>, table: Table<T>) => {
      clearTimeout(timer.current)
      timer.current = undefined
      onRowDoubleClick?.(event, row, table)
    },
    [onRowDoubleClick],
  )
  const [contextMenuPos, setContextMenuPos] = React.useState<PopoverPosition>({ top: 0, left: 0 })
  const handleContextMenu = React.useCallback(
    (event: React.MouseEvent, row: Row<T>, table: Table<T>) => {
      const position = onRowContextMenu
        ? onRowContextMenu(event, row, table)
        : enableRowSelection
          ? handleRowContextMenu(event, row, table)
          : { top: 0, left: 0 }
      setContextMenuPos(position)
    },
    [onRowContextMenu, enableRowSelection],
  )

  // Keep track of parent row index for zebra striping
  let isStriped = false

  // Render
  return (
    <ClickAwayListener onClickAway={() => table.resetRowSelection()}>
      <Box display="flex" flexDirection="column" flexGrow={1}>
        {/* Render Filter Bar */}
        {FilterBarElement && <FilterBarElement table={table} />}

        {/* Render Table */}

        <div ref={tableContainerRef} className={className}>
          <StyledTable
            stickyHeader={stickyHeader}
            className={`Table-variant-${variant}`}
            size={size}
            sx={sx}
          >
            {/* Table Header */}
            {displayHeader && (
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <HeaderElement key={headerGroup.id} headerGroup={headerGroup} />
                ))}
              </TableHead>
            )}

            {/* Main Table Body */}

            {/* Virtualization - Add Filler Row At Top */}
            {paddingTop > 0 && (
              <StyledTableBody>
                <TableRow className="paddingRow">
                  <TableCell
                    colSpan={table.getVisibleFlatColumns().length}
                    style={{ height: `${paddingTop}px` }}
                  />
                </TableRow>
              </StyledTableBody>
            )}

            {/* Table Data - Display rows or emptyView if no rows to display */}

            {table.getRowModel().rows.length > 0 ? (
              isVirtualized ? (
                virtualItems.map((virtualItem) => {
                  const row = table.getRowModel().rows[virtualItem.index]
                  if (row.depth === 0) {
                    isStriped = virtualItem.index % 2 !== 0
                  }
                  return (
                    <StyledTableBody
                      key={virtualItem.key}
                      data-index={virtualItem.index}
                      {...(virtualizer && { ref: virtualizer.measureElement })}
                      className={clsx(
                        row.depth >= 1 ? 'subRow' : 'parentRow',
                        isStriped ? undefined : 'striped',
                      )}
                      onClick={(event) =>
                        !disableRowClick ? handleClick(event, row, table) : undefined
                      }
                      onDoubleClick={(event) =>
                        !disableRowDoubleClick ? handleDoubleClick(event, row, table) : undefined
                      }
                      onContextMenu={(event) =>
                        !disableRowContextMenu ? handleContextMenu(event, row, table) : undefined
                      }
                    >
                      <RowElement row={row} table={table} />
                    </StyledTableBody>
                  )
                })
              ) : (
                table.getRowModel().rows.map((row) => {
                  if (row.depth === 0) {
                    isStriped = !isStriped
                  }
                  return (
                    <StyledTableBody
                      key={row.id}
                      className={clsx(
                        row.depth >= 1 ? 'subRow' : 'parentRow',
                        isStriped ? undefined : 'striped',
                      )}
                      onClick={
                        (enableRowSelection || onRowClick) && !disableRowClick
                          ? (event) => handleClick(event, row, table)
                          : undefined
                      }
                      onDoubleClick={
                        !disableRowDoubleClick
                          ? (event) => handleDoubleClick(event, row, table)
                          : undefined
                      }
                      onContextMenu={
                        !disableRowContextMenu
                          ? (event) => handleContextMenu(event, row, table)
                          : undefined
                      }
                    >
                      <RowElement row={row} table={table} />
                    </StyledTableBody>
                  )
                })
              )
            ) : (
              <StyledTableBody>
                <TableRow>
                  <TableCell colSpan={table.getVisibleFlatColumns().length} className="nodata">
                    {EmptyView}
                  </TableCell>
                </TableRow>
              </StyledTableBody>
            )}

            {/* Virtualization - Add Filler Row At Bottom */}
            {paddingBottom > 0 && (
              <StyledTableBody>
                <TableRow className="paddingRow">
                  <TableCell
                    colSpan={table.getVisibleFlatColumns().length}
                    style={{ height: `${paddingBottom}px` }}
                  />
                </TableRow>
              </StyledTableBody>
            )}

            {/* Table Footer */}

            {displayFooter && (
              <TableFooter>
                {table.getFooterGroups().map((footerGroup) => (
                  <FooterElement
                    key={footerGroup.id}
                    headerGroup={footerGroup}
                    isFooterGroup={true}
                  />
                ))}
              </TableFooter>
            )}
          </StyledTable>

          {/* Table Context Menu */}
          {ContextMenuElement && (
            <ContextMenuElement
              open={contextMenuPos.top !== 0}
              anchorPosition={contextMenuPos}
              onClose={() => setContextMenuPos({ top: 0, left: 0 })}
              table={table}
            />
          )}
        </div>
      </Box>
    </ClickAwayListener>
  )
}
