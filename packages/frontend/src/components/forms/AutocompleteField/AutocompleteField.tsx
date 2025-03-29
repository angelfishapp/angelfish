import type { AutocompleteValue } from '@mui/material/Autocomplete'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'

import { TextField } from '../TextField'
import type { AutocompleteFieldProps } from './AutocompleteField.interface'
import { VirtualizedListboxComponent } from './components/VirtualList'

/**
 * Provides Styled Autocomplete Form Field which can be used by other Field Components to create
 * Autocomplete Inputs.
 */

export default function AutocompleteField<
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>({
  // Form Field Props
  disabled,
  error,
  helperText,
  hiddenLabel,
  label,
  margin,
  required,
  size,
  fullWidth,
  // Custom Autocomplete Props
  formRef,
  getStartAdornment,
  placeholder,
  virtualize = false,
  // Autocomplete Props
  multiple,
  value,
  onChange,
  slots,
  loading,
  ...autoCompleteProps
}: AutocompleteFieldProps<T, Multiple, DisableClearable, FreeSolo>) {
  // Component State
  const initialValue = (multiple ? [] : null) as AutocompleteValue<
    T,
    Multiple,
    DisableClearable,
    FreeSolo
  >
  const [currentValue, setCurrentValue] = React.useState<
    AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>
  >(value ?? initialValue)

  /**
   * Make sure current value is updated if value changed
   */
  React.useEffect(() => {
    setCurrentValue(value as AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>)
  }, [value])

  // Render
  return (
    <Autocomplete
      {...autoCompleteProps}
      multiple={multiple}
      fullWidth={fullWidth}
      slots={{
        listbox: virtualize ? VirtualizedListboxComponent : slots?.listbox,
      }}
      disabled={disabled}
      onChange={(_event, newValue, reason, details) => {
        onChange?.(_event, newValue, reason, details)
        setCurrentValue(newValue)
      }}
      value={currentValue ?? initialValue}
      renderInput={(params) => (
        <TextField
          {...params}
          ref={formRef}
          disabled={disabled}
          error={error}
          fullWidth={fullWidth}
          placeholder={placeholder}
          helperText={helperText}
          hiddenLabel={hiddenLabel}
          required={required}
          label={label}
          margin={margin}
          size={size}
          variant="outlined"
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <React.Fragment>
                  {currentValue ? getStartAdornment?.(currentValue) : null}
                  {params.InputProps.startAdornment}
                </React.Fragment>
              ),
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
              autoComplete: 'off',
            },
          }}
        />
      )}
    />
  )
}
