import Switch from '@mui/material/Switch'
import React from 'react'

import { FormField } from '../FormField'
import type { SwitchFieldProps } from './SwitchField.interface'

/**
 * Provides Switch Field for boolean values on Forms.
 */
export default React.forwardRef<HTMLDivElement, SwitchFieldProps>(function EmojiField(
  { defaultValue, onChange, value, ...formFieldProps }: SwitchFieldProps,
  ref,
) {
  // Render
  return (
    <FormField ref={ref} {...formFieldProps}>
      <Switch
        checked={value}
        defaultChecked={defaultValue}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </FormField>
  )
})
