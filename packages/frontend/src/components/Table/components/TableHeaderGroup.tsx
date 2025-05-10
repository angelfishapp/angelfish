import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import type { HeaderGroup, SortDirection } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'

/**
 * Table Header Group Component Props
 */
export interface TableHeaderGroupProps<T> {
  /**
   * Optional class name to apply to the cell
   */
  className?: string
  /**
   * The react-table Header to render
   */
  headerGroup: HeaderGroup<T>
  /**
   * Optional flag to indicate if the header group is a footer group
   * @default false
   */
  isFooterGroup?: boolean
}

/**
 * Table Header Group Component used to render a header group in the table.
 * Provides support for sorting and resizing if enabled
 */
export default function TableHeaderGroup<T>({
  headerGroup,
  className,
  isFooterGroup = false,
}: TableHeaderGroupProps<T>) {
  return (
    <TableRow className={className}>
      {headerGroup.headers.map((header) => (
        <TableCell
          key={header.id}
          colSpan={header.colSpan}
          className={clsx(
            `col-id-${header.id}`,
            header.column.getIsPinned() ? `isPinned ${header.column.getIsPinned()}` : undefined,
          )}
          style={{
            width: header.getSize(),
          }}
        >
          {header.column.getCanSort() && !isFooterGroup ? (
            <TableSortLabel
              active={header.column.getIsSorted() ? true : false}
              direction={(header.column.getIsSorted() as SortDirection) == 'asc' ? 'asc' : 'desc'}
              className="sortable"
              onClick={
                header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined
              }
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableSortLabel>
          ) : (
            <>
              {header.isPlaceholder
                ? null
                : flexRender(
                    isFooterGroup ? header.column.columnDef.footer : header.column.columnDef.header,
                    header.getContext(),
                  )}
            </>
          )}
          {header.column.getCanResize() && !isFooterGroup && (
            <div
              {...{
                onMouseDown: header.getResizeHandler(),
                onTouchStart: header.getResizeHandler(),
                className: clsx(
                  'resizer',
                  header.column.getIsResizing() ? 'isResizing' : undefined,
                ),
                id: `resizer-${header.id}`,
              }}
            />
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}
