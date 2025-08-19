import Paper from '@mui/material/Paper'
import type { ChartData, ChartOptions } from 'chart.js'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import color from 'color'
import React from 'react'
import { Line } from 'react-chartjs-2'

import theme from '@/app/theme'
import { useI18n } from '@/utils/i18n/I18nProvider'
import type { ChartProps } from './Chart.interface'
import { getChartData } from './Chart.utils'

ChartJS.register(CategoryScale, Filler, LinearScale, PointElement, LineElement, Tooltip)

/**
 * Chart Options
 */

const options: ChartOptions<'line'> = {
  maintainAspectRatio: false,
  animation: {
    duration: 0,
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label(tooltipItem) {
          return '$' + tooltipItem.formattedValue
        },
      },
    },
  },
  interaction: {
    intersect: false,
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        // Include a dollar sign in the ticks
        callback(value) {
          return '$' + value
        },
      },
    },
  },
}

/**
 * Renders main Chart showing Account Balance on Accounts Page
 */

export default function Chart({ account, transactions }: ChartProps) {
  const { locale } = useI18n()
  const chartRef = React.useRef<ChartJS<'line', number[], string>>(null)
  const [chartData, setChartData] = React.useState<ChartData<'line'>>({
    datasets: [],
  })
  /**
   * Create chart data from transactions
   */
  React.useEffect(() => {
    const chart = chartRef.current

    if (!chart) {
      return
    }

    const { labels, balance } = getChartData(transactions, account.acc_start_balance, locale)
    // Create Gradient Background
    const ctx = chart.ctx
    const gradient = ctx.createLinearGradient(0, 0, 0, 480)
    gradient.addColorStop(0, color(theme.palette.primary.light).fade(1).string())
    gradient.addColorStop(1, color(theme.palette.primary.dark).fade(0.1).string())

    // Make sure chart stays in page width if container is resized
    chart.canvas.style.maxWidth = '100%'

    setChartData({
      labels,
      datasets: [
        {
          label: 'Account Balance',
          data: balance,
          fill: 'stack',
          backgroundColor: gradient,
          borderColor: color(theme.palette.primary.main).fade(0.33).rgb().string(),
          borderWidth: 1,
          pointRadius: 4,
          pointBorderColor: 'rgba(255,255,255,0.0)',
          pointBackgroundColor: 'rgba(255,255,255,0.0)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: theme.palette.primary.main,
          pointHoverRadius: 4,
        },
      ],
    })
  }, [transactions, account.acc_start_balance, locale])

  // Render
  return (
    <Paper
      sx={{
        height: 250,
        marginBottom: 2,
        padding: 1,
      }}
    >
      <Line ref={chartRef} data={chartData} options={options} />
    </Paper>
  )
}
