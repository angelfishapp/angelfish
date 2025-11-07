import Box from '@mui/material/Box'
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useGetBook, useRunReport } from '@/hooks'
import type { CategorySpendReportResults, NetWorthReportResults } from '@angelfish/core'
import { getDataSetColors } from '../../utils/palette.utils'
import { FinancialFreedomProgressBar } from './components/FinancialFreedomProgressBar'
import { IncomeAndExpensesSankey } from './components/IncomeAndExpensesSankey'
import { NetWorthChart } from './components/NetWorthChart'

/**
 * Dashboard Page of Application
 */
export default function Dashboard() {
  // React Query Hooks
  const { book } = useGetBook()
  const today = new Date()
  const startOfToday = new Date(today.setHours(0, 0, 0, 0))

  // Category Spend Report Data
  const { reportData: catSpendReportData, isFetching: catSpendReportIsFetching } = useRunReport({
    report_type: 'category_spend',
    query: {
      start_date: format(startOfMonth(subMonths(startOfToday, 12)), 'yyyy-MM-dd'),
      end_date: format(endOfMonth(subMonths(startOfToday, 1)), 'yyyy-MM-dd'),
    },
  })
  const catSpendReportResults = (catSpendReportData?.results as CategorySpendReportResults) || {
    periods: [],
    rows: [],
  }
  if (catSpendReportResults.rows.length > 0) {
    // Update row colors to ensure consistent colors across charts
    const colors = getDataSetColors(catSpendReportResults.rows)
    for (const row of catSpendReportResults.rows) {
      if (!row.color) row.color = colors[row.name]
    }
  }

  // Net Worth Report Data
  const { reportData: netWorthReportData, isFetching: netWorthReportIsFetching } = useRunReport({
    report_type: 'net_worth',
    query: {
      start_date: format(subMonths(startOfToday, 12), 'yyyy-MM-dd'),
      end_date: format(endOfMonth(subMonths(startOfToday, 1)), 'yyyy-MM-dd'),
    },
  })
  const netWorthReportResults = (netWorthReportData?.results as NetWorthReportResults) || {
    periods: [],
    rows: [],
  }

  if (catSpendReportIsFetching || netWorthReportIsFetching) return <LoadingSpinner />

  return (
    <Box py={2} px={8}>
      {!!catSpendReportData && (
        <FinancialFreedomProgressBar
          data={catSpendReportResults}
          currency={book?.default_currency as string}
        />
      )}
      {!!netWorthReportData && (
        <NetWorthChart data={netWorthReportResults} currency={book?.default_currency as string} />
      )}
      {!!catSpendReportData && (
        <IncomeAndExpensesSankey
          data={catSpendReportResults}
          currency={book?.default_currency as string}
          periods={12}
        />
      )}
    </Box>
  )
}
