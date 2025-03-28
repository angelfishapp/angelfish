import DateRangeIcon from '@mui/icons-material/DateRange'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import { format } from 'date-fns'
import React from 'react'

import type { DateRange } from '@/components/DateRangePicker'
import { DateRangePicker, isSameRange } from '@/components/DateRangePicker'
import { FormField } from '../FormField'
import type { DateRangeFieldProps } from './DateRangeField.interface'
import { StyledInputBase } from './DateRangeField.styles'

/**
 * DateRangeField renders a date range field with dropdown data range selector
 */

export default React.forwardRef<HTMLDivElement, DateRangeFieldProps>(function DateRangeField(
  {
    border = true,
    dateRanges,
    displayRangeLabel = false,
    endAdornment = <DateRangeIcon />,
    minDate,
    maxDate,
    onChange,
    value,
    ...formFieldProps
  }: DateRangeFieldProps,
  ref,
) {
  // Component State
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState<boolean>(false)

  /**
   * Renders value for input field. If displayRangeLabel is true and dateRanges are
   * supplied, will render the label for the selected date range. Otherwise will render
   * the date range as `MM/DD/YYYY - MM/DD/YYYY`
   */
  const renderValue = (value?: DateRange) => {
    if (value) {
      if (displayRangeLabel && dateRanges) {
        const range = Object.keys(dateRanges).find((key) => isSameRange(dateRanges[key], value))
        if (range) {
          return range
        }
      }
      return `${format(value.start, 'MM/dd/yyyy')} - ${format(value.end, 'MM/dd/yyyy')}`
    }
    // Return empty string if no value
    return ''
  }

  // Render
  return (
    <FormField ref={ref} {...formFieldProps}>
      <StyledInputBase
        ref={inputRef}
        border={border}
        endAdornment={endAdornment}
        placeholder="Select Date Range..."
        readOnly
        value={renderValue(value)}
        onClick={() => {
          setOpen(true)
        }}
      />
      <Popper open={open} anchorEl={inputRef?.current} placement="bottom-start">
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper
            sx={{
              padding: 0,
              borderRadius: 8,
            }}
          >
            <DateRangePicker
              dateRanges={dateRanges}
              minDate={minDate}
              maxDate={maxDate}
              onSelect={(range) => {
                onChange?.(range)
                setOpen(false)
              }}
              value={value}
            />
          </Paper>
        </ClickAwayListener>
      </Popper>
    </FormField>
  )
})
