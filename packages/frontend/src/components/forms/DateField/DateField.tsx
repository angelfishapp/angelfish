import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import moment from 'moment'
import React from 'react'

import type { DateFieldProps } from './DateField.interface'

/**
 * DateField: Provides a TextField with popup Date picker. Must be controlled if you want to see
 * TextField value change so make sure value is updated with onChange callback. Will show default
 * helperText with current date format unless helperText is explicitly overriden.
 */

export default React.forwardRef<HTMLDivElement, DateFieldProps>(function DateField(
  {
    className,
    disablePast = false,
    disableFuture = false,
    locale = 'en',
    minDate,
    maxDate,
    onChange,
    value,
    id = 'data-picker-field',
    ...formFieldProps
  }: DateFieldProps,
  ref,
) {
  const { disabled } = formFieldProps

  // Render
  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
      <DesktopDatePicker
        ref={ref}
        slotProps={{
          textField: {
            className,
            id,
          },
          desktopPaper: {
            sx: {
              padding: 0,
              borderRadius: 4,
            },
          },
        }}
        label=""
        value={value ? moment(value) : null}
        onChange={(date) => {
          onChange?.(date.toDate())
        }}
        disablePast={disablePast}
        disableFuture={disableFuture}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
      />
    </LocalizationProvider>
  )
})
