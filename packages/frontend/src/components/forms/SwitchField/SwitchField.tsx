import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import React from 'react'

import { FormField } from '../FormField'
import type { SwitchFieldProps } from './SwitchField.interface'

/**
 * Provides Switch Field for boolean values on Forms.
 */
export default React.forwardRef<HTMLDivElement, SwitchFieldProps>(function EmojiField(
  {
    checkedColor,
    defaultValue,
    leftLabel,
    rightLabel,
    onChange,
    sx,
    value,
    FormHelperTextProps,
    ...formFieldProps
  }: SwitchFieldProps,
  ref,
) {
  const helperTextProps = {
    ...FormHelperTextProps,
    sx: { ...FormHelperTextProps?.sx, marginLeft: 0 },
  }

  // Render
  return (
    <FormField ref={ref} FormHelperTextProps={helperTextProps} {...formFieldProps}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        {leftLabel && <span>{leftLabel}</span>}
        <Switch
          checked={value}
          defaultChecked={defaultValue}
          onChange={(e) => onChange?.(e.target.checked)}
          color={checkedColor}
          sx={sx}
        />
        {rightLabel && <span>{rightLabel}</span>}
      </Stack>
    </FormField>
  )
})
