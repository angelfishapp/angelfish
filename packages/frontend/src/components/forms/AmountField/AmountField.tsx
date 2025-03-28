import InputAdornment from '@mui/material/InputAdornment'
import React from 'react'
import type { InputAttributes } from 'react-number-format'
import NumberFormat from 'react-number-format'

import { TextField } from '@/components/forms/TextField'
import type { AmountFieldProps } from './AmountField.interface'

/**
 * Helper Component for Input Field
 */

interface AmountInputProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
  allowNegative?: boolean
}

const AmountInput = React.forwardRef<NumberFormat<InputAttributes>, AmountInputProps>(
  function AmountInput(props, ref) {
    const { onChange, allowNegative, name, ...other } = props

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name,
              value: values.value,
            },
          })
        }}
        thousandSeparator
        isNumericString
        allowNegative={allowNegative}
        decimalScale={2}
        fixedDecimalScale
      />
    )
  },
)

/**
 * Shows an input field for an amounts which will automatically form the input based on the currency
 */

export default React.forwardRef<HTMLDivElement, AmountFieldProps>(function AmountField(
  {
    allowNegative = false,
    currency = '$',
    defaultValue,
    onChange,
    value,
    ...textFieldProps
  }: AmountFieldProps,
  ref,
) {
  /**
   * Handle changing of input values
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(parseFloat(event.target.value))
    }
  }

  // Render
  return (
    <TextField
      ref={ref}
      defaultValue={defaultValue != undefined ? `${defaultValue}` : undefined}
      placeholder="0.00"
      onChange={handleChange}
      inputComponent={AmountInput as any}
      inputProps={{
        allowNegative,
      }}
      startAdornment={
        currency ? (
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
        ) : undefined
      }
      value={value != undefined ? `${value}` : undefined}
      {...textFieldProps}
    />
  )
})
