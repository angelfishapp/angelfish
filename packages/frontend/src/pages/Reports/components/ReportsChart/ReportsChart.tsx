import Box from '@mui/material/Box'
import type { ChartData, ChartOptions } from 'chart.js'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'

import { useMemo } from 'react'
import type { ReportsChartProps } from './ReportsChart.interface'
import { getChartData } from './ReportsChart.utils'

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  LineController,
  BarController,
)

/**
 * Chart Options
 */

const options: ChartOptions = {
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
            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
              context.parsed.y,
            )
          }
          return label
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    yStacked: {
      stacked: true,
      display: false,
    },
  },
}

/**
 * Displays chart at top of results table with expenses shown as stacked bar chart
 * and total income shown as line chart.
 */
export default function ReportsChart({ data }: ReportsChartProps) {
  /**
   * Create chart data from ReportData
   */
  const chartData: ChartData = useMemo(() => getChartData(data), [data])

  // Render
  return (
    <Box py={3} height={300} width={`${(chartData.labels?.length ?? 1) * 151}px`}>
      <Chart type="bar" data={chartData} options={options} />
    </Box>
  )
}
