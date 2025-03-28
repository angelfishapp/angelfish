import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'

import { Avatar } from '@/components/Avatar'
import { AutocompleteField } from '@/components/forms/AutocompleteField'
import type { UserFieldProps } from './UserField.interface'

/**
 * Search field to multi-select users from the database
 */

export default React.forwardRef<HTMLDivElement, UserFieldProps>(function UserField(
  { users, onChange, value, id = 'user-field', ...formFieldProps }: UserFieldProps,
  ref,
) {
  // Render
  return (
    <AutocompleteField
      id={id}
      ref={ref}
      multiple={true}
      freeSolo={false}
      disableClearable={false}
      options={users}
      value={value}
      onChange={(_, newValue) => {
        if (newValue) {
          onChange?.(newValue)
        }
      }}
      {...formFieldProps}
      getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      filterSelectedOptions
      renderOption={(props, option) => {
        // Remove the key from props to avoid React warning about duplicate keys
        // as it uses getOptionLabel to generate the key for the ListItem which may
        // not be unique if the first and last names are the same for multiple users
        const { key: _key, ...rest } = props
        return (
          <ListItem key={option.id} {...rest}>
            <ListItemIcon sx={{ paddingRight: 10 }}>
              <Avatar
                avatar={option.avatar}
                firstName={option.first_name}
                lastName={option.last_name}
                size={30}
                displayBorder={true}
              />
            </ListItemIcon>
            <ListItemText primary={`${option.first_name} ${option.last_name}`} />
          </ListItem>
        )
      }}
      renderTags={(tags, getTagProps) => {
        return tags.map((option, index) => {
          const tagProps = getTagProps({ index })
          return (
            <Chip
              key={tagProps.key}
              data-tag-index={tagProps['data-tag-index']}
              tabIndex={tagProps.tabIndex}
              onDelete={tagProps.onDelete}
              label={`${option.first_name} ${option.last_name}`}
              avatar={
                <Avatar
                  avatar={option.avatar}
                  firstName={option.first_name}
                  lastName={option.last_name}
                  size={30}
                  displayBorder={true}
                />
              }
              sx={{
                backgroundColor: (theme) => theme.custom.colors.tagBackground,
                color: (theme) => theme.custom.colors.tagColor,
                marginLeft: 1,
              }}
            />
          )
        })
      }}
    />
  )
})
