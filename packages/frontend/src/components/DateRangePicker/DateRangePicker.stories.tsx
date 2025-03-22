import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
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

import { DateRangePicker } from '.'

/**
 * Define default date ranges for the DateRangePicker component
 */
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

/**
 * Story Book Meta
 */

const meta = {
  title: 'Components/Date Range Picker',
  component: DateRangePicker,
  args: {
    dateRanges,
    onSelect: (value) => action('onSelectAccount')(value),
  },
  render: ({ ...args }) => {
    const RenderComponent = () => {
      const { dateRanges, onSelect, minDate, maxDate, value } = args
      return (
        <Paper sx={{ padding: 0 }}>
          <DateRangePicker
            dateRanges={dateRanges}
            minDate={minDate}
            maxDate={maxDate}
            value={value}
            onSelect={(value) => onSelect?.(value)}
          />
        </Paper>
      )
    }
    return <RenderComponent />
  },
} satisfies Meta<typeof DateRangePicker>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {
    dateRanges,
    // this need to be removed or modify the type
    // minDate: null as Date,
    maxDate: startOfToday,
  },
}
export const WithValue: Story = {
  args: {
    value: { start: subMonths(startOfToday, 7), end: subMonths(startOfToday, 5) },
  },
}
