import InfoIcon from '@mui/icons-material/Info'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

import { AutocompleteField } from '@/components/forms/AutocompleteField'
import { useTranslate } from '@/utils/i18n'
import type { AccountType } from '@angelfish/core'
import { getAccountTypeLabel, groupedAccountTypes } from '@angelfish/core'
import type { AccountTypeFieldProps } from './AccountTypeField.interface'

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
  const { fields: t } = useTranslate('components')
  // Filter options
  const filteredOptions: AccountType[] = React.useMemo(() => {
    // First filter account types
    let options = groupedAccountTypes.filter((aType) => types.includes(aType.type))

    // Filter by country if provided
    if (country) {
      options = options.filter((aType) => aType.country == country || aType.country == undefined)
    }
    return options.map((option) => ({
      ...option,
      name: t[option.name],
      description: t[option.description],
    }))
  }, [types, country, t])

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
      isOptionEqualToValue={(option, value) =>
        option.type === value.type && option.subtype === value.subtype
      }
      groupBy={(option) => t[getAccountTypeLabel(option.type)]}
      renderOption={(props, option) => {
        const { key, ...rest } = props
        return (
          <ListItem key={key} dense={true} {...rest}>
            <ListItemText primary={option.name} />
            <Tooltip
              title={t[option.description]}
              placement="right"
              slotProps={{
                tooltip: {
                  sx: {
                    maxWidth: 200,
                    backgroundColor: (theme) => theme.palette.grey[400],
                    fontSize: '1em',
                  },
                },
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
