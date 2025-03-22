import InfoIcon from '@mui/icons-material/Info'
import type { AutocompleteRenderGroupParams } from '@mui/material'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListSubheader from '@mui/material/ListSubheader'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { FilterOptionsState } from '@mui/material/useAutocomplete'
import React from 'react'

import BankIcon from '@/components/BankIcon/BankIcon'
import CategoryLabel from '@/components/CategoryLabel/CategoryLabel'
import { Emoji } from '@/components/Emoji'
import AutocompleteField from '@/components/forms/AutocompleteField/AutocompleteField'
import type { IAccount } from '@angelfish/core'
import type { CategoryFieldProps } from './CategoryField.interface'
import { useStyles } from './CategoryField.styles'

/**
 * Autocomplete Field for selecting a Category or Account
 */

export default React.forwardRef<HTMLDivElement, CategoryFieldProps>(function CategoryField(
  {
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
  const classes = useStyles()

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

  /**
   * Filter Options Callback As User Types in Search Field
   */
  const filterOptions = React.useCallback(
    (options: IAccount[], params: FilterOptionsState<IAccount>) => {
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
            cat_icon: ':new:',
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
    [searchOptions, componentFilterOptions, onCreate],
  )

  /**
   * Callback to render value. Show Unclassified if create option is selected
   */
  const renderValue = React.useCallback((option: IAccount) => {
    return <CategoryLabel account={option?.id === 0 ? undefined : option} />
  }, [])

  /**
   * Callback to render list option
   */
  const renderOption = React.useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: IAccount) => {
      if (option.id == 0) {
        // Render Create Category Option if onCreate provided
        return (
          <ListItem {...props}>
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
          <ListItem {...props}>
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
                    classes={{
                      tooltip: classes.descriptionTooltip,
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
        <ListItem {...props}>
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
                  classes={{
                    tooltip: classes.descriptionTooltip,
                  }}
                >
                  <InfoIcon fontSize="small" color="primary" />
                </Tooltip>
              </Box>
            )}
          </Box>
        </ListItem>
      )
    },
    [classes, disableTooltip],
  )

  /**
   * Render Group - required to display virtualized rows
   */
  const renderGroup = React.useCallback((params: AutocompleteRenderGroupParams) => {
    if (!params.group) {
      return [params.children]
    }

    return [
      <ListSubheader key={params.key} component="div">
        {params.group}
      </ListSubheader>,
      params.children,
    ]
  }, [])

  // Render
  return (
    <AutocompleteField
      id={id}
      formRef={ref}
      multiple={false}
      freeSolo={onCreate ? true : false}
      {...formFieldProps}
      options={sortedAccounts}
      value={value}
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
        if (option.class == 'CATEGORY') {
          return (option.categoryGroup?.name ?? '') + ':' + option.name
        }
        return (option.institution?.name ?? '') + ':' + option.name
      }}
      getOptionSelected={(option, value) => {
        if (!value) {
          return false
        }
        if (value.id > 0) {
          return option.id == value.id
        }
        return false
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
      virtualize={true}
      renderGroup={renderGroup}
      renderOption={renderOption}
      renderValue={renderAsValue ? renderValue : undefined}
      filterOptions={filterOptions}
      placeholder={placeholder}
    />
  )
})
