import type { FormFieldProps } from '../FormField'

/**
 * PhoneField Component Properties
 */

export interface PhoneFieldProps extends FormFieldProps {
  /**
   * onChange Callback when field value is updated
   */
  onChange?: (phone: string, isValid: boolean) => void
  /**
   * Set value for controlled field
   * @default ''
   */
  value?: string
}
