import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import React from 'react'

import { TextField } from '../TextField'
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
      <DatePicker
        ref={ref}
        renderInput={({ inputRef, inputProps, InputProps }) => {
          const { helperText, ...fieldProps } = formFieldProps
          return (
            <TextField
              inputRef={inputRef}
              inputProps={inputProps}
              InputProps={InputProps}
              id={id}
              className={className}
              helperText={helperText ? helperText : `Format: ${inputProps?.placeholder}`}
              {...fieldProps}
            />
          )
        }}
        label="Date Picker"
        value={value}
        onChange={(date, value) => {
          onChange?.(date.toDate(), value)
        }}
        disablePast={disablePast}
        disableFuture={disableFuture}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        PaperProps={{
          sx: {
            padding: 0,
            borderRadius: 4,
          },
        }}
      />
    </LocalizationProvider>
  )
})
