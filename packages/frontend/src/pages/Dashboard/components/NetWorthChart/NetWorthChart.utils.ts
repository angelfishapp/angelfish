import type { ChartData, ChartDataset, ChartOptions } from 'chart.js'

import theme from '@/app/theme'
import type { NetWorthReportResults } from '@angelfish/core'
import { renderPeriodHeader } from '../../../Reports/Reports.utils'

/**
 * Get chart options for the Net Worth chart
 *
 * @param currency ISO currency code to format tooltips
 * @returns ChartOptions
 */
export function getChartOptions(currency: string): ChartOptions {
  return {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        filter: (item) => item.raw !== 0,
        callbacks: {
          label(context) {
            let label = context.dataset.label || ''

            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
              }).format(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#222',
        },
      },
      xLine: {
        offset: false,
        display: false,
      },
      yStacked: {
        stacked: true,
        display: true,
        beginAtZero: true,
        ticks: {
          color: '#222',
          callback(value) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency,
              maximumFractionDigits: 0,
            }).format(value as number)
          },
        },
      },
    },
  }
}

/**
 * Get chart data for Net Worth chart
 *
 * @param data  NetWorthReportResults
 * @returns     ChartData
 */
export function getChartData(data: NetWorthReportResults): ChartData {
  const labels: string[] = []
  for (const period of data.periods) {
    labels.push(renderPeriodHeader(period))
  }

  const datasets: ChartDataset[] = []

  const netWorth: number[] = Array(data.periods.length).fill(0)
  for (const row of data.rows) {
    const rowData: number[] = []
    for (let i = 0; i < data.periods.length; i++) {
      const period = data.periods[i]
      const v = row[period] ?? 0
      rowData.push(v)
      // accumulate into netWorth per period
      netWorth[i] += v
    }
    datasets.push({
      label: row.acc_type === 'depository' ? 'Cash' : 'Credit',
      data: rowData,
      type: 'bar' as const,
      backgroundColor: row.acc_type === 'depository' ? '#F8D092' : '#DC143C',
      borderColor: row.acc_type === 'depository' ? '#F8D092' : '#DC143C',
      order: row.acc_type === 'depository' ? 3 : 2,
      // @ts-ignore: chartjs v4 issue
      axis: 'yStacked',
    })
  }

  // Add net worth line
  datasets.push({
    label: 'Net Worth',
    data: netWorth,
    type: 'line' as const,
    fill: false,
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main,
    borderWidth: 2,
    tension: 0.25,
    pointRadius: 0,
    order: 1,
    // @ts-ignore: chartjs v4 issue
    axis: 'y',
    xAxisID: 'xLine',
  })

  return { labels, datasets }
}
