import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
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
import React from 'react'

import type { DateRange } from '@/components/DateRangePicker'
import { DateRangeField } from '.'

const meta = {
  title: 'Components/Forms/Date Range Field',
  component: DateRangeField,
  args: {
    onChange: (value: DateRange) => action('onChange')(value),
  },
  render: ({ ...args }) => {
    const RenderComponent = () => {
      const { onChange, value, ...props } = args
      const [currentValue, setCurrentValue] = React.useState<DateRange>(value as DateRange)
      const handleChange = (date: DateRange) => {
        setCurrentValue(date)
        onChange?.(date)
      }

      return (
        <Paper>
          <DateRangeField
            onChange={handleChange}
            fullWidth={false}
            value={currentValue}
            {...props}
          />
        </Paper>
      )
    }
    return <RenderComponent />
  },
} satisfies Meta<typeof DateRangeField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

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

export const Default: Story = {
  args: {
    label: 'Date Range Field',
    helperText: '',
    error: false,
    disabled: false,
    fullWidth: false,
    required: false,
    dateRanges,
    maxDate: new Date(),
    border: true,
    displayRangeLabel: false,
  },
}
export const SelectField: Story = {
  args: {
    dateRanges,
    maxDate: new Date(),
    border: false,
    displayRangeLabel: true,
    endAdornment: <ExpandMoreIcon />,
  },
}
