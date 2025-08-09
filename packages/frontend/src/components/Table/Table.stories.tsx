import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { Table } from '.'

import type { ITransaction } from '@angelfish/core'
import { getLongTransactions, transactions } from '@angelfish/tests/fixtures'

/**
 * Define Table Columns
 */

const columnHelper = createColumnHelper<ITransaction>()
const columns: ColumnDef<ITransaction, any>[] = [
  columnHelper.accessor('date', {
    id: 'date',
    header: 'Date',
    cell: ({ row, cell, getValue }) => {
      if (cell.getIsGrouped()) {
        if (row.getIsExpanded()) {
          return (
            <>
              <ExpandMoreIcon className="expand-arrow" onClick={() => row.toggleExpanded()} />
              {(getValue() as Date).toLocaleDateString()} ({row.subRows.length})
            </>
          )
        }
        return (
          <>
            <ChevronRightIcon className="expand-arrow" onClick={() => row.toggleExpanded()} />
            {(getValue() as Date).toLocaleDateString()} ({row.subRows.length})
          </>
        )
      } else if (cell.getIsPlaceholder()) {
        return null
      }
      return `${(getValue() as Date).toLocaleDateString()}`
    },
    aggregationFn: 'count',
    footer: 'Date Footer',
    minSize: 10,
    maxSize: 2000,
  }),
  columnHelper.accessor('title', {
    id: 'title',
    header: 'Title',
    footer: 'Title Footer',
    minSize: 10,
    maxSize: 2000,
  }),
  columnHelper.accessor('currency_code', {
    id: 'currency_code',
    header: 'Currency Code',
    footer: 'Currency Code Footer',
    cell: ({ row, cell, getValue }) => {
      if (cell.getIsGrouped()) {
        if (row.getIsExpanded()) {
          return (
            <>
              <ExpandMoreIcon className="expand-arrow" onClick={() => row.toggleExpanded()} />
              {(getValue() as string)?.toUpperCase()} ({row.subRows.length})
            </>
          )
        }
        return (
          <>
            <ChevronRightIcon className="expand-arrow" onClick={() => row.toggleExpanded()} />
            {(getValue() as string)?.toUpperCase()} ({row.subRows.length})
          </>
        )
      } else if (cell.getIsPlaceholder()) {
        return null
      }
      return `${(getValue() as string)?.toUpperCase()}`
    },
    minSize: 10,
    maxSize: 2000,
  }),
  columnHelper.accessor('id', {
    id: 'id',
    header: 'ID',
    enableSorting: false,
    footer: 'ID Footer',
    minSize: 10,
    maxSize: 2000,
  }),
  columnHelper.accessor('amount', {
    id: 'amount',
    header: 'Amount',
    footer: 'Amount Footer',
    cell: ({ getValue }) => `$${(getValue() as number).toFixed(2)}`,
    aggregationFn: 'sum',
    aggregatedCell: ({ getValue }) => `Total: $${(getValue() as number).toFixed(2)}`,
    minSize: 10,
    maxSize: 2000,
  }),
]

/**
 * Story Book Meta
 */

const meta = {
  title: 'Components/Table',
  component: Table,
  args: {
    // @ts-ignore Showing type error for some reason
    columns,
    scrollElement: undefined,
    onRowDoubleClick: (event, row, table) => action('onRowDoubleClick')(event, row, table),
  },
  render: ({ estimateSize, ...args }) => {
    const RenderComponent = () => {
      // Virtualized Table
      const [divScrollElement, setDivScrollElement] = React.useState<HTMLDivElement | null>(null)
      React.useEffect(() => {
        setDivScrollElement(document.getElementById('table-viewport') as HTMLDivElement)
      }, [])

      return (
        <div
          id="table-viewport"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'auto',
          }}
        >
          {divScrollElement && (
            <Table
              scrollElement={estimateSize ? divScrollElement : undefined}
              estimateSize={estimateSize}
              {...args}
            />
          )}
        </div>
      )
    }

    return <RenderComponent />
  },
} satisfies Meta<typeof Table>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Storys
 */

export const Default: Story = {
  args: {
    stickyHeader: false,
    data: transactions,
    enableSorting: true,
    enableSortingRemoval: false,
  },
}

export const Virtualized: Story = {
  args: {
    estimateSize: () => 63,
    stickyHeader: true,
    overscan: 10,
    data: getLongTransactions(),
    enableSorting: true,
    enableSortingRemoval: false,
    enableColumnResizing: true,
    enableRowSelection: true,
    enableMultiRowSelection: true,
  },
}

export const VirtualizedWithFilterBar: Story = {
  args: {
    estimateSize: () => 63,
    stickyHeader: true,
    overscan: 10,
    data: getLongTransactions(),
    enableSorting: true,
    enableSortingRemoval: false,
    enableColumnResizing: true,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    FilterBarElement: ({ table }) => (
      <div style={{ padding: '10px' }}>
        <input type="text" placeholder="Filter by title" />
      </div>
    ),
  },
}

export const EmptyTable: Story = {
  args: {
    stickyHeader: false,
    data: [],
  },
}

export const CustomFooter: Story = {
  args: {
    stickyHeader: false,
    data: transactions,
    enableSorting: true,
    enableSortingRemoval: false,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    initialState: {
      sorting: [{ id: 'date', desc: true }],
    },
    FooterElement: ({ headerGroup }) => {
      return (
        <tr>
          <td
            colSpan={headerGroup.headers.length}
            style={{ padding: 5, fontWeight: 700, textAlign: 'center' }}
          >
            Custom Footer
          </td>
        </tr>
      )
    },
  },
}

export const WithColumnPinning: Story = {
  args: {
    stickyHeader: false,
    data: transactions,
    enableSorting: true,
    enableSortingRemoval: false,
    enablePinning: true,
    initialState: {
      sorting: [{ id: 'date', desc: true }],
      columnPinning: {
        left: ['title'],
        right: ['iso_currency_code', 'date'],
      },
    },
  },
}

export const WithRowSelection: Story = {
  args: {
    stickyHeader: false,
    data: transactions,
    enableSorting: true,
    enableSortingRemoval: false,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    initialState: {
      sorting: [{ id: 'date', desc: true }],
    },
  },
}

export const WithColumnResizing: Story = {
  args: {
    stickyHeader: false,
    data: transactions,
    enableSorting: true,
    enableSortingRemoval: false,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableColumnResizing: true,
    initialState: {
      sorting: [{ id: 'date', desc: true }],
    },
  },
}

export const WithIDHidden: Story = {
  args: {
    enableHiding: true,
    initialState: {
      sorting: [{ id: 'date', desc: true }],
      columnVisibility: {
        id: false,
      },
    },
    ...Default.args,
  },
}

export const WithGrouping: Story = {
  args: {
    enableGrouping: true,
    expandAllRows: true,
    initialState: {
      sorting: [{ id: 'date', desc: true }],
      grouping: ['currency_code', 'date'],
    },
    stickyHeader: false,
    data: [
      ...transactions,
      {
        id: '12345',
        date: new Date(),
        title: 'UK Grouped 1',
        currency_code: 'GBP',
        amount: 100,
      },
      {
        id: '12345',
        date: new Date(),
        title: 'UK Grouped 2',
        currency_code: 'GBP',
        amount: 100,
      },
      {
        id: '12345',
        date: new Date(),
        title: 'UK Grouped 3',
        currency_code: 'GBP',
        amount: 100,
      },
    ],
  },
}
