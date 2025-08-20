import type { FC } from 'react'
import React from 'react'

import { useTranslate } from '@/utils/i18n'
import type { ReportsDataRow } from '@angelfish/core'
import { getNetTableColumns, getTableColumns } from './ReportsTable.columns'
import type { ReportsTableProps } from './ReportsTable.interface'
import { StyledNetSummaryTable, StyledReportsTable } from './ReportsTable.styles'

/**
 * Main Table for Reports Page
 */
const ReportsTable: FC<ReportsTableProps> = ({ data, onClick }) => {
  // Localization
  const { locale } = useTranslate()
  const { reports: t } = useTranslate('pages')
  // Setup React-Table
  const initialState = {
    columnPinning: {
      left: ['name'],
    },
  }

  // Create columns from periods data
  const [incomeColumns, expenseColumns] = React.useMemo(
    () => [
      getTableColumns(t['income'], data, onClick, t, locale),
      getTableColumns(t['expenses'], data, onClick, t, locale),
    ],
    [data, onClick, locale, t],
  )

  // Create Net summary row at bottom of tables
  const [netSummaryColumns, netSummaryRow] = React.useMemo(() => {
    let summary: ReportsDataRow | undefined = undefined
    if (data.periods.length > 0) {
      // Calculate Net Summary Row
      summary = {
        name: t['net'],
        type: 'net',
        icon: null,
      } as unknown as ReportsDataRow

      data.periods.forEach((period) => {
        const periodTotal = data.rows.reduce((total, row) => {
          const value = Number(row[period])
          return isNaN(value) ? total : total + value
        }, 0)

        ;(summary as ReportsDataRow)[period] = periodTotal
      })
    }
    return [getNetTableColumns(data, t), summary]
  }, [data, t])

  // Render table
  return (
    <React.Fragment>
      <StyledReportsTable
        data={data.rows.filter((row) => row.type === 'Income')}
        columns={incomeColumns}
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
      <StyledReportsTable
        data={data.rows.filter((row) => row.type === 'Expense')}
        columns={expenseColumns}
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
      <StyledNetSummaryTable
        data={netSummaryRow ? [netSummaryRow] : []}
        columns={netSummaryColumns}
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
