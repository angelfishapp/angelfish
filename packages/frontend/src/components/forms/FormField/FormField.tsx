import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import clsx from 'clsx'
import React from 'react'

import type { FormFieldProps } from './FormField.interface'
import { useStyles } from './FormField.styles'

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

  const classes = useStyles({ margin })

  // Render
  return (
    <FormControl
      className={clsx(classes.formField, className)}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      hiddenLabel={hiddenLabel}
      ref={ref}
      required={required}
      color={color}
      margin="none"
      {...other}
    >
      {label && (
        <FormLabel htmlFor={id} id={labelId} className={classes.formLabel} {...FormLabelProps}>
          {label}
        </FormLabel>
      )}

      {children}

      {helperText && (
        <FormHelperText id={helperTextId} {...FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
})
