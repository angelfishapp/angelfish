import React from 'react'

import { FormField } from '../FormField'
import type { TextFieldProps } from './TextField.interface'
import { StyledInputBase } from './TextField.styles'

/**
 * TextField renders a single line or multi-line Text Input for FormField
 */

export default React.forwardRef<HTMLDivElement, TextFieldProps>(function TextField(
  {
    autoFocus = false,
    autoComplete = false,
    disabled = false,
    defaultValue,
    endAdornment,
    id,
    inputComponent,
    inputProps,
    InputProps,
    inputRef,
    multiline = false,
    name,
    onBlur,
    onChange,
    onFocus,
    onKeyDown,
    onKeyUp,
    placeholder,
    rows,
    maxRows,
    startAdornment,
    type = 'text',
    value,
    ...formFieldProps
  }: TextFieldProps,
  ref,
) {
  // Render
  return (
    <FormField ref={ref} disabled={disabled} id={id} {...formFieldProps}>
      <StyledInputBase
        autoFocus={autoFocus}
        autoComplete={autoComplete ? 'on' : 'off'}
        defaultValue={defaultValue}
        endAdornment={endAdornment}
        id={id}
        inputComponent={inputComponent}
        inputProps={inputProps}
        multiline={multiline}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        placeholder={placeholder}
        ref={inputRef}
        rows={rows}
        maxRows={maxRows}
        startAdornment={startAdornment}
        type={type}
        value={value}
        {...InputProps}
      />
    </FormField>
  )
})
