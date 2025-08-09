import type { PopoverPosition } from '@mui/material/Popover'
import type { SxProps, Theme } from '@mui/material/styles'
import type { Row, Table, TableOptions, TableState } from '@tanstack/react-table'
import type React from 'react'

import type { ContextMenuProps } from '@/components/ContextMenu'
import type { DefaultTableRowProps } from './components/DefaultTableRow'
import type { TableHeaderGroupProps } from './components/TableHeaderGroup'

/**
 * Context Menu Component Properties
 */
export interface TableContextMenuProps<T> extends Omit<ContextMenuProps, 'items' | 'title'> {
  /**
   * The react-table instance for the table
   */
  table: Table<T>
}

/**
 * Filter Bar Component Properties
 */
export interface TableFilterBarProps<T> {
  /**
   * The react-table instance for the table
   */
  table: Table<T>
}

/**
 * Properties for Table component, picking the react-table properties that are supported
 * by this component. Using Pick to avoid additional properties being added to the type if the
 * library adds new properties in the future.
 */
export interface TableProps<T>
  extends Pick<
    TableOptions<T>,
    // Core react-table properties
    | 'columns'
    | 'data'
    | 'defaultColumn'
    | 'initialState'
    | 'getSubRows'
    | 'getRowId'
    | 'autoResetAll'
    | 'meta'
    // Feature: Column Sorting
    | 'enableSorting'
    | 'enableMultiSort'
    | 'enableSortingRemoval'
    | 'enableMultiRemove'
    | 'sortDescFirst'
    | 'maxMultiSortColCount'
    | 'sortingFns'
    // Feature: Column Visibility
    | 'enableHiding'
    // Feature: Column Sizing
    | 'enableColumnResizing'
    // Feature: Column Filters
    | 'enableFilters'
    | 'manualFiltering'
    | 'filterFromLeafRows'
    | 'maxLeafRowFilterDepth'
    | 'enableColumnFilters'
    | 'enableGlobalFilter'
    | 'getColumnCanGlobalFilter'
    | 'filterFns'
    | 'globalFilterFn'
    // Feature: Row Selection
    | 'enableRowSelection'
    | 'enableMultiRowSelection'
    | 'enableSubRowSelection'
    // Feature: Row Expanding
    | 'enableExpanding'
    | 'autoResetExpanded'
    | 'getRowCanExpand'
    // Feature: Column Grouping
    | 'enableGrouping'
    | 'aggregationFns'
    // Feature: Column Pinning
    | 'enablePinning'
    // Table debug options
    | 'debugAll'
    | 'debugColumns'
    | 'debugHeaders'
    | 'debugRows'
    | 'debugTable'
  > {
  /**
   * Optionally apply a css className to Table
   */
  className?: string
  /**
   * If provided, will render a context menu when the user right clicks on a row.
   */
  ContextMenuElement?: React.ComponentType<TableContextMenuProps<any>>
  /**
   * If true, will disable Row Click functionality on the Table
   * @default false
   */
  disableRowClick?: boolean
  /**
   * If true, will disable Row Double Click functionality on the Table
   * @default false
   */
  disableRowDoubleClick?: boolean
  /**
   * If true, will disable Row Context Menu functionality on the Table
   * @default false
   */
  disableRowContextMenu?: boolean
  /**
   * If false, will not render tfoot rows
   * @default true
   */
  displayFooter?: boolean
  /**
   * If false, will not render thead rows
   * @default true
   */
  displayHeader?: boolean
  /**
   * View to render when the table is empty
   * @default '<>No data</>'
   */
  EmptyView?: React.ReactNode
  /**
   * If true, will expand all rows by default
   */
  expandAllRows?: boolean
  /**
   * Add a filter bar to the top of the table
   */
  FilterBarElement?: React.ComponentType<TableFilterBarProps<any>>
  /**
   * Override the default Footer component
   * @default <TableHeaderGroup />
   */
  FooterElement?: React.ComponentType<TableHeaderGroupProps<any>>
  /**
   * Override the default Header component
   * @default <TableHeaderGroup />
   */
  HeaderElement?: React.ComponentType<TableHeaderGroupProps<any>>
  /**
   * Callback to add onKeyDown handler for the table. This will be called when the user presses a key
   * while the table is focused.
   */
  onKeyDown?: (event: React.KeyboardEvent, table: Table<T>) => void
  /**
   * Callback to add onClick handler for each row. If `enableRowSelection` is true, this will
   * use the default rowSelectionHandler function for the table unless explicitly overridden.
   */
  onRowClick?: (event: React.MouseEvent, row: Row<T>, table: Table<T>) => void
  /**
   * Callback to add onContextMenu handler for each row. If `enableRowSelection` is true, this will
   * use the default rowContextMenu handler function for the table unless explicitly overridden.
   */
  onRowContextMenu?: (event: React.MouseEvent, row: Row<T>, table: Table<T>) => PopoverPosition
  /**
   * Callback to add onDoubleClick handler for each row.
   */
  onRowDoubleClick?: (event: React.MouseEvent, row: Row<T>, table: Table<T>) => void
  /**
   * Callback allowing parent component to get access to state/table objects when they're
   * updated
   */
  onStateChange?: (state: TableState, table: Table<T>) => void
  /**
   * By default, the row will be rendered by react-table. If you want to render the row yourself,
   * you can override the default component to render each row.
   * @default <DefaultTableRow />
   */
  RowElement?: React.ComponentType<DefaultTableRowProps<any>>
  /**
   * The row size of the table
   * @default 'medium'
   */
  size?: 'small' | 'medium'
  /**
   * Whether the header should stick when the user scrolls down the table
   * @default false
   */
  stickyHeader?: boolean
  /**
   * The inline style to apply to the component
   */
  sx?: SxProps<Theme>
  /**
   * The variant of the table to render:
   *  - 'primary' - uses primary color for table header
   *  - 'white' - uses white background for table header
   * @default 'primary'
   */
  variant?: 'primary' | 'white'
  /**
   * Function to estimate the size of each table row. Must be provided if scrollElement is provided otherwise
   * component will throw an error.
   */
  estimateSize?: (index: number) => number
  /**
   * Required for large tables to be performant. The div container or HTML body element to
   * use as the table's scroll container. If provided will enable virtualization for the table,
   * otherwise will render the full table without any virtualization.
   */
  scrollElement?: HTMLDivElement | null
  /**
   * Any adjustment to the scroll margin to use for the table's scroll container in px.
   * @default 0
   */
  scrollMarginAdjustment?: number
  /**
   * The number of rows to render above and below the visible area of the table.
   * @default 10
   */
  overscan?: number
}
