import type { SwitchProps } from '@mui/material'

import type { FormFieldProps } from '../FormField'

/**
 * SwitchField Component Properties
 */

export interface SwitchFieldProps extends FormFieldProps {
  /**
   * The color of the switch when checked.
   * @default 'primary'
   */
  checkedColor?: SwitchProps['color']
  /**
   * The default value of the field.
   */
  defaultValue?: boolean
  /**
   * Display a label on the left side of the switch.
   */
  leftLabel?: string
  /**
   * Display a label on the right side of the switch.
   */
  rightLabel?: string
  /**
   * Callback for when field value is changed
   */
  onChange?: (value: boolean) => void
  /**
   * Style overrides for the switch component.
   */
  sx?: SwitchProps['sx']
  /**
   * The value of the field, required for a controlled component.
   */
  value?: boolean
}
