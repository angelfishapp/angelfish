import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'

import { BankIcon } from '@/components/BankIcon'
import { AutocompleteField } from '@/components/forms/AutocompleteField'
import type { InstitutionFieldProps } from './InstitutionField.interface'

/**
 * Automcomplete Field to select a Institution from list of institutions
 */

export default React.forwardRef<HTMLDivElement, InstitutionFieldProps>(function InstitutionField(
  {
    institutions,
    onChange,
    value,
    id = 'institution-field',
    placeholder = 'Search Institutions...',
    ...formFieldProps
  }: InstitutionFieldProps,
  ref,
) {
  // Render
  return (
    <AutocompleteField
      id={id}
      formRef={ref}
      multiple={false}
      freeSolo={false}
      disableClearable={true}
      options={institutions}
      value={value}
      placeholder={placeholder}
      autoHighlight
      selectOnFocus
      onChange={(_, newValue) => {
        if (newValue) {
          onChange?.(newValue)
        }
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => {
        // Remove the key from props to avoid React warning about duplicate keys
        const { key: _key, ...rest } = props
        return (
          <ListItem key={option.id} {...rest}>
            <ListItemIcon>
              <BankIcon logo={option.logo} size={20} />
            </ListItemIcon>
            <ListItemText primary={option.name} />
          </ListItem>
        )
      }}
      getStartAdornment={(value) => {
        if (value && value !== null) {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <BankIcon logo={value.logo} size={20} />
            </Box>
          )
        }
        return null
      }}
      {...formFieldProps}
    />
  )
})
