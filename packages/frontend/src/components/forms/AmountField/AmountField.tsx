import InputAdornment from '@mui/material/InputAdornment'
import React from 'react'
import { NumericFormat } from 'react-number-format'

import { TextField } from '@/components/forms/TextField'
import { getCurrencyFromCode } from '@angelfish/core'
import type { AmountFieldProps } from './AmountField.interface'

/**
 * Shows an input field for an amounts which will automatically form the input based on the currency
 */

export default React.forwardRef<HTMLInputElement, AmountFieldProps>(function AmountField(
  { allowNegative = false, currency = 'USD', onChange, value, ...rest }: AmountFieldProps,
  ref,
) {
  const currencySymbol = getCurrencyFromCode(currency)?.symbol || '$'

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
              {currencySymbol}
            </InputAdornment>
          ) : undefined,
        },
      }}
      {...rest}
    />
  )
})
