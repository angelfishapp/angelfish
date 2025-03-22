import ListItem from '@mui/material/ListItem'
import React from 'react'

import { AutocompleteField } from '@/components/forms/AutocompleteField'
import type { Country } from '@angelfish/core'
import { allCountries, getCountryFromCode } from '@angelfish/core'
import type { CountryFieldProps } from './CountryField.interface'
import { useStyles } from './CountryField.styles'

/**
 * Form Field to select a Country using an Autocomplete input
 */

export default React.forwardRef<HTMLDivElement, CountryFieldProps>(function CountryField(
  { onChange, value, id = 'country-field', ...formFieldProps }: CountryFieldProps,
  ref,
) {
  const classes = useStyles()

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

  /**
   * Callback to render list option
   */
  const renderOption = React.useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: Country) => {
      if (option) {
        return (
          <ListItem {...props}>
            <img
              className={classes.flag}
              src={'/assets/svg/flags/4x3/' + option.code + '.svg'}
              loading="lazy"
            />
            {option.name}
          </ListItem>
        )
      }
      return <em>Select a Country...</em>
    },
    [classes],
  )

  // Render
  return (
    <AutocompleteField
      id={id}
      formRef={ref}
      multiple={false}
      freeSolo={false}
      {...formFieldProps}
      options={sortedCountries}
      value={formValue}
      onChange={(_, newValue) => {
        onChange?.(newValue)
      }}
      getOptionLabel={(option) => option.name}
      groupBy={(option) => {
        if (option.suggested) {
          return 'Suggested'
        }
        return 'Other Countries'
      }}
      getOptionSelected={(option, value) => option.code === value.code}
      renderOption={renderOption}
      renderValue={(option) => renderOption({}, option)}
    />
  )
})
