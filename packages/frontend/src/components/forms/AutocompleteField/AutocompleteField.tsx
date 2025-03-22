import type { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'

import { TextField } from '@/components/forms/TextField'
import FormField from '../FormField/FormField'
import type { AutocompleteFieldProps } from './AutocompleteField.interface'
import { useStyles } from './AutocompleteField.styles'
import { VirtualizedListboxComponent } from './components/VirtualList'

/**
 * Provides Styled Autocomplete Form Field which can be used by other Field Components to create
 * Autocomplete Inputs.
 */

export default function AutocompleteField<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>({
  autoComplete = false,
  autoHighlight = false,
  autoSelect = false,
  blurOnSelect = false,
  clearOnBlur,
  defaultValue,
  disableClearable,
  disableCloseOnSelect = false,
  disabledItemsFocusable = false,
  disableListWrap = false,
  filterOptions,
  filterSelectedOptions = false,
  formRef,
  freeSolo,
  getOptionDisabled,
  getOptionLabel,
  getOptionSelected,
  groupBy,
  handleHomeEndKeys,
  inputValue,
  ListboxComponent,
  loading = false,
  noOptionsText,
  onChange,
  onClose,
  onInputChange,
  onOpen,
  onHighlightChange,
  open,
  openOnFocus = false,
  options = [],
  placeholder,
  renderOption,
  renderGroup,
  renderTags,
  renderValue,
  selectOnFocus,
  multiple,
  value,
  virtualize = false,
  id,
  disabled,
  error,
  focused,
  ...formFieldProps
}: AutocompleteFieldProps<T, Multiple, DisableClearable, FreeSolo>) {
  const classes = useStyles()

  if (process.env.NODE_ENV !== 'production') {
    if (multiple && renderValue) {
      console.error('You cannot use renderValue() property when multiple is set.') // eslint-disable-line no-console
    }
  }

  // Component State
  const [isFocused, setIsFocused] = React.useState<boolean>(focused ?? false)
  const [currentValue, setCurrentValue] = React.useState<T | undefined>(
    value ? (value as T) : defaultValue ? (defaultValue as T) : undefined,
  )

  /**
   * Make sure current value is updated if value changed
   */
  React.useEffect(() => {
    setCurrentValue(value as T)
  }, [value])

  // Render
  return (
    <FormField
      id={id}
      disabled={disabled}
      error={error}
      focused={isFocused}
      ref={formRef}
      {...formFieldProps}
    >
      <Autocomplete
        autoComplete={autoComplete}
        autoHighlight={autoHighlight}
        autoSelect={autoSelect}
        blurOnSelect={blurOnSelect}
        clearOnBlur={clearOnBlur}
        defaultValue={defaultValue}
        disabled={disabled}
        disableClearable={disableClearable}
        disableCloseOnSelect={disableCloseOnSelect}
        disabledItemsFocusable={disabledItemsFocusable}
        disableListWrap={disableListWrap}
        filterOptions={filterOptions}
        filterSelectedOptions={filterSelectedOptions}
        freeSolo={freeSolo}
        getOptionDisabled={getOptionDisabled}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={getOptionSelected}
        inputValue={inputValue}
        groupBy={groupBy}
        handleHomeEndKeys={handleHomeEndKeys}
        ListboxComponent={virtualize ? VirtualizedListboxComponent : ListboxComponent}
        loading={loading}
        noOptionsText={noOptionsText}
        onBlur={() => setIsFocused(false)}
        onChange={(event, value, reason, details) => {
          onChange?.(event, value, reason, details)
          setCurrentValue(value as T)
        }}
        onClose={onClose}
        onFocus={() => setIsFocused(true)}
        onInputChange={onInputChange}
        onKeyDown={(event) => event.stopPropagation()}
        onOpen={onOpen}
        onHighlightChange={onHighlightChange}
        open={open}
        openOnFocus={openOnFocus}
        options={options}
        renderOption={renderOption}
        renderGroup={renderGroup}
        renderTags={renderTags}
        selectOnFocus={selectOnFocus}
        multiple={multiple}
        value={value}
        id={id}
        classes={{
          paper: classes.autocompletePaper,
          endAdornment: classes.endAdornment,
        }}
        renderInput={(params: AutocompleteRenderInputParams) => {
          return (
            <TextField
              id={params.id}
              disabled={params.disabled}
              fullWidth={params.fullWidth}
              margin="none"
              placeholder={placeholder}
              startAdornment={params.InputProps.startAdornment}
              endAdornment={
                <React.Fragment>
                  {loading ? (
                    <CircularProgress
                      color="inherit"
                      size={20}
                      className={classes.loadingIndicator}
                    />
                  ) : undefined}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              }
              inputRef={params.InputProps.ref}
              inputProps={params.inputProps}
              renderValue={renderValue ? renderValue(currentValue as T) : undefined}
            />
          )
        }}
      />
    </FormField>
  )
}
