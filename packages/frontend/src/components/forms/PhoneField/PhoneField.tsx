import InputAdornment from '@mui/material/InputAdornment'
import React from 'react'
import type { InputAttributes } from 'react-number-format'
import NumberFormat from 'react-number-format'

import type { PhoneCountry } from '@angelfish/core'
import { getDialCodeLookupArray, inferCountryFromPhone } from '@angelfish/core'
import { TextField } from '../TextField'
import type { PhoneFieldProps } from './PhoneField.interface'

const DEFAULT_DIAL_FORMAT = '+### ### ### ### ###'

/**
 * Helper Component for Input Field
 */

interface PhoneInputProps {
  onChange?: (event: {
    target: { name: string; value: string; validity: { valid: boolean } }
  }) => void
  name?: string
  format?: string
}

const PhoneInput = React.forwardRef<NumberFormat<InputAttributes>, PhoneInputProps>(
  function PhoneInput(props, ref) {
    const { onChange, format, name, ...other } = props

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange?.({
            target: {
              name: name ? name : '',
              value: values.value,
              validity: {
                valid: values.formattedValue
                  ? values.formattedValue.replace(/\s/g, '').length ===
                    format?.replace(/\s/g, '').length
                  : true,
              },
            },
          })
        }}
        isNumericString
        format={format}
      />
    )
  },
)

/**
 * PhoneField renders a Phone Input with Country Dropdown
 */

export default React.forwardRef<HTMLDivElement, PhoneFieldProps>(function PhoneField(
  { onChange, value = '', ...formFieldProps }: PhoneFieldProps,
  ref,
) {
  // Component State
  const [country, setCountry] = React.useState<PhoneCountry | null>(null)
  const [format, setFormat] = React.useState<string>(DEFAULT_DIAL_FORMAT)

  // Generate dialCodeLookupArray on Component Mount
  const dialCodeLookupArray = React.useMemo(getDialCodeLookupArray, [])

  // Infer country from phone number
  React.useMemo(() => {
    const inferredCountry = inferCountryFromPhone(value, dialCodeLookupArray)
    setCountry(inferredCountry)
    if (inferredCountry) {
      // Create Format
      setFormat(
        `+${'#'.repeat(inferredCountry.originalDialCodeLength ?? 0)} ${
          inferredCountry.dialFormat ? inferredCountry.dialFormat : '### ### ### ###'
        }`,
      )
    } else {
      setFormat(DEFAULT_DIAL_FORMAT)
    }
  }, [value, dialCodeLookupArray])

  // Render
  return (
    <TextField
      ref={ref}
      onChange={(event) => onChange?.(event.target.value, event.target.validity.valid)}
      value={value}
      inputComponent={PhoneInput as any}
      inputProps={{
        format,
      }}
      startAdornment={
        <InputAdornment position="start">
          <img
            src={'/assets/svg/flags/4x3/' + (country ? country.code : 'XX') + '.svg'}
            width={20}
            title={country ? country.name : 'Unknown'}
            style={{
              cursor: 'pointer',
            }}
          />
        </InputAdornment>
      }
      {...formFieldProps}
    />
  )
})
