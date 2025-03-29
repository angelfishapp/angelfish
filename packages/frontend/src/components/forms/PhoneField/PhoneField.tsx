import InputAdornment from '@mui/material/InputAdornment'
import React from 'react'
import { PatternFormat } from 'react-number-format'

import type { PhoneCountry } from '@angelfish/core'
import { getDialCodeLookupArray, inferCountryFromPhone } from '@angelfish/core'
import { TextField } from '../TextField'
import type { PhoneFieldProps } from './PhoneField.interface'

const DEFAULT_DIAL_FORMAT = '+### ### ### ### ###'

/**
 * PhoneField renders a Phone Input with Country Dropdown
 */

export default React.forwardRef<HTMLInputElement, PhoneFieldProps>(function PhoneField(
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
    <PatternFormat
      customInput={TextField}
      getInputRef={ref}
      format={format}
      allowEmptyFormatting
      defaultValue={value}
      valueIsNumericString={true}
      onValueChange={(values) => {
        onChange?.(
          values.formattedValue,
          values.formattedValue
            ? values.formattedValue.replace(/\s/g, '').length === format?.replace(/\s/g, '').length
            : false,
        )
      }}
      slotProps={{
        input: {
          startAdornment: (
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
          ),
        },
      }}
      {...formFieldProps}
    />
  )
})
