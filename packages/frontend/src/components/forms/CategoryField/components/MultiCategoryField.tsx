import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoIcon from '@mui/icons-material/Info'
import { Checkbox, Collapse } from '@mui/material'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'

import BankIcon from '@/components/BankIcon/BankIcon'
import { Emoji } from '@/components/Emoji'
import AutocompleteField from '@/components/forms/AutocompleteField/AutocompleteField'
import type { IAccount } from '@angelfish/core'
import type { CategoryFieldProps } from '../CategoryField.interface'

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
  // handling item or group selecting and collapassed
  const [selected, setSelected] = useState<IAccount[]>([])
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

  const handleGroupToggle = (group: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }))
  }

  const handleGroupSelect = (groupName: string, checked: boolean) => {
    const groupOptions: any = sortedAccounts.filter(
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
      multiple={true}
      freeSolo={onCreate ? true : false}
      disableClearable={false}
      options={sortedAccounts}
      value={selected}
      placeholder={placeholder}
      autoHighlight
      selectOnFocus
      onChange={(_, newValue) => {
        setSelected(newValue as IAccount[])

        if (typeof newValue === 'string') {
          onCreate?.(newValue)
        } else if (Array.isArray(newValue)) {
          const accountsOnly = newValue.filter((item): item is IAccount => typeof item !== 'string')
          onChange?.(accountsOnly)
        }
      }}
      getOptionLabel={(option) => {
        if (!option) return ''

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
      renderGroup={(params) => {
        const isCollapsed = collapsedGroups[params.group] ?? false
        return (
          <Box key={params.key}>
            <Box
              display="flex"
              alignItems="center"
              px={2}
              py={1}
              sx={{ backgroundColor: '#f5f5f5', cursor: 'pointer' }}
              onClick={() => handleGroupToggle(params.group)}
            >
              {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              <Box display="flex" alignItems="center">
                <Checkbox
                  size="small"
                  checked={isGroupChecked(params.group)}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleGroupSelect(params.group, !isGroupChecked(params.group))
                  }}
                />
                <Typography variant="subtitle2">{params.group}</Typography>
              </Box>
            </Box>
            <Collapse in={!isCollapsed}>{params.children}</Collapse>
          </Box>
        )
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
                <Box marginRight={1} marginLeft={10}>
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
            <Checkbox
              checked={selected.some((s) => s.id === option.id)}
              style={{ marginLeft: 40, marginRight: 8 }}
              onClick={(e) => {
                e.stopPropagation()
                if (selected.some((s) => s.id === option.id)) {
                  setSelected(selected.filter((s) => s.id !== option.id))
                } else {
                  setSelected([...selected, option])
                }
              }}
            />
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
      // this is not suitable with the rendering of groups of items so commented
      //   getStartAdornment={(value) => {
      //     if (!Array.isArray(value)) return null

      //     return (
      //       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      //         {value.map((item, idx) => {
      //           if (typeof item === 'string') return null

      //           if (item.id === 0) {
      //             return (
      //               <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
      //                 <Emoji size={24} emoji={item.cat_icon ?? ''} />
      //               </Box>
      //             )
      //           }

      //           return (
      //             <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
      //               {item.class === 'CATEGORY' ? (
      //                 <>
      //                   <Emoji size={24} emoji={item.cat_icon ?? ''} style={{ marginRight: 8 }} />
      //                   {item.categoryGroup?.name} &gt;
      //                 </>
      //               ) : (
      //                 <>
      //                   <BankIcon
      //                     logo={item.institution?.logo}
      //                     size={24}
      //                     style={{ marginRight: 8 }}
      //                   />
      //                   {item.institution?.name} &gt;
      //                 </>
      //               )}
      //             </Box>
      //           )
      //         })}
      //       </Box>
      //     )
      //   }}
      {...formFieldProps}
    />
  )
})
