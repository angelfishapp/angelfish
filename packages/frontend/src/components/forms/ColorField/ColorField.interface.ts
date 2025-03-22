import type { FormFieldProps } from '../FormField'

/**
 * ColorField Component Properties
 */

export interface ColorFieldProps extends FormFieldProps {
  /**
   * The default value of the `input` element.
   * @default '#FFFFFF'
   */
  defaultValue?: string
  /**
   * Callback for when field value is changed
   */
  onChange?: (color: string) => void
  /**
   * The value of the `input` element, required for a controlled component.
   */
  value?: string
}
