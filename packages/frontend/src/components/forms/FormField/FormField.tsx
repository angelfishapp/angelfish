import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import React from 'react'

import type { FormFieldProps } from './FormField.interface'
import { StyledFormControl } from './FormField.styles'

/**
 * Provides base properties and controller for Form Fields. Allows you to have consistent Form Fields with label, helper text, errors, focus
 * etc. Essentially wraps MUI FormControl, FormLabel, FormHelper Components.
 */

export default React.forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  {
    children,
    className,
    color,
    disabled = false,
    error = false,
    FormHelperTextProps,
    fullWidth = false,
    helperText,
    hiddenLabel,
    id,
    FormLabelProps,
    label,
    required = false,
    margin = 'normal',
    ...other
  }: FormFieldProps,
  ref,
) {
  const labelId = label && id ? `${id}-label` : undefined
  const helperTextId = helperText && id ? `${id}-helper-text` : undefined
  // Render
  return (
    <StyledFormControl
      className={className}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      hiddenLabel={hiddenLabel}
      ref={ref}
      required={required}
      color={color}
      margin={margin}
      {...other}
    >
      {label && (
        <FormLabel htmlFor={id} id={labelId} {...FormLabelProps}>
          {label}
        </FormLabel>
      )}

      {children}

      {helperText && (
        <FormHelperText id={helperTextId} {...FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </StyledFormControl>
  )
})
