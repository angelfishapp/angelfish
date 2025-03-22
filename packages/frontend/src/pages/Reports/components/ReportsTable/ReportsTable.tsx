import type { FC } from 'react'
import React from 'react'

import { Table } from '@/components/Table'
import type { ReportsDataRow } from '@angelfish/core'
import { getNetTableColumns, getTableColumns } from './ReportsTable.columns'
import type { ReportsTableProps } from './ReportsTable.interface'
import { useStyles } from './ReportsTable.styles'

/**
 * Main Table for Reports Page
 */
const ReportsTable: FC<ReportsTableProps> = ({ data, onClick }) => {
  const classes = useStyles()

  // Setup React-Table
  const initialState = {
    columnPinning: {
      left: ['name'],
    },
  }

  // Create columns from periods data
  const [incomeColumns, expenseColumns] = React.useMemo(
    () => [getTableColumns('Income', data, onClick), getTableColumns('Expenses', data, onClick)],
    [data, onClick],
  )

  // Create Net summary row at bottom of tables
  const [netSummaryColumns, netSummaryRow] = React.useMemo(() => {
    let summary: ReportsDataRow | undefined = undefined
    if (data.periods.length > 0) {
      // Calculate Net Summary Row
      summary = {
        name: 'NET',
        type: 'net',
        icon: null,
      } as unknown as ReportsDataRow

      data.periods.forEach((period) => {
        const periodTotal = data.rows.reduce((total, row) => total + (row[period] as number), 0)

        ;(summary as ReportsDataRow)[period] = periodTotal
      })
    }
    return [getNetTableColumns(data), summary]
  }, [data])

  // Render table
  return (
    <React.Fragment>
      <Table
        data={data.rows.filter((row) => row.type === 'Income')}
        columns={incomeColumns}
        className={classes.table}
        initialState={initialState}
        // @ts-ignore: ReportsDataRow is not compatible with ReportsDataCategoryRow
        getSubRows={(row) => {
          return row.categories?.sort((a: { name: string }, b: { name: any }) =>
            a.name.localeCompare(b.name),
          )
        }}
        enableExpanding={true}
        enablePinning={true}
        enableRowSelection={false}
      />
      <Table
        data={data.rows.filter((row) => row.type === 'Expense')}
        columns={expenseColumns}
        className={classes.table}
        initialState={initialState}
        // @ts-ignore: ReportsDataRow is not compatible with ReportsDataCategoryRow
        getSubRows={(row) => {
          return row.categories?.sort((a: { name: string }, b: { name: any }) =>
            a.name.localeCompare(b.name),
          )
        }}
        enableExpanding={true}
        enablePinning={true}
        enableRowSelection={false}
      />
      <Table
        data={netSummaryRow ? [netSummaryRow] : []}
        columns={netSummaryColumns}
        className={classes.netSummary}
        initialState={initialState}
        displayHeader={false}
        displayFooter={false}
        enablePinning={true}
        enableRowSelection={false}
      />
    </React.Fragment>
  )
}

export default ReportsTable
