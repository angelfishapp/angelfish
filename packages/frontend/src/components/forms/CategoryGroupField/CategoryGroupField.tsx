import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import React from 'react'

import { Emoji } from '@/components/Emoji'
import { AutocompleteField } from '@/components/forms/AutocompleteField'
import type { ICategoryGroup } from '@angelfish/core'
import type { CategoryGroupFieldProps } from './CategoryGroupField.interface'
import { StyledEmojiIcon } from './CategoryGroupField.styles'

/**
 * Form Field to select a Category Group using an Autocomplete input
 */

export default React.forwardRef<HTMLDivElement, CategoryGroupFieldProps>(
  function CategoryGroupField(
    {
      categoryGroups,
      onChange,
      value,
      id = 'CategoryGroup-Field',
      placeholder = 'Search Category Groups...',
      ...formFieldProps
    }: CategoryGroupFieldProps,
    ref,
  ) {
    /**
     * Sort Options By Type
     */
    const sortedCategoryGroups: ICategoryGroup[] = React.useMemo(() => {
      return [...categoryGroups].sort((a, b) => {
        const aGroup = a.type == 'Income' ? 'AAA-' + a.name : 'ZZZ-' + a.name
        const bGroup = b.type == 'Income' ? 'AAA-' + b.name : 'ZZZ-' + b.name
        return aGroup.localeCompare(bGroup)
      })
    }, [categoryGroups])

    // Render
    return (
      <AutocompleteField
        id={id}
        formRef={ref}
        multiple={false}
        disableClearable={false}
        options={sortedCategoryGroups}
        value={value}
        placeholder={placeholder}
        autoHighlight
        selectOnFocus
        onChange={(_, newValue) => {
          onChange?.(newValue as ICategoryGroup, value as ICategoryGroup)
        }}
        getOptionLabel={(option) => option.name}
        groupBy={(option) => {
          if (option.type == 'Income') {
            return 'Income'
          }
          return 'Expense'
        }}
        renderOption={(props, option) => {
          // Remove the key from props to avoid React warning about duplicate keys
          const { key: _key, ...rest } = props
          if (option) {
            return (
              <ListItem key={option.id} {...rest}>
                <StyledEmojiIcon>
                  <Emoji size={25} emoji={option.icon} />
                </StyledEmojiIcon>
                <span style={{ height: 24 }}>{option.name}</span>
              </ListItem>
            )
          }
          return <em>Search Category Groups...</em>
        }}
        getStartAdornment={(value) => {
          if (value && value !== null) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                <Emoji size={25} emoji={value.icon} />
              </Box>
            )
          }
          return null
        }}
        {...formFieldProps}
      />
    )
  },
)
