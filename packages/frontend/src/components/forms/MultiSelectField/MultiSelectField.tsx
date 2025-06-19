import ClearIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import useAutocomplete, { createFilterOptions } from '@mui/material/useAutocomplete'

import React from 'react'

import { TextField } from '../TextField'
import type {
  MultiSelectFieldOwnerState,
  MultiSelectFieldProps,
} from './MultiSelectField.interface'
import { defaultGetOptionLabel, renderGroup, renderListOption } from './MultiSelectField.utils'

/**
 * Multi-Select Field Component. Renders options in a searchable fixed size list with checkboxes and optional grouping allowing user
 * to easily browse and select multiple options on Forms. Uses the useAutocomplete hook from MUI so works very similar to the Autocomplete
 * component.
 */
export default function MultiSelectField<Value>({
  defaultValue,
  disabled = false,
  options,
  filterOptions = createFilterOptions<Value>(),
  formRef,
  fullWidth = true,
  getOptionDisabled,
  getOptionLabel = defaultGetOptionLabel,
  getOptionKey,
  groupBy,
  id = 'multi-select-field',
  isOptionEqualToValue = (option, value) => option === value,
  label,
  maxHeight = 400,
  noOptionsText = 'No options',
  onChange,
  placeholder,
  renderOption,
  value,
  ...formFieldProps
}: MultiSelectFieldProps<Value>) {
  // useAutoComplete hook
  const {
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value: selectedValues,
    inputValue,
  } = useAutocomplete<Value, true, false, false>({
    id,
    multiple: true,
    options,
    value,
    onChange: onChange
      ? (event, newValue, reason, details) => {
          onChange(event, newValue, reason, details?.option ? [details.option] : [])
        }
      : undefined,
    getOptionLabel,
    getOptionDisabled,
    // @ts-ignore: Suspect Type bug in MUI types
    groupBy,
    getOptionKey,
    defaultValue,
    isOptionEqualToValue,
    open: true,
    componentName: 'MultiSelectField',
    filterOptions,
  })

  // Generate owner state for the component
  const ownerState: MultiSelectFieldOwnerState<Value> = {
    onChange,
    renderOption: renderOption || getOptionLabel,
    selectedValues,
  }

  // Render
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', minWidth: 300 }}>
      <TextField
        {...formFieldProps}
        id={id}
        label={label}
        disabled={disabled}
        ref={formRef}
        variant="outlined"
        placeholder={placeholder}
        fullWidth
        margin="none"
        inputProps={getInputProps()}
        slotProps={{
          input: {
            sx: {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderBottom: 'none',
            },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: inputValue ? (
              <InputAdornment position="end">
                <IconButton size="small" disabled={disabled}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />
      <Box
        sx={{
          flexGrow: 1,
          border: '1px solid rgba(0, 0, 0, 0.12)',
          overflow: 'auto',
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          },
          height: maxHeight,
        }}
      >
        <List disablePadding {...getListboxProps()}>
          {groupedOptions.length > 0 ? (
            <React.Fragment>
              {groupedOptions.map((option, index) => {
                if (groupBy) {
                  return renderGroup(
                    {
                      key: option.key,
                      group: option.group,
                      children: option.options.map((option2, index2) => {
                        const optionProps = getOptionProps({
                          option: option2,
                          index: option.index + index2,
                        })
                        return renderListOption(
                          optionProps,
                          option2,
                          {
                            selected:
                              typeof optionProps['aria-selected'] === 'boolean'
                                ? optionProps['aria-selected']
                                : false,
                            index,
                            inputValue,
                          },
                          ownerState,
                        )
                      }),
                    },
                    option.options,
                    ownerState,
                  )
                }
                const optionProps = getOptionProps({ option: option as Value, index })
                return renderListOption(
                  optionProps,
                  option as Value,
                  {
                    selected:
                      typeof optionProps['aria-selected'] === 'boolean'
                        ? optionProps['aria-selected']
                        : false,
                    index,
                    inputValue,
                  },
                  ownerState,
                )
              })}
            </React.Fragment>
          ) : (
            <ListItem>
              <ListItemText
                primary={noOptionsText}
                slotProps={{ primary: { align: 'center', color: 'text.secondary' } }}
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
          onClick={(event) => {
            // Check if all options are selected
            const allSelected = options.every((option) => selectedValues.includes(option))
            if (allSelected) {
              // Deselect all options
              onChange?.(event, [], 'removeAll', [...options])
            } else {
              const details: Value[] = []
              options.forEach((option) => {
                if (!allSelected && !selectedValues.includes(option)) {
                  details.push(option)
                }
              })
              // Select all options
              onChange?.(event, [...options], 'selectAll', details)
            }
          }}
          disabled={disabled}
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
    </Box>
  )
}
