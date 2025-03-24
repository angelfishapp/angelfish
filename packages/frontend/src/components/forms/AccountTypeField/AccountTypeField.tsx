import InfoIcon from '@mui/icons-material/Info'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

import { AutocompleteField } from '@/components/forms/AutocompleteField'
import type { AccountType } from '@angelfish/core'
import { getAccountTypeLabel, groupedAccountTypes } from '@angelfish/core'
import type { AccountTypeFieldProps } from './AccountTypeField.interface'
import { useStyles } from './AccountTypeField.styles'

/**
 * Displays autocomplete search field to select an account type
 */

export default React.forwardRef<HTMLDivElement, AccountTypeFieldProps>(function AcountTypeField(
  {
    country,
    onChange,
    types = ['depository', 'credit'],
    value,
    id = 'account-type-field',
    placeholder = 'Search Account Types...',
    ...formFieldProps
  }: AccountTypeFieldProps,
  ref,
) {
  const classes = useStyles()

  // Filter options
  const filteredOptions: AccountType[] = React.useMemo(() => {
    // First filter account types
    let options = groupedAccountTypes.filter((aType) => types.includes(aType.type))
    // Filter by country if provided
    if (country) {
      options = options.filter((aType) => aType.country == country || aType.country == undefined)
    }
    return options
  }, [types, country])

  // Render
  return (
    <AutocompleteField
      id={id}
      formRef={ref}
      multiple={false}
      freeSolo={false}
      disableClearable={false}
      options={filteredOptions}
      value={value}
      placeholder={placeholder}
      autoHighlight
      selectOnFocus
      onChange={(_, newValue) => {
        if (newValue) {
          onChange?.(newValue)
        }
      }}
      getOptionLabel={(option) => option.name}
      groupBy={(option) => getAccountTypeLabel(option.type)}
      renderOption={(props, option) => {
        const { key, ...rest } = props
        return (
          <ListItem key={key} dense={true} {...rest}>
            <ListItemText primary={option.name} />
            <Tooltip
              title={option.description}
              placement="right"
              classes={{
                tooltip: classes.descriptionTooltip,
              }}
            >
              <InfoIcon fontSize="small" color="primary" />
            </Tooltip>
          </ListItem>
        )
      }}
      {...formFieldProps}
    />
  )
})
