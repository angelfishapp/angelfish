import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButtom from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import React from 'react'

import type { DateRangePickerProps } from './DateRangePicker.interface'
import {
  DayButton,
  DayContainer,
  MonthContainer,
  MonthHeader,
  RangeSelectionMenu,
} from './DateRangePicker.styles'
import { getDayClassNames, isDateDisabled, isRangeSelected } from './DateRangePicker.utils'

/**
 * Provides a Date Range Picker for selecting a range of dates
 */
export default function DateRangePicker({
  dateRanges,
  minDate,
  maxDate,
  value,
  onSelect,
}: DateRangePickerProps) {
  const [rightMonth, setRightMonth] = React.useState<Date>(
    maxDate
      ? startOfMonth(new Date(maxDate.setHours(0, 0, 0, 0)))
      : startOfMonth(new Date(new Date().setHours(0, 0, 0, 0))),
  )
  const [leftMonth, setLeftMonth] = React.useState<Date>(subMonths(rightMonth, 1))
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null)
  const [startDate, setStartDate] = React.useState<Date | null>(null)
  const [endDate, setEndDate] = React.useState<Date | null>(null)

  /**
   * Update value if its changed
   */
  React.useEffect(() => {
    if (value) {
      setStartDate(value.start)
      setEndDate(value.end)
      setRightMonth(startOfMonth(value.end))
      setLeftMonth(subMonths(startOfMonth(value.end), 1))
    }
  }, [value])

  /**
   * Handle scrolling to previous month
   */
  const handlePreviousMonth = () => {
    setLeftMonth((prevLeft) => {
      const newLeft = addMonths(prevLeft, -1)
      setRightMonth(addMonths(newLeft, 1))
      return newLeft
    })
  }

  /**
   * Handle scrolling to next month
   */
  const handleNextMonth = () => {
    setRightMonth((prevRight) => {
      const newRight = addMonths(prevRight, 1)
      setLeftMonth(addMonths(newRight, -1))
      return newRight
    })
  }

  /**
   * Handle clicking on a date
   *
   * @param date The date that was clicked
   */
  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date)
      setEndDate(null)
    } else if (isAfter(date, startDate)) {
      setEndDate(date)
      onSelect?.({ start: startDate, end: date })
    } else {
      setEndDate(startDate)
      setStartDate(date)
      onSelect?.({ start: date, end: startDate })
    }
  }

  /**
   * Render a month on the date range picker
   */
  const renderMonth = (month: Date, isLeftMonth: boolean) => {
    const start = startOfWeek(startOfMonth(month))
    const end = endOfWeek(endOfMonth(month))
    const days = eachDayOfInterval({ start, end })

    return (
      <MonthContainer>
        <MonthHeader>
          <IconButton
            onClick={handlePreviousMonth}
            disabled={minDate && isBefore(endOfMonth(addMonths(leftMonth, -1)), minDate)}
            sx={{ visibility: isLeftMonth ? 'visible' : 'hidden' }}
          >
            <ChevronLeft />
          </IconButton>
          <Typography variant="subtitle1" align="center" component="span">
            {format(month, 'MMMM yyyy')}
          </Typography>
          <IconButton
            onClick={handleNextMonth}
            disabled={maxDate && isAfter(addMonths(rightMonth, 1), maxDate)}
            sx={{ visibility: isLeftMonth ? 'hidden' : 'visible' }}
          >
            <ChevronRight />
          </IconButton>
        </MonthHeader>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Typography
              key={day}
              variant="caption"
              align="center"
              component="span"
              fontWeight="bold"
            >
              {day}
            </Typography>
          ))}
          {days.map((day) => {
            const classNames = getDayClassNames(
              day,
              month,
              startDate,
              endDate,
              hoverDate,
              minDate,
              maxDate,
            )
            const isDisabled = isDateDisabled(day, month, minDate, maxDate)

            return (
              <DayContainer key={day.toISOString()} className={classNames}>
                <DayButton
                  onClick={() => !isDisabled && handleDateClick(day)}
                  onMouseEnter={() => setHoverDate(day)}
                  onMouseLeave={() => setHoverDate(null)}
                  className={classNames}
                  disabled={isDisabled}
                >
                  {format(day, 'd')}
                </DayButton>
              </DayContainer>
            )
          })}
        </Box>
      </MonthContainer>
    )
  }

  // Render
  return (
    <Box sx={{ width: '100%', margin: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {renderMonth(leftMonth, true)}
        {renderMonth(rightMonth, false)}
        {dateRanges && (
          <RangeSelectionMenu>
            <List>
              {Object.keys(dateRanges).map((key) => (
                <ListItemButtom
                  key={key}
                  onClick={() => {
                    setStartDate(dateRanges[key].start)
                    setEndDate(dateRanges[key].end)
                    onSelect?.(dateRanges[key])
                  }}
                  selected={isRangeSelected(startDate, endDate, dateRanges[key])}
                >
                  <ListItemText primary={key} />
                </ListItemButtom>
              ))}
            </List>
          </RangeSelectionMenu>
        )}
      </Box>
    </Box>
  )
}
