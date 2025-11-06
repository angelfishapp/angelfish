import Box from '@mui/material/Box'
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useGetBook, useRunReport } from '@/hooks'
import type { CategorySpendReportResults } from '@angelfish/core'
import { getDataSetColors } from '../../utils/palette.utils'
import { FinancialFreedomProgressBar } from './components/FinancialFreedomProgressBar'
import { IncomeAndExpensesSankey } from './components/IncomeAndExpensesSankey'

/**
 * Dashboard Page of Application
 */
export default function Dashboard() {
  // React Query Hooks
  const { book } = useGetBook()
  const today = new Date()
  const startOfToday = new Date(today.setHours(0, 0, 0, 0))
  const { reportData, isFetching } = useRunReport({
    report_type: 'category_spend',
    query: {
      start_date: format(startOfMonth(subMonths(startOfToday, 12)), 'yyyy-MM-dd'),
      end_date: format(endOfMonth(subMonths(startOfToday, 1)), 'yyyy-MM-dd'),
    },
  })
  const reportResults = (reportData?.results as CategorySpendReportResults) || {
    periods: [],
    rows: [],
  }

  if (reportResults.rows.length > 0) {
    // Update row colors to ensure consistent colors across charts
    const colors = getDataSetColors(reportResults.rows)
    for (const row of reportResults.rows) {
      if (!row.color) row.color = colors[row.name]
    }
  }

  if (isFetching) return <LoadingSpinner />

  return (
    <Box py={2} px={8}>
      {!!reportData && (
        <FinancialFreedomProgressBar
          data={reportResults}
          currency={book?.default_currency as string}
        />
      )}
      {!!reportData && (
        <IncomeAndExpensesSankey
          data={reportResults}
          currency={book?.default_currency as string}
          periods={12}
        />
      )}
    </Box>
  )
}
