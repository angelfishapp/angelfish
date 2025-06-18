import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { ColumnDef } from '@tanstack/react-table'

import { CurrencyLabel } from '@/components/CurrencyLabel'
import { Emoji } from '@/components/Emoji'
import type { CategorySpendReportDataRow } from '@angelfish/core'
import { renderPeriodHeader } from '../../Reports.utils'
import type { ReportsTableProps } from './ReportsTable.interface'

/**
 * Generate array of react-table Columns from the ReportsData with column
 * for each period in data
 *
 * @param title         Title of the table, i.e. 'Income' or 'Expenses'
 * @param data          The report data with periods to generate columns from
 * @param onClick       Callback when a cell is clicked
 * @returns             ColumnDef[]
 */
export function getTableColumns(
  title: string,
  data: ReportsTableProps['data'],
  onClick: ReportsTableProps['onClick'],
): ColumnDef<CategorySpendReportDataRow>[] {
  let columns: ColumnDef<CategorySpendReportDataRow>[] = []

  if (data.periods.length > 0) {
    // Create columns for each period
    columns = [
      {
        accessorKey: 'name',
        header: title,
        minSize: 300,
        cell: ({ row }) => {
          return (
            <span style={{ alignItems: 'center', display: 'flex', marginLeft: 16 }}>
              <span style={{ width: '25px' }} />
              <Emoji emoji={row.original.icon} size={24} />
              <span className="name" style={{ width: 209 }}>
                {row.original.name}
              </span>
            </span>
          )
        },
        aggregatedCell: ({ row }) => {
          return (
            <span style={{ alignItems: 'center', display: 'flex' }}>
              {row.getCanExpand() && (
                <>
                  {row.getIsExpanded() ? (
                    <ExpandMoreIcon className="expand-arrow" onClick={() => row.toggleExpanded()} />
                  ) : (
                    <ChevronRightIcon
                      className="expand-arrow"
                      onClick={() => row.toggleExpanded()}
                    />
                  )}
                </>
              )}
              {!row.getCanExpand() && <span style={{ width: '25px' }} />}
              <Emoji emoji={row.original.icon} size={24} />
              <span className="name">{row.original.name}</span>
            </span>
          )
        },
        footer: () => <span className="name">{title} Total</span>,
      },
    ]

    data.periods.forEach((period) => {
      columns.push({
        accessorKey: period,
        header: renderPeriodHeader(period),
        cell: ({ cell }) => {
          const value = cell.getValue<number>()
          if (value === 0) return '-'

          return (
            <CurrencyLabel
              value={value}
              className="currency"
              onClick={() => {
                let name = ''
                // Get group name if category
                if (cell.row.depth !== 0) {
                  const group = data.rows.find((row) =>
                    row.categories?.find((cat) => cat.id === cell.row.original.id),
                  )
                  if (group) name = `Unclassified Income > ${cell.row.original.name}`
                  else name = cell.row.original.name
                } else {
                  name = cell.row.original.name
                }

                if (cell.row.original.id)
                  onClick(cell.column.id, name, cell.row.original.id, cell.row.depth === 0)
              }}
            />
          )
        },
        aggregatedCell: ({ cell }) => {
          const value = cell.getValue<number>()
          if (value === 0) return '-'

          return (
            <CurrencyLabel
              value={value}
              className="currency"
              onClick={() => {
                let name = ''
                // Get group name if category
                if (cell.row.depth !== 0) {
                  const group = data.rows.find((row) =>
                    row.categories?.find((cat) => cat.id === cell.row.original.id),
                  )
                  if (group) name = `Unclassified Income > ${cell.row.original.name}`
                  else name = cell.row.original.name
                } else {
                  name = cell.row.original.name
                }

                if (cell.row.original.id)
                  onClick(cell.column.id, name, cell.row.original.id, cell.row.depth === 0)
              }}
            />
          )
        },
        footer: ({ table, column }) => {
          const total = table
            .getRowModel()
            .rows.reduce((total, row) => total + (row.original[column.id] as number), 0)
          return <CurrencyLabel className="total-currency" value={total} />
        },
      })
    })
  }
  return columns
}

/**
 * Get Columns fro The Net Summary Table Row at Bottom
 *
 * @param data    The report data with periods to generate columns from
 * @returns       ColumnDef[]
 */
export function getNetTableColumns(
  data: ReportsTableProps['data'],
): ColumnDef<CategorySpendReportDataRow>[] {
  let columns: ColumnDef<CategorySpendReportDataRow>[] = []

  if (data.periods.length > 0) {
    // Create columns for each period
    columns = [
      {
        accessorKey: 'name',
        minSize: 300,
        header: undefined,
        cell: () => 'NET',
      },
    ]
    for (const period of data.periods) {
      columns.push({
        accessorKey: period,
        header: undefined,
        cell: ({ cell }) => {
          return <CurrencyLabel className="currency" value={cell.getValue<number>()} />
        },
      })
    }
  }

  return columns
}
