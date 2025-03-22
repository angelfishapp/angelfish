import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'

import { BankIcon } from '@/components/BankIcon'
import { AutocompleteField } from '@/components/forms/AutocompleteField'
import type { IInstitution } from '@angelfish/core'
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
    ...formFieldProps
  }: InstitutionFieldProps,
  ref,
) {
  /**
   * Callback to render list option
   */
  const renderOption = React.useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: IInstitution) => {
      if (option) {
        return (
          <ListItem {...props} sx={Object.keys(props).length === 0 ? { height: 25 } : undefined}>
            <ListItemIcon>
              <BankIcon logo={option.logo} size={20} />
            </ListItemIcon>
            <ListItemText primary={option.name} />
          </ListItem>
        )
      }
      return <em>Select a Institution...</em>
    },
    [],
  )

  // Render
  return (
    <AutocompleteField
      id={id}
      formRef={ref}
      multiple={false}
      freeSolo={false}
      disableClearable={true}
      {...formFieldProps}
      options={institutions}
      value={value}
      onChange={(_, newValue) => {
        if (newValue) {
          onChange?.(newValue)
        }
      }}
      getOptionLabel={(option) => option.name}
      getOptionSelected={(option, value) => option.id === value.id}
      renderOption={renderOption}
      renderValue={(option) => renderOption({}, option)}
    />
  )
})
