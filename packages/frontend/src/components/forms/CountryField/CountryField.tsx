import Box from '@mui/material/Box'
import React from 'react'

import type { Country } from '@angelfish/core'
import { allCountries, getCountryFromCode } from '@angelfish/core'
import { AutocompleteField } from '../AutocompleteField'
import type { CountryFieldProps } from './CountryField.interface'

/**
 * Form Field to select a Country using an Autocomplete input
 */
export default React.forwardRef<HTMLDivElement, CountryFieldProps>(function CountryField(
  {
    onChange,
    value,
    id = 'country-field',
    placeholder = 'Search Countries...',
    ...formFieldProps
  }: CountryFieldProps,
  ref,
) {
  // Convert string value to Country
  const formValue: Country | null = value
    ? typeof value === 'string'
      ? getCountryFromCode(value)
      : value
    : null

  /**
   * Sort Options By Suggested
   */
  const sortedCountries: Country[] = React.useMemo(() => {
    return [...allCountries].sort((a, b) => {
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
      options={sortedCountries}
      placeholder={placeholder}
      autoHighlight
      selectOnFocus
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => {
        // Remove the key from props to avoid React warning about duplicate keys
        const { key: _key, ...rest } = props
        return (
          <Box
            component="li"
            key={option.code}
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...rest}
          >
            <img
              src={'/assets/svg/flags/4x3/' + option.code + '.svg'}
              alt={option.name}
              width={20}
              style={{ marginRight: 10 }}
              loading="lazy"
            />
            {option.name}
          </Box>
        )
      }}
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
                src={'/assets/svg/flags/4x3/' + value.code + '.svg'}
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
