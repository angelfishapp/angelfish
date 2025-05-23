/* eslint-disable @typescript-eslint/ban-ts-comment */

import { getDataSetColors } from '@/utils/palette.utils'
import type { ReportsData } from '@angelfish/core'
import type { ChartDataset, ChartType } from 'chart.js'
import { renderPeriodHeader } from '../../Reports.utils'

/**
 * converts ReportsData into charts data which can be used to create charts
 * @param {ReportsData} data
 * @returns {{ labels: {}; datasets: {}; }}
 */
export const getChartData = (data: ReportsData) => {
  // Remove Total label
  const labels: string[] = []
  for (const period of data.periods) {
    if (period !== 'total') {
      labels.push(renderPeriodHeader(period))
    }
  }

  // Get total for income
  const incomeRows = data.rows.filter((row) => row.type === 'Income')
  const income: number[] = []
  for (const period of data.periods) {
    if (period !== 'total') {
      let periodTotal = 0
      for (const row of incomeRows) {
        periodTotal += row[period]
      }
      income.push(periodTotal)
    }
  }

  const datasets: ChartDataset[] = [
    {
      label: 'Total Income',
      data: income,
      type: 'line' as ChartType,
      fill: false,
      borderColor: '#48ABE4',
      backgroundColor: '#48ABE4',
      // @ts-ignore
      axis: 'y',
    },
  ]

  // Generate Expense datasets
  const expenseRows = data.rows.filter((row) => row.type === 'Expense')
  // Get colors for each row
  const colors = getDataSetColors(expenseRows)
  for (const row of expenseRows) {
    const rowData: number[] = []
    for (const period of data.periods) {
      if (period !== 'total') {
        rowData.push(row[period] ? row[period] * -1 : 0)
      }
    }
    datasets.push({
      label: row.name,
      data: rowData,
      type: 'bar' as ChartType,
      backgroundColor: colors[row.name],
      borderColor: colors[row.name],
      // @ts-ignore
      axis: 'yStacked',
    })
  }

  return { labels, datasets }
}
