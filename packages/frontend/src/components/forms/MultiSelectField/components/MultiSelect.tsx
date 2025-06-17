'use client'

import type { IAccount, IInstitution, ITag } from '@angelfish/core'
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  IndeterminateCheckBox as IndeterminateCheckBoxIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import {
  Box,
  Checkbox,
  Collapse,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  useAutocomplete,
} from '@mui/material'
import React from 'react'
import { TextField } from '../../TextField'
import { RenderOption } from './RenderOption'

interface MultiSelectProps<T extends IAccount | ITag | IInstitution> {
  options: T[]
  value?: T[]
  defaultValue?: T[]
  onChange: (value: T[]) => void
  getOptionLabel?: (option: T) => string
  getOptionKey?: (option: T) => string | number
  groupBy?: (option: T) => string
  isOptionEqualToValue?: (option: T, value: T) => boolean
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  maxHeight?: number | string
  renderGroup?: (params: any) => React.ReactNode
  disableTooltip: boolean
  formRef: any
  label: string
}

export default function MultiSelect<T extends IAccount | ITag | IInstitution>({
  options,
  value,
  onChange,
  getOptionLabel = (option: T) => option.name || String(option),
  getOptionKey = (option: T) => option.id ?? option.name ?? getOptionLabel(option),
  groupBy,
  isOptionEqualToValue = (option: T, value: T) => getOptionKey(option) === getOptionKey(value),
  disabled = false,
  readOnly = false,
  placeholder,
  maxHeight = 400,
  renderGroup,
  label,
  disableTooltip,
}: MultiSelectProps<T>) {
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>([])
  const {
    getInputProps,
    getListboxProps,
    groupedOptions,
    value: selectedOptions,
    inputValue,
  } = useAutocomplete<T, true, false, false>({
    multiple: true,
    options,
    value,
    onChange: (_event, value) => {
      onChange?.(value)
    },
    getOptionLabel,
    isOptionEqualToValue,
    open: true,
    filterOptions: (opts, { inputValue }) =>
      inputValue.trim() === ''
        ? opts
        : opts.filter((option) =>
            getOptionLabel(option).toLowerCase().includes(inputValue.toLowerCase()),
          ),
  })

  const customGroupedOptions = React.useMemo(() => {
    if (!groupBy) return [{ group: null, options: groupedOptions as T[] }]
    const groups = new Map<string, T[]>()
    ;(groupedOptions as T[]).forEach((option) => {
      const group = groupBy(option)
      if (!groups.has(group)) groups.set(group, [])
      groups.get(group)!.push(option)
    })
    return Array.from(groups.entries()).map(([group, options]) => ({ group, options }))
  }, [groupedOptions, groupBy])

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupName) ? prev.filter((g) => g !== groupName) : [...prev, groupName],
    )
  }
  const toggleAll = () => {
    if (selectedOptions?.length === options.length) {
      onChange?.([])
    } else {
      onChange?.([...options])
    }
  }

  const isSelected = (option: T) => {
    return selectedOptions?.some((selected) => isOptionEqualToValue(option, selected))
  }

  const isGroupSelected = (groupOptions: T[]) => groupOptions.every((opt) => isSelected(opt))

  const isGroupPartiallySelected = (groupOptions: T[]) => {
    const count = groupOptions.filter(isSelected).length
    return count > 0 && count < groupOptions.length
  }

  const toggleGroupOptions = (groupOptions: T[]) => {
    const fullySelected = isGroupSelected(groupOptions)
    const newVal = fullySelected
      ? selectedOptions.filter((sel) => !groupOptions.some((g) => isOptionEqualToValue(sel, g)))
      : [...selectedOptions, ...groupOptions.filter((g) => !isSelected(g))]
    onChange?.(newVal)
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {selectedOptions?.length} selected
          </Typography>
        </Box>
        <TextField
          variant="outlined"
          placeholder={placeholder}
          fullWidth
          disabled={disabled}
          inputProps={getInputProps()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: inputValue ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  disabled={disabled}
                  onClick={() => {
                    /* clear logic */
                  }}
                >
                  &times;
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
        <Paper
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: maxHeight,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              '&::-webkit-scrollbar': { width: '8px' },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
              },
            }}
          >
            <List disablePadding {...getListboxProps()}>
              {customGroupedOptions.map((group, i) => (
                <React.Fragment key={group.group + `g${i}`}>
                  {i > 0 && <Divider />}
                  {groupBy && group.group && (
                    <ListItem
                      onClick={() => toggleGroup(group.group!)}
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.03)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' },
                        cursor: 'pointer',
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox
                          edge="start"
                          checked={isGroupSelected(group.options)}
                          indeterminate={isGroupPartiallySelected(group.options)}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleGroupOptions(group.options)
                          }}
                          disabled={disabled || readOnly}
                          checkedIcon={<CheckBoxIcon />}
                          icon={<CheckBoxOutlineBlankIcon />}
                          indeterminateIcon={<IndeterminateCheckBoxIcon />}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            {renderGroup
                              ? renderGroup({ group: group.group, children: null })
                              : group.group}
                          </Typography>
                        }
                      />
                      {expandedGroups.includes(group.group) ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </ListItem>
                  )}

                  <Collapse
                    in={!groupBy || !group.group || !expandedGroups.includes(group.group)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List disablePadding>
                      {group.options.map((option) => (
                        <RenderOption
                          key={getOptionKey(option)}
                          props={{ key: String(getOptionKey(option)) }}
                          option={option}
                          selected={selectedOptions}
                          setSelected={onChange}
                          disableTooltip={disableTooltip}
                          label={label}
                        />
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              ))}

              {customGroupedOptions.every((g) => g.options.length === 0) && (
                <ListItem>
                  <ListItemText
                    primary={`No ${label} found`}
                    primaryTypographyProps={{ align: 'center', color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </List>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              p: 1,
              bgcolor: 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <Box
              component="button"
              onClick={toggleAll}
              disabled={disabled || readOnly}
              sx={{
                background: 'none',
                border: 'none',
                color: disabled ? 'text.disabled' : 'primary.main',
                cursor: disabled ? 'default' : 'pointer',
                fontSize: '0.875rem',
                p: 0,
                textDecoration: disabled ? 'none' : 'underline',
                '&:hover': {
                  color: disabled ? 'text.disabled' : 'primary.dark',
                },
              }}
            >
              Toggle All
            </Box>
          </Box>
        </Paper>
      </Paper>
    </Box>
  )
}
