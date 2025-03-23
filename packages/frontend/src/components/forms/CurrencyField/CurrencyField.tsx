import Box from '@mui/material/Box'
import React from 'react'

import { AutocompleteField } from '@/components/forms/AutocompleteField'
import type { Currency } from '@angelfish/core'
import { allCurrencies, getCurrencyFromCode } from '@angelfish/core'
import type { CurrencyFieldProps } from './CurrencyField.interface'

/**
 * Automcomplete Field to select a Currency from list of currencies
 */

export default React.forwardRef<HTMLDivElement, CurrencyFieldProps>(function CurrencyField(
  { onChange, value, id = 'currency-field', ...formFieldProps }: CurrencyFieldProps,
  ref,
) {
  // Convert string value to Currency
  const formValue: Currency | null = value
    ? typeof value === 'string'
      ? getCurrencyFromCode(value.toUpperCase())
      : value
    : null

  /**
   * Sort Options By Suggested
   */
  const sortedCurrencies: Currency[] = React.useMemo(() => {
    return [...allCurrencies].sort((a, b) => {
      const aGroup = a.suggested ? 'AAA-' + a.name : 'ZZZ-' + a.name
      const bGroup = b.suggested ? 'AAA-' + b.name : 'ZZZ-' + b.name
      return aGroup.localeCompare(bGroup)
    })
  }, [])

  // Render
  return (
    <AutocompleteField
      id={id}
      freeSolo={false}
      multiple={false}
      disableClearable={false}
      formRef={ref}
      value={formValue}
      onChange={(_event, newValue) => {
        onChange?.(newValue)
      }}
      options={sortedCurrencies}
      autoHighlight
      getOptionLabel={(option) => `${option.name} (${option.code})`}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
          key={option.code}
        >
          <img
            src={'/assets/svg/flags/4x3/' + option.flag + '.svg'}
            alt={option.name}
            width={20}
            style={{ marginRight: 10 }}
            loading="lazy"
          />
          {option.name} ({option.code})
        </Box>
      )}
      groupBy={(option) => {
        if (option.suggested) {
          return 'Suggested'
        }
        return 'Other Countries'
      }}
      getStartAdornment={(value) => {
        if (value && value !== null) {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <img
                src={'/assets/svg/flags/4x3/' + value.flag + '.svg'}
                alt={value.name}
                width={20}
                style={{ marginRight: 10 }}
                loading="lazy"
              />
            </Box>
          )
        }
        return null
      }}
      {...formFieldProps}
    />
  )
})
