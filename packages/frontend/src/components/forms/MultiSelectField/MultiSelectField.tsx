import { Button, Container, Typography, type AutocompleteRenderGroupParams } from '@mui/material'
import Box from '@mui/material/Box'
import React, { useMemo, useState } from 'react'

import BankIcon from '@/components/BankIcon/BankIcon'
import { Emoji } from '@/components/Emoji'
import AutocompleteField from '@/components/forms/AutocompleteField/AutocompleteField'
import type { IAccount } from '@angelfish/core'
import type { MultiSelectFieldProps } from './MultiSelectField.interface'
import { CustomListbox, CustomPopper } from './components/AutoCompleteFooter'
import MultiSelectFieldHeader from './components/MultiSelectFieldHeader'
import MultiSelectSelectionBox from './components/MultiSelectSelectionBox'
import { RenderGroup } from './components/RenderGroup'
import { RenderOption } from './components/RenderOption'

/**
 * Autocomplete Field for selecting a Category or Account
 */
type FilterMode = 'all' | 'include' | 'exclude'

export default React.forwardRef<HTMLDivElement, MultiSelectFieldProps>(function CategoryField(
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
  }: MultiSelectFieldProps,
  ref,
) {
  // states to handle multi-select variant
  const [selected, setSelected] = useState<IAccount[]>([])
  const [isOpen, setIsOpen] = useState(variant === 'multi-box' ? true : false)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})
  const [filterMode, setFilterMode] = useState<FilterMode>('all')

  // Handle filter mode change
  const handleFilterModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilterMode: FilterMode | null,
  ) => {
    if (newFilterMode !== null) {
      setFilterMode(newFilterMode)
    }
  }
  // Clear all selections
  const handleClearAll = () => {
    setSelected([])
  }

  // handling variant type
  const isMultiBox = variant === 'multi-box'

  /**
   * Optionally filter then Sort Options By Category Group
   */

  const sortedAccounts: IAccount[] = React.useMemo(() => {
    if (accountsWithRelations?.length > 0) {
      // 1. Optional external filter
      let filteredAccounts = filter ? accountsWithRelations.filter(filter) : accountsWithRelations

      // 2. Prepare selected IDs for easier comparison
      const selectedIds = new Set(selected.map((acc) => acc.id))

      // 3. Apply FilterMode logic
      filteredAccounts = filteredAccounts.filter((account) => {
        switch (filterMode) {
          case 'include':
            return selectedIds.has(account.id)
          case 'exclude':
            return !selectedIds.has(account.id)
          case 'all':
          default:
            return true
        }
      })

      // 4. Sort logic
      return [...filteredAccounts].sort((a, b) => {
        const aGroup = a.class === 'CATEGORY' ? (a.categoryGroup?.name ?? '') : 'ZZZZ'
        const bGroup = b.class === 'CATEGORY' ? (b.categoryGroup?.name ?? '') : 'ZZZZ'
        return aGroup.localeCompare(bGroup)
      })
    }

    return []
  }, [accountsWithRelations, filter, filterMode, selected])

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
  const allSelected = useMemo(
    () =>
      sortedAccounts.length > 0 &&
      sortedAccounts.every((o) => selected.some((s) => s.name === o.name)),
    [selected, sortedAccounts],
  )

  const handleToggleAll = () => {
    if (allSelected) {
      setSelected([])
    } else {
      setSelected([...sortedAccounts])
    }
  }
  // Render
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Category Selection
      </Typography>
      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <MultiSelectFieldHeader
            selected={selected}
            filterMode={filterMode}
            handleClearAll={handleClearAll}
            handleFilterModeChange={handleFilterModeChange}
          />
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
            value={value}
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
            slots={{ popper: CustomPopper, listbox: CustomListbox }}
            slotProps={{
              listbox: {
                button: (
                  <Button onClick={handleToggleAll} size="small">
                    {!allSelected ? 'Toggle All' : 'Clear All'}
                  </Button>
                ),
              } as React.ComponentPropsWithRef<'ul'>,
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
                selected={selected}
                setCollapsedGroups={setCollapsedGroups}
                setSelected={setSelected}
                sortedAccounts={sortedAccounts}
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
                        <BankIcon
                          logo={value.institution?.logo}
                          size={24}
                          style={{ marginRight: 8 }}
                        />
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
        </Box>
        <MultiSelectSelectionBox selected={selected} />
      </Box>
    </Container>
  )
})
