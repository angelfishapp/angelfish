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
import React from 'react'
import { Chart } from 'react-chartjs-2'

import { getChartData, getChartOptions } from './NetWorthChart.utils'

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

import { DashboardChart } from '../DashboardChart'
import type { NetWorthChartProps } from './NetWorthChart.interface'

/**
 * Net Worth Chart Component
 */
export default function NetWorthChart({ currency, data }: NetWorthChartProps) {
  const chartData: ChartData = React.useMemo(() => getChartData(data), [data])
  const options: ChartOptions = React.useMemo(() => getChartOptions(currency), [currency])
  return (
    <DashboardChart title="Net Worth">
      <Box height={400}>
        <Chart type="bar" data={chartData} options={options} />
      </Box>
    </DashboardChart>
  )
}
