import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subDays,
  subHours,
  subMonths,
  subYears,
} from 'date-fns'

import type { DateRange } from '@/components/DateRangePicker'
import { DateRangePicker } from '@/components/DateRangePicker'
import type { FilterViewProps } from './FilterView.interface'

/**
 * Main Filter Component for Date Column
 */
export default function DateFilter({ column, onClose }: FilterViewProps) {
  // Create some date ranges to display in right menu
  const today = new Date()
  const startOfToday = new Date(today.setHours(0, 0, 0, 0))
  const dateRanges = {
    'Last 24 Hours': { start: subHours(startOfToday, 24), end: startOfToday },
    'Last 7 days': { start: subDays(startOfToday, 7), end: startOfToday },
    'This Month': { start: startOfMonth(startOfToday), end: startOfToday },
    'Last Month': {
      start: startOfMonth(subMonths(startOfToday, 1)),
      end: endOfMonth(subMonths(startOfToday, 1)),
    },
    'This Year': { start: startOfYear(startOfToday), end: startOfToday },
    'Last Year': {
      start: startOfYear(subYears(startOfToday, 1)),
      end: endOfYear(subYears(startOfToday, 1)),
    },
  }

  // Get current filter value
  const filterValue = column.getFilterValue() as DateRange

  // Render
  return (
    <Box>
      <Box>
        <DateRangePicker
          dateRanges={dateRanges}
          maxDate={today}
          value={filterValue}
          onSelect={(dateRange) => {
            column.setFilterValue(dateRange)
            onClose()
          }}
        />
      </Box>
      <Divider />
      <Box padding={1}>
        <Button
          onClick={() => {
            column.setFilterValue(undefined)
            onClose()
          }}
        >
          Clear
        </Button>
      </Box>
    </Box>
  )
}
