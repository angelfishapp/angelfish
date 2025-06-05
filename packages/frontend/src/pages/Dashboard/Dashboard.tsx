import Box from '@mui/material/Box'
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns'
import React from 'react'

import { AppCommandIds, CommandsClient } from '@angelfish/core'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useGetBook } from '@/hooks'
import type { ReportsData } from '@angelfish/core'
import { getDataSetColors } from '../../utils/palette.utils'
import { FinancialFreedomProgressBar } from './components/FinancialFreedomProgressBar'
import { IncomeAndExpensesSankey } from './components/IncomeAndExpensesSankey'

/**
 * Dashboard Page of Application
 */
export default function Dashboard() {
  // Component State
  const [yearlyData, setYearlyData] = React.useState<ReportsData>()
  const { book, isLoading } = useGetBook()

  // Get Reports Data when date ranges changed
  React.useEffect(() => {
    const today = new Date()
    const startOfToday = new Date(today.setHours(0, 0, 0, 0))
    CommandsClient.executeAppCommand(AppCommandIds.RUN_REPORT, {
      start_date: format(startOfMonth(subMonths(startOfToday, 12)), 'yyyy-MM-dd'),
      end_date: format(endOfMonth(subMonths(startOfToday, 1)), 'yyyy-MM-dd'),
    }).then((data) => {
      // Update row colors to ensure consistent colors across charts
      const colors = getDataSetColors(data.rows)
      for (const row of data.rows) {
        if (!row.color) row.color = colors[row.name]
      }
      setYearlyData(data)
    })
  }, [])
  if (isLoading) return <LoadingSpinner />
  return (
    <Box py={2} px={8}>
      {!!yearlyData && (
        <FinancialFreedomProgressBar
          data={yearlyData}
          currency={book?.default_currency as string}
        />
      )}
      {!!yearlyData && (
        <IncomeAndExpensesSankey
          data={yearlyData}
          currency={book?.default_currency as string}
          periods={12}
        />
      )}
    </Box>
  )
}
