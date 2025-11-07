import type { ChartData, ChartDataset, ChartOptions } from 'chart.js'

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
      yStacked: {
        stacked: true,
        display: true,
        beginAtZero: true,
        ticks: {
          color: '#222',
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

  for (const row of data.rows) {
    const rowData: number[] = []
    for (const period of data.periods) {
      rowData.push(row[period] || 0)
    }
    datasets.push({
      label: row.acc_type,
      data: rowData,
      type: 'bar' as const,
      backgroundColor: row.acc_type === 'depository' ? '#F8D092' : '#DC143C',
      borderColor: row.acc_type === 'depository' ? '#F8D092' : '#DC143C',
      // @ts-ignore: chartjs v4 issue
      axis: 'yStacked',
    })
  }

  return { labels, datasets }
}
