import FormLabel from '@mui/material/FormLabel'
import MuiTextField, { type TextFieldProps } from '@mui/material/TextField'
import React from 'react'

/**
 * TextField renders a single line or multi-line Text Input for FormField
 */

export default React.forwardRef<HTMLDivElement, TextFieldProps>(function TextField(
  { slotProps, margin = 'normal', sx, ...props }: TextFieldProps,
  ref,
) {
  // Render
  return (
    <MuiTextField
      {...props}
      slots={{
        inputLabel: FormLabel,
      }}
      sx={{
        ...sx,
        marginBottom: margin === 'normal' ? 2 : margin === 'dense' ? 1 : 0,
        fieldset: {
          legend: {
            display: 'none',
          },
        },
      }}
      slotProps={{
        ...slotProps,
        inputLabel: {
          sx: (theme) => ({
            fontWeight: 600,
            color: theme.palette.common.black,
            marginBottom: 1,
            '&.Mui-focused': {
              color: theme.custom.colors.inputFocused,
            },
            '&.Mui-error': {
              color: theme.palette.error.main,
            },
          }),
        },
      }}
      ref={ref}
    />
  )
})
