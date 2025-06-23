import InfoIcon from '@mui/icons-material/Info'
import type { AutocompleteRenderGroupParams } from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListSubheader from '@mui/material/ListSubheader'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { FilterOptionsState } from '@mui/material/useAutocomplete'
import React from 'react'

import BankIcon from '@/components/BankIcon/BankIcon'
import { CategoryLabel } from '@/components/CategoryLabel'
import { Emoji } from '@/components/Emoji'
import type { IAccount } from '@angelfish/core'
import { AutocompleteField } from '../AutocompleteField'
import { MultiSelectField } from '../MultiSelectField'
import type { CategoryFieldProps } from './CategoryField.interface'

/**
 * Autocomplete Field for selecting a Category or Account
 */

export default React.forwardRef<HTMLDivElement, CategoryFieldProps>(function CategoryField(
  {
    accountsWithRelations,
    disableTooltip = false,
    disableGroupBy = false,
    filter,
    filterOptions: componentFilterOptions,
    placeholder = 'Search Categories...',
    id = 'category-field',
    ...props
  }: CategoryFieldProps,
  ref,
) {
  // Use the variant prop, defaulting to 'autocomplete' if not provided
  props.variant = props.variant || 'autocomplete'
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
        // Put CATEGORYs first, then ACCOUNTs at the bottom, sorted by institution name
        if (a.class === 'CATEGORY' && b.class === 'ACCOUNT') return -1
        if (a.class === 'ACCOUNT' && b.class === 'CATEGORY') return 1

        if (a.class === 'CATEGORY' && b.class === 'CATEGORY') {
          const aGroup = a.categoryGroup?.name ?? ''
          const bGroup = b.categoryGroup?.name ?? ''
          return aGroup.localeCompare(bGroup)
        }

        // Both are ACCOUNT
        const aInstitution = a.institution?.name ?? ''
        const bInstitution = b.institution?.name ?? ''
        return aInstitution.localeCompare(bInstitution)
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

  /**
   * Group By Function to group options by Category Group
   */
  const groupBy = React.useCallback((option: IAccount) => {
    if (option.class == 'CATEGORY') {
      if (option.id != 0) {
        return option.categoryGroup?.name ?? ''
      }
      return ''
    }
    return 'Account Transfer'
  }, [])

  /**
   * Filter Function to filter options while typing in the search field.
   */
  const filterOptions = React.useCallback(
    (options: IAccount[], params: FilterOptionsState<IAccount>) => {
      if (params.inputValue != '') {
        const searchTerm = params.inputValue.toLowerCase()
        const filtered = options.filter((account) => {
          return searchOptions[account.id].indexOf(searchTerm) > -1
        })

        if (filtered.length < 1 && props.variant === 'autocomplete' && props.onCreate) {
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
    },
    [searchOptions, props, componentFilterOptions],
  )

  // Render Multiselect Variant
  if (props.variant === 'multiselect') {
    const { value, onChange, ...rest } = props
    return (
      <MultiSelectField
        id={id}
        formRef={ref}
        options={sortedAccounts}
        groupBy={!disableGroupBy ? (props.groupBy ? props.groupBy : groupBy) : undefined}
        filterOptions={filterOptions}
        getOptionKey={(option) => option.id}
        getOptionLabel={(option) => {
          if (option.class == 'CATEGORY') {
            return (option.categoryGroup?.name ?? '') + ' > ' + option.name
          }
          return (option.institution?.name ?? '') + ' > ' + option.name
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_, newValue) => {
          onChange(newValue)
        }}
        renderOption={(option) => {
          const tooltipTitle =
            option.class == 'CATEGORY' ? option.cat_description : 'Account Transfer'
          return (
            <Box display="flex" alignItems="center" width="100%">
              <Box minWidth={200} flexGrow={1}>
                <CategoryLabel account={option} displayGroup={false} />
              </Box>
              {!disableTooltip && (
                <Box>
                  <Tooltip
                    title={tooltipTitle}
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
                </Box>
              )}
            </Box>
          )
        }}
        placeholder={placeholder}
        value={value}
        {...rest}
      />
    )
  }

  // Render Autocomplete Variant
  if (props.variant === 'autocomplete') {
    const { value, onCreate, renderAsValue = true, onChange, ...formFieldProps } = props
    return (
      <AutocompleteField
        id={id}
        formRef={ref}
        multiple={false}
        freeSolo={onCreate ? true : false}
        disableClearable={false}
        options={sortedAccounts}
        value={value as IAccount | null | undefined}
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
        groupBy={!disableGroupBy ? groupBy : undefined}
        virtualize={false}
        renderGroup={(params: AutocompleteRenderGroupParams) => {
          if (!params.group) {
            return [params.children]
          }

          return [
            <ListSubheader key={params.key} component="div">
              {params.group}
            </ListSubheader>,
            params.children,
          ]
        }}
        renderOption={(props, option) => {
          // Remove the key from props to avoid React warning about
          // spread JSX and duplicate keys
          const { key: _key, ...rest } = props

          if (option.id == 0) {
            // Render Create Category Option if onCreate provided
            return (
              <ListItem key={option.id} {...rest}>
                <Box display="flex" alignItems="center" width="100%">
                  <Box marginRight={1}>
                    <Emoji size={24} emoji={option.cat_icon ?? ''} />
                  </Box>
                  <Box minWidth={200} flexGrow={1}>
                    <Typography style={{ lineHeight: 1.1 }}>{option.name}</Typography>
                  </Box>
                  <Box></Box>
                </Box>
              </ListItem>
            )
          }
          if (option.class == 'ACCOUNT') {
            // Render Bank Account
            return (
              <ListItem key={option.id} {...rest}>
                <Box display="flex" alignItems="center" width="100%">
                  <Box marginRight={1}>
                    <BankIcon logo={option.institution?.logo} size={24} />
                  </Box>
                  <Box minWidth={200} flexGrow={1}>
                    <Typography style={{ lineHeight: 1.1 }} noWrap>
                      {option.name}
                    </Typography>
                    <Typography style={{ lineHeight: 1.1 }} color="textSecondary" noWrap>
                      {option.institution?.name}
                    </Typography>
                  </Box>
                  {!disableTooltip && (
                    <Box>
                      <Tooltip
                        title="Account Transfer"
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
                    </Box>
                  )}
                </Box>
              </ListItem>
            )
          }

          // Render Category
          return (
            <ListItem key={option.id} {...rest}>
              <Box display="flex" alignItems="center" width="100%">
                <Box marginRight={1} width={30}>
                  <Emoji size={24} emoji={option.cat_icon ?? ''} />
                </Box>
                <Box minWidth={200} flexGrow={1}>
                  <Typography style={{ lineHeight: 1.1 }} noWrap>
                    {option.name}
                  </Typography>
                  <Typography style={{ lineHeight: 1.1 }} color="textSecondary" noWrap>
                    {`${option.categoryGroup?.type} - ${option.categoryGroup?.name}`}
                  </Typography>
                </Box>
                {!disableTooltip && (
                  <Box>
                    <Tooltip
                      title={option.cat_description}
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
                  </Box>
                )}
              </Box>
            </ListItem>
          )
        }}
        filterOptions={filterOptions}
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
  }
})
