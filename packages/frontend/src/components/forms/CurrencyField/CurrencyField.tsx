import ListItem from '@mui/material/ListItem'
import React from 'react'

import { AutocompleteField } from '@/components/forms/AutocompleteField'
import type { Currency } from '@angelfish/core'
import { allCurrencies, getCurrencyFromCode } from '@angelfish/core'
import type { CurrencyFieldProps } from './CurrencyField.interface'
import { useStyles } from './CurrencyField.styles'

/**
 * Automcomplete Field to select a Currency from list of currencies
 */

export default React.forwardRef<HTMLDivElement, CurrencyFieldProps>(function CurrencyField(
  { onChange, value, id = 'currency-field', ...formFieldProps }: CurrencyFieldProps,
  ref,
) {
  const classes = useStyles()

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

  /**
   * Callback to render list option
   */
  const renderOption = React.useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: Currency) => {
      if (option) {
        return (
          <ListItem {...props}>
            <img
              className={classes.flag}
              src={'/assets/svg/flags/4x3/' + option.flag + '.svg'}
              loading="lazy"
            />
            {option.name} ({option.code})
          </ListItem>
        )
      }
      return <em>Select a Currency...</em>
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
      options={sortedCurrencies}
      value={formValue}
      onChange={(_, newValue) => {
        onChange?.(newValue)
      }}
      getOptionLabel={(option) => `${option.name} (${option.code})`}
      groupBy={(option) => {
        if (option.suggested) {
          return 'Suggested'
        }
        return 'Other Currencies'
      }}
      getOptionSelected={(option, value) => option.code === value.code}
      renderOption={renderOption}
      renderValue={(option) => renderOption({}, option)}
    />
  )
})
