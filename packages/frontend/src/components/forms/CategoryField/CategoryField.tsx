import { type AutocompleteRenderGroupParams } from '@mui/material'
import Box from '@mui/material/Box'
import React, { useState } from 'react'

import BankIcon from '@/components/BankIcon/BankIcon'
import { Emoji } from '@/components/Emoji'
import AutocompleteField from '@/components/forms/AutocompleteField/AutocompleteField'
import type { IAccount } from '@angelfish/core'
import type { CategoryFieldProps } from './CategoryField.interface'
import { RenderGroup } from './components/RenderGroup'
import { RenderOption } from './components/RenderOption'

/**
 * Autocomplete Field for selecting a Category or Account
 */

export default React.forwardRef<HTMLDivElement, CategoryFieldProps>(function CategoryField(
  {
    variant = 'dropdown',
    value,
    accountsWithRelations,
    disableTooltip = false,
    disableGroupBy = false,
    filter,
    filterOptions: componentFilterOptions,
    onChange,
    onCreate,
    placeholder = 'Search Categories...',
    renderAsValue = true,
    id = 'category-field',
    ...formFieldProps
  }: CategoryFieldProps,
  ref,
) {
  // states to handle multi-select variant
  const [selected, setSelected] = useState<IAccount[]>([])
  const [isOpen, setIsOpen] = useState(variant === 'multi-box' ? true : false)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

  // handling variant type
  const isMultiBox = variant === 'multi-box'
  // handling collapsing and expanding the group
  const handleGroupToggle = (group: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }))
  }
  // handling the case when the user selects/de-select a group checkbox
  const handleGroupSelect = (groupName: string, checked: boolean) => {
    const groupOptions: IAccount[] = sortedAccounts.filter(
      (o: IAccount) => o?.categoryGroup?.name === groupName,
    )

    if (checked) {
      // Add all from group if not already selected
      const toAdd = groupOptions.filter(
        (item: IAccount) => !selected.some((s) => s.name === item.name),
      )
      setSelected([...selected, ...toAdd])
    } else {
      // Remove all from group
      setSelected(selected.filter((item) => item.categoryGroup?.name !== groupName))
    }
  }
  // handling the case when the user selects an option for group checkbox
  const isGroupChecked = (groupName: string) => {
    const groupOptions = sortedAccounts?.filter(
      (o: IAccount) => o?.categoryGroup?.name === groupName,
    )
    return groupOptions.every((item) => selected.some((s) => s.name === item.name))
  }
  /**
   * Optionally filter then Sort Options By Category Group
   */
  const sortedAccounts: IAccount[] = React.useMemo(() => {
    if (accountsWithRelations?.length > 0) {
      // First filter accounts if filter function provided
      let filteredAccounts = accountsWithRelations
      if (filter) {
        filteredAccounts = accountsWithRelations.filter(filter)
      }
      return [...filteredAccounts].sort((a, b) => {
        const aGroup = a.class == 'CATEGORY' ? (a.categoryGroup?.name ?? '') : 'ZZZZ'
        const bGroup = b.class == 'CATEGORY' ? (b.categoryGroup?.name ?? '') : 'ZZZZ'
        return aGroup.localeCompare(bGroup)
      })
    }
    return []
  }, [accountsWithRelations, filter])

  /**
   * Improve performance of filtering options by pre-calculating search
   * strings for each option
   */
  const searchOptions = React.useMemo(() => {
    const searchOptions: Record<string, string> = {}
    for (const account of sortedAccounts) {
      if (account.class == 'CATEGORY') {
        searchOptions[account.id] =
          `${account.name} ${account.categoryGroup?.name}  ${account.cat_description}`.toLowerCase()
      } else {
        searchOptions[account.id] = `${account.name} ${account.institution?.name}`.toLowerCase()
      }
    }
    return searchOptions
  }, [sortedAccounts])

  // Render
  return (
    <AutocompleteField
      id={id}
      formRef={ref}
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      multiple={isMultiBox}
      freeSolo={onCreate ? true : false}
      disableClearable={false}
      options={sortedAccounts}
      value={!isMultiBox ? value : selected}
      placeholder={placeholder}
      autoHighlight
      selectOnFocus
      onChange={(_, newValue) => {
        if (newValue) {
          if (typeof newValue !== 'string') {
            if (newValue.id == 0) {
              onCreate?.(newValue.acc_type)
            } else {
              onChange(newValue)
            }
          } else {
            onCreate?.(newValue)
          }
        } else {
          // Unclassified
          onChange(null)
        }
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option
        }
        if (option.id == 0) {
          return option.acc_type ?? ''
        }
        if (renderAsValue) {
          // Only render the name if renderAsValue is true
          return option.name
        }
        // Otherwise return full label, i.e. "Category Group > Category Name"
        if (option.class == 'CATEGORY') {
          return (option.categoryGroup?.name ?? '') + ' > ' + option.name
        }
        return (option.institution?.name ?? '') + ' > ' + option.name
      }}
      groupBy={
        !disableGroupBy
          ? (option) => {
            if (option.class == 'CATEGORY') {
              if (option.id != 0) {
                return option.categoryGroup?.name ?? ''
              }
              return ''
            }
            return 'Account Transfer'
          }
          : undefined
      }
      virtualize={false}
      renderGroup={(params: AutocompleteRenderGroupParams) => (
        <RenderGroup
          params={params}
          collapsedGroups={collapsedGroups}
          handleGroupToggle={handleGroupToggle}
          isGroupChecked={isGroupChecked}
          handleGroupSelect={handleGroupSelect}
          variant={variant}
        />
      )}
      renderOption={(props, option) => (
        <RenderOption
          props={props}
          option={option}
          selected={selected}
          setSelected={setSelected}
          disableTooltip={disableTooltip}
          variant={variant}
        />
      )}
      filterOptions={(options, params) => {
        if (params.inputValue != '') {
          const searchTerm = params.inputValue.toLowerCase()
          const filtered = options.filter((account) => {
            return searchOptions[account.id].indexOf(searchTerm) > -1
          })

          if (filtered.length < 1 && onCreate) {
            // Suggest the creation of a new Category
            filtered.push({
              id: 0,
              name: `Create "${params.inputValue}"`,
              acc_type: params.inputValue,
              class: 'CATEGORY',
              cat_icon: 'new',
              cat_description: 'Create New Category',
              created_on: new Date(),
              modified_on: new Date(),
              current_balance: 0,
              local_current_balance: 0,
            })
          }

          // If filterOptions provided, apply it
          if (componentFilterOptions) {
            return componentFilterOptions(filtered, params)
          }

          return filtered
        }

        // If filterOptions provided, apply it
        if (componentFilterOptions) {
          return componentFilterOptions(options, params)
        }

        // Return all options
        return options
      }}
      getStartAdornment={(value) => {
        if (value && value !== null && typeof value !== 'string' && renderAsValue) {
          if (value.id == 0) {
            // Render Create Category Icon
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                <Emoji size={24} emoji={value.cat_icon ?? ''} />
              </Box>
            )
          }
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {value.class == 'CATEGORY' ? (
                <React.Fragment>
                  <Emoji size={24} emoji={value.cat_icon ?? ''} style={{ marginRight: 8 }} />
                  {value.categoryGroup?.name} &gt;
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <BankIcon logo={value.institution?.logo} size={24} style={{ marginRight: 8 }} />
                  {value.institution?.name} &gt;
                </React.Fragment>
              )}
            </Box>
          )
        }
        return null
      }}
      {...formFieldProps}
    />
  )
})
