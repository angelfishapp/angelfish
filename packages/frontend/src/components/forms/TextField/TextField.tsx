import InputBase from '@mui/material/InputBase'
import React from 'react'

import { FormField } from '../FormField'
import type { TextFieldProps } from './TextField.interface'
import { useStyles } from './TextField.styles'

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
    renderValue,
    rows,
    maxRows,
    startAdornment,
    type = 'text',
    value,
    ...formFieldProps
  }: TextFieldProps,
  ref,
) {
  // Component State
  const [showValue, setShowValue] = React.useState<boolean>(renderValue ? true : false)

  const classes = useStyles({ showValue, multiline })

  /**
   * Handle bluring off the field
   */
  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (renderValue) {
      setShowValue(true)
    }
    if (onBlur) {
      onBlur(event)
    }
  }
  React.useEffect(() => {
    if (inputProps) {
      inputProps.ref?.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showValue])

  // Render
  return (
    <FormField ref={ref} disabled={disabled} id={id} {...formFieldProps}>
      {renderValue && (
        <div
          className={classes.valueRender}
          onClick={disabled ? undefined : () => setShowValue(false)}
          ref={inputRef}
        >
          {renderValue} {endAdornment}
        </div>
      )}

      <InputBase
        autoFocus={autoFocus}
        autoComplete={autoComplete ? 'on' : 'off'}
        className={classes.textField}
        defaultValue={defaultValue}
        endAdornment={endAdornment}
        id={id}
        inputComponent={inputComponent}
        inputProps={inputProps}
        multiline={multiline}
        name={name}
        onBlur={handleBlur}
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
