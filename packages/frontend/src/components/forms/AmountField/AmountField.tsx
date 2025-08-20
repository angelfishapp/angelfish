import InputAdornment from '@mui/material/InputAdornment'
import React from 'react'
import { NumericFormat } from 'react-number-format'

import { TextField } from '@/components/forms/TextField'
import type { AmountFieldProps } from './AmountField.interface'

/**
 * Shows an input field for an amounts which will automatically form the input based on the currency
 */

export default React.forwardRef<HTMLInputElement, AmountFieldProps>(function AmountField(
  { allowNegative = false, currency = '$', onChange, value, ...rest }: AmountFieldProps,
  ref,
) {
  // If no value is provided, default to 0
  // Render
  return (
    <NumericFormat
      inputRef={ref}
      customInput={TextField}
      value={value}
      onValueChange={(value) => onChange?.(value.floatValue || 0)}
      thousandSeparator
      allowNegative={allowNegative}
      decimalScale={2}
      fixedDecimalScale
      slotProps={{
        input: {
          startAdornment: currency ? (
            <InputAdornment
              position="start"
              sx={{
                '& p': {
                  fontSize: (theme) => theme.typography.h5.fontSize,
                },
              }}
            >
              {currency}
            </InputAdornment>
          ) : undefined,
        },
      }}
      {...rest}
    />
  )
})
