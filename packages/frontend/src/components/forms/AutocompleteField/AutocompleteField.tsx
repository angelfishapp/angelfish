import type { AutocompleteValue } from '@mui/material/Autocomplete'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import React from 'react'

import FormField from '../FormField/FormField'
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
  onFocus,
  onBlur,
  onChange,
  ListboxComponent,
  loading,
  ...autoCompleteProps
}: AutocompleteFieldProps<T, Multiple, DisableClearable, FreeSolo>) {
  // Component State
  const [isFocused, setIsFocused] = React.useState<boolean>(false)
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
      ListboxComponent={virtualize ? VirtualizedListboxComponent : ListboxComponent}
      disabled={disabled}
      onChange={(_event, newValue, reason, details) => {
        onChange?.(_event, newValue, reason, details)
        setCurrentValue(newValue)
      }}
      value={currentValue ?? initialValue}
      onFocus={(event) => {
        setIsFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setIsFocused(false)
        onBlur?.(event)
      }}
      renderInput={(params) => (
        <FormField
          label={label}
          margin={margin}
          required={required}
          size={size}
          helperText={helperText}
          hiddenLabel={hiddenLabel}
          focused={isFocused}
          disabled={disabled}
          error={error}
          fullWidth={fullWidth}
          ref={formRef}
        >
          <TextField
            {...params}
            label=""
            error={error}
            variant="outlined"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'off',
            }}
            InputProps={{
              ...params.InputProps,
              placeholder,
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
            }}
          />
        </FormField>
      )}
    />
  )
}
