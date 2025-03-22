import ListItem from '@mui/material/ListItem'
import React from 'react'

import { Emoji } from '@/components/Emoji'
import { AutocompleteField } from '@/components/forms/AutocompleteField'
import type { ICategoryGroup } from '@angelfish/core'
import type { CategoryGroupFieldProps } from './CategoryGroupField.interface'
import { useStyles } from './CategoryGroupField.styles'

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
      ...formFieldProps
    }: CategoryGroupFieldProps,
    ref,
  ) {
    const classes = useStyles()

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

    /**
     * Callback to render list option
     */
    const renderOption = React.useCallback(
      (props: React.HTMLAttributes<HTMLLIElement>, option: ICategoryGroup) => {
        if (option) {
          return (
            <ListItem {...props}>
              <span className={classes.emojiIcon}>
                <Emoji size={25} emoji={option.icon} />
              </span>
              <span className={classes.name}>{option.name}</span>
            </ListItem>
          )
        }
        return <em>Search Category Groups...</em>
      },
      [classes],
    )

    // Render
    return (
      <AutocompleteField
        id={id}
        formRef={ref}
        multiple={false}
        {...formFieldProps}
        options={sortedCategoryGroups}
        value={value}
        onChange={(_, newValue) => {
          onChange?.(newValue as ICategoryGroup, value as ICategoryGroup)
        }}
        getOptionLabel={(option) => option.name}
        getOptionSelected={(option, value) => option.id == value?.id}
        groupBy={(option) => {
          if (option.type == 'Income') {
            return 'Income'
          }
          return 'Expense'
        }}
        renderOption={renderOption}
        renderValue={(option) => renderOption({}, option)}
        placeholder="Search Category Groups..."
      />
    )
  },
)
