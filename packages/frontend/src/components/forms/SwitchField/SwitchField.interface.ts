import type { FormFieldProps } from '../FormField'

/**
 * SwitchField Component Properties
 */

export interface SwitchFieldProps extends FormFieldProps {
  /**
   * The default value of the field.
   */
  defaultValue?: boolean
  /**
   * Callback for when field value is changed
   */
  onChange?: (value: boolean) => void
  /**
   * The value of the field, required for a controlled component.
   */
  value?: boolean
}
